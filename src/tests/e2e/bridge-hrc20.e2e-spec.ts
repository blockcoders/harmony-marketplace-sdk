import 'dotenv/config'
import { TxStatus } from '@harmony-js/transaction'
import { ChainType, hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BridgedHRC20Token, HRC20EthManager, HRC20HmyManager, HRC20TokenManager } from '../../bridge'
import { HRC20 } from '../../contracts'
import {
  WALLET_HMY_MASTER,
  WALLET_ETH_MASTER,
  WALLET_ETH_OWNER,
  WALLET_HMY_OWNER,
  ETH_MASTER_ADDRESS,
  HMY_MASTER_ADDRESS,
  HMY_OWNER_ADDRESS,
  ETH_OWNER_ADDRESS,
  ContractName,
  E2E_TX_OPTIONS,
} from '../constants'
import { deployContract, deployEthContract } from '../helpers'
import { HARMONY_RPC_DEVNET_WS } from '../../constants'
import { waitForNewBlock } from '../../utils'

use(chaiAsPromised)

describe('Bridge HRC20 Token', () => {
  const name = 'Blockcoders'
  const symbol = 'BC'
  const decimals = 18
  const amount = (500 * 10 ** decimals).toString() // 500 in Gwei
  let lockTokenTxHash: string
  let burnTokenTxHash: string
  let hrc20: HRC20
  let ownerHrc20: HRC20
  let erc20Addr: string
  let bridgedToken: BridgedHRC20Token
  let ethManager: HRC20EthManager
  let ownerEthManager: HRC20EthManager
  let hmyManager: HRC20HmyManager
  let tokenManager: HRC20TokenManager

  before(async () => {
    // Deploy contracts
    const [hrc20Options, ethManagerOptions] = await Promise.all([
      deployContract(ContractName.BlockcodersHRC20, WALLET_HMY_MASTER, [name, symbol, decimals]),
      deployEthContract(ContractName.HRC20EthManager, WALLET_ETH_MASTER, [ETH_MASTER_ADDRESS]),
    ])
    const [hmyManagerOptions, tokenManagerOptions] = await Promise.all([
      deployContract(ContractName.HRC20HmyManager, WALLET_HMY_MASTER, [HMY_MASTER_ADDRESS]),
      deployEthContract(ContractName.HRC20TokenManager, WALLET_ETH_MASTER),
    ])

    // Create contract instances
    hrc20 = new HRC20(hrc20Options.addr, hrc20Options.abi, WALLET_HMY_MASTER)
    ownerHrc20 = new HRC20(hrc20Options.addr, hrc20Options.abi, WALLET_HMY_OWNER)
    hmyManager = new HRC20HmyManager(hmyManagerOptions.addr, WALLET_HMY_MASTER)
    ethManager = new HRC20EthManager(ethManagerOptions.addr, WALLET_ETH_MASTER)
    ownerEthManager = new HRC20EthManager(ethManagerOptions.addr, WALLET_ETH_OWNER)
    tokenManager = new HRC20TokenManager(tokenManagerOptions.addr, WALLET_ETH_MASTER)

    // approve HRC20EthManager on HRC20TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC20TokenManager rely tx hash: ', relyTx.transactionHash)

    // Add token manager
    const addTokenTx = await ethManager.addToken(tokenManager.address, hrc20.address, name, symbol, decimals)
    console.info('HRC20EthManager addToken tx hash: ', addTokenTx.transactionHash)

    erc20Addr = await ethManager.mappings(hrc20.address)
    bridgedToken = new BridgedHRC20Token(erc20Addr, WALLET_ETH_OWNER)
  })

  it('contracts should be defined', () => {
    expect(hrc20).to.not.be.undefined
    expect(ownerHrc20).to.not.be.undefined
    expect(bridgedToken).to.not.be.undefined
    expect(ethManager).to.not.be.undefined
    expect(hmyManager).to.not.be.undefined
    expect(tokenManager).to.not.be.undefined
  })

  it('hrc20 holder should have zero tokens before mint', async () => {
    const balance = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

    expect(balance.isZero()).to.be.true
  })

  it(`hrc20 holder should have ${amount} tokens after mint`, async () => {
    const mintTx = await hrc20.mint(HMY_OWNER_ADDRESS, amount, E2E_TX_OPTIONS)

    console.info('HRC20 mint tx hash: ', mintTx.id)

    const balance = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

    expect(mintTx.txStatus).eq(TxStatus.CONFIRMED)
    expect(balance.isZero()).to.not.be.true
    expect(balance.eq(new BN(amount))).to.be.true
  })

  it('hrc20 holder should approve Harmony Manager', async () => {
    const approveTx = await ownerHrc20.approve(hmyManager.address, amount, E2E_TX_OPTIONS)

    expect(approveTx.id).to.not.be.undefined
    expect(approveTx.txStatus).eq(TxStatus.CONFIRMED)

    console.info('HRC20 approve tx hash: ', approveTx.id)
  })

  it('Harmony Manager should lock the holder tokens', async () => {
    const balanceBeforeLock = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

    expect(balanceBeforeLock.eq(new BN(amount))).to.be.true

    const lockTokenTx = await hmyManager.lockTokenFor(
      hrc20.address,
      HMY_OWNER_ADDRESS,
      amount,
      HMY_OWNER_ADDRESS,
      E2E_TX_OPTIONS,
    )

    lockTokenTxHash = lockTokenTx.id

    expect(lockTokenTxHash).to.not.be.undefined
    expect(lockTokenTx.receipt?.blockNumber).to.not.be.undefined
    expect(lockTokenTx.txStatus).eq(TxStatus.CONFIRMED)

    console.info('HRC20HmyManager lockTokenFor tx hash: ', lockTokenTxHash)

    await waitForNewBlock(
      parseInt(hexToNumber(lockTokenTx.receipt?.blockNumber ?? ''), 10) + 6,
      HARMONY_RPC_DEVNET_WS,
      ChainType.Harmony,
      4,
    )

    const balanceAfterLock = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
    const balanceHmyManager = await hrc20.balanceOf(hmyManager.address, E2E_TX_OPTIONS)

    expect(balanceAfterLock.isZero()).to.be.true
    expect(balanceHmyManager.eq(new BN(amount))).to.be.true
  })

  it(`erc20 holder should have ${amount} tokens after mint in eth side`, async () => {
    const balanceBeforeMint = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)

    expect(balanceBeforeMint.isZero()).to.be.true

    const mintTokenTx = await ethManager.mintToken(erc20Addr, amount, ETH_OWNER_ADDRESS, lockTokenTxHash)

    expect(mintTokenTx.transactionHash).to.not.be.undefined
    expect(mintTokenTx.status).eq(1) // The status of a transaction is 1 is successful

    console.info('HRC20EthManager mintToken tx hash: ', mintTokenTx.transactionHash)

    const balanceAfterLock = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)

    expect(balanceAfterLock.eq(amount)).to.be.true
  })

  it('erc20 holder should approve Ethereum Manager', async () => {
    const approveTx = await bridgedToken.approve(ethManager.address, amount)

    expect(approveTx.transactionHash).to.not.be.undefined
    expect(approveTx.status).eq(1) // The status of a transaction is 1 is successful

    console.info('HRC20 approve tx hash: ', approveTx.transactionHash)
  })

  it('erc20 holder should burn the tokens through Ethereum Manager', async () => {
    const balanceBeforeBurn = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)

    expect(balanceBeforeBurn.eq(amount)).to.be.true

    const burnTx = await ownerEthManager.burnToken(erc20Addr, amount, HMY_OWNER_ADDRESS)

    expect(burnTx.transactionHash).to.not.be.undefined
    expect(burnTx.status).eq(1) // The status of a transaction is 1 is successful

    burnTokenTxHash = burnTx.transactionHash

    console.info('HRC20EthManager burnToken tx hash: ', burnTokenTxHash)

    const balanceAfterBurn = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)

    expect(balanceAfterBurn.isZero()).to.be.true
  })

  it(`hrc20 holder should have ${amount} tokens after unlock in Harmony side`, async () => {
    const balanceBeforeUnlock = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

    expect(balanceBeforeUnlock.isZero()).to.be.true

    const unlockTokenTx = await hmyManager.unlockToken(
      hrc20.address,
      amount,
      HMY_OWNER_ADDRESS,
      burnTokenTxHash,
      E2E_TX_OPTIONS,
    )

    expect(unlockTokenTx.id).to.not.be.undefined
    expect(unlockTokenTx.receipt?.blockNumber).to.not.be.undefined
    expect(unlockTokenTx.txStatus).eq(TxStatus.CONFIRMED)

    console.info('HRC20HmyManager unlockTokenFor tx hash: ', unlockTokenTx.id)

    const balanceAfterUnLock = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

    expect(balanceAfterUnLock.eq(new BN(amount))).to.be.true
  })
})
