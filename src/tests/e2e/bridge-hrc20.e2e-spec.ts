import 'dotenv/config'
import { Transaction, TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BridgedHRC20Token, HRC20EthManager, HRC20HmyManager, HRC20TokenManager } from '../../bridge'
import { HRC20 } from '../../contracts'
import { BNish } from '../../interfaces'
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
import { deployContract, deployEthContract, waitForNewBlock } from '../helpers'

use(chaiAsPromised)

class HRC20Mintable extends HRC20 {
  public mint(account: string, amount: BNish): Promise<Transaction> {
    return this.send('mint', [account, amount], E2E_TX_OPTIONS)
  }
}

describe('Bridge HRC20 Token', () => {
  const name = 'Blockcoders'
  const symbol = 'BC'
  const decimals = 18
  const amount = (500 * 10 ** decimals).toString() // 500 in Gwei
  let lockTokenTxHash: string
  let hrc20: HRC20Mintable
  let ownerHrc20: HRC20
  let erc20Addr: string
  let bridgedToken: BridgedHRC20Token
  let ethManager: HRC20EthManager
  let hmyManager: HRC20HmyManager
  let tokenManager: HRC20TokenManager

  before(async () => {
    // Deploy contracts
    const [hrc20Options, ethManagerOptions] = await Promise.all([
      deployContract(ContractName.BlockcodersHRC20, WALLET_HMY_MASTER, [name, symbol]),
      deployEthContract(ContractName.HRC20EthManager, WALLET_ETH_MASTER, [ETH_MASTER_ADDRESS]),
    ])
    const [hmyManagerOptions, tokenManagerOptions] = await Promise.all([
      deployContract(ContractName.HRC20HmyManager, WALLET_HMY_MASTER, [HMY_MASTER_ADDRESS]),
      deployEthContract(ContractName.HRC20TokenManager, WALLET_ETH_MASTER),
    ])

    // Create contract instances
    hrc20 = new HRC20Mintable(hrc20Options.addr, hrc20Options.abi, WALLET_HMY_MASTER)
    ownerHrc20 = new HRC20(hrc20Options.addr, hrc20Options.abi, WALLET_HMY_OWNER)
    hmyManager = new HRC20HmyManager(hmyManagerOptions.addr, WALLET_HMY_MASTER)
    ethManager = new HRC20EthManager(ethManagerOptions.addr, WALLET_ETH_MASTER)
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
    const mintTx = await hrc20.mint(HMY_OWNER_ADDRESS, amount)

    console.info('HRC20Mintable mint tx hash: ', mintTx.id)

    const balance = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

    expect(mintTx.txStatus).eq(TxStatus.CONFIRMED)
    expect(balance.isZero()).to.not.be.true
    expect(balance.eq(new BN(amount))).to.be.true
  })

  it('hrc20 holder should approve Harmony Manager', async () => {
    const approveTx = await ownerHrc20.approve(hmyManager.address, amount, E2E_TX_OPTIONS)

    console.info('HRC20 approve tx hash: ', approveTx.id)

    expect(approveTx.txStatus).eq(TxStatus.CONFIRMED)
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

    console.log(lockTokenTx)
    lockTokenTxHash = lockTokenTx.receipt?.transactionHash ?? ''

    expect(lockTokenTxHash).to.not.be.undefined
    expect(lockTokenTx.receipt?.blockNumber).to.not.be.undefined
    expect(lockTokenTx.txStatus).eq(TxStatus.CONFIRMED)

    console.info('HRC20HmyManager lockTokenFor tx hash: ', lockTokenTxHash)

    await waitForNewBlock(parseInt(hexToNumber(lockTokenTx.receipt?.blockNumber ?? ''), 10) + 6)

    const balanceAfterLock = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

    expect(balanceAfterLock.isZero()).to.be.true
  })

  it(`erc20 holder should have ${amount} tokens after mint in eth side`, async () => {
    const balanceBeforeMint = await bridgedToken.balanceOf(HMY_OWNER_ADDRESS)

    expect(balanceBeforeMint.isZero()).to.be.true

    const mintTokenTx = await ethManager.mintToken(erc20Addr, amount, ETH_OWNER_ADDRESS, lockTokenTxHash)

    expect(mintTokenTx.transactionHash).to.not.be.undefined

    console.info('HRC20EthManager mintToken tx hash: ', mintTokenTx.transactionHash)

    const balanceAfterLock = await bridgedToken.balanceOf(HMY_OWNER_ADDRESS)

    expect(balanceAfterLock.eq(amount)).to.be.true
  })
})
