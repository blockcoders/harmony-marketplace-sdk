import 'dotenv/config'
import { Transaction, TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BridgedHRC1155Token, HRC1155EthManager, HRC1155HmyManager, HRC1155TokenManager } from '../../bridge'
import { HRC1155 } from '../../contracts'
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
import { BNish } from '../../interfaces'

use(chaiAsPromised)
const name = 'Blockcoders NFT'
const symbol = 'Blockcoders'
const tokenURI = 'https://fakeURI.com'

class HRC1155Mintable extends HRC1155 {
  public mint(account: string, tokenId: BNish, amount: BNish): Promise<Transaction> {
    return this.send('mint', [account, tokenId, amount, tokenURI], E2E_TX_OPTIONS)
  }
}

describe.only('Bridge HRC1155 Token', () => {
  const tokenIds = [1, 2]
  const amounts = [1, 2]
  let lockTokenTxHash: string
  let burnTokenTxHash: string
  let hrc1155: HRC1155Mintable
  let ownerHrc1155: HRC1155
  let erc1155Addr: string
  let bridgedToken: BridgedHRC1155Token
  let ethManager: HRC1155EthManager
  let ownerEthManager: HRC1155EthManager
  let hmyManager: HRC1155HmyManager
  let ownerHmyManager: HRC1155HmyManager
  let tokenManager: HRC1155TokenManager

  before(async () => {
    // Deploy contracts
    const [hrc1155Options, ethManagerOptions] = await Promise.all([
      deployContract(ContractName.BlockcodersHRC1155, WALLET_HMY_MASTER, [name, symbol, tokenURI]),
      deployEthContract(ContractName.HRC1155EthManager, WALLET_ETH_MASTER, [ETH_MASTER_ADDRESS]),
    ])
    const [hmyManagerOptions, tokenManagerOptions] = await Promise.all([
      deployContract(ContractName.HRC1155HmyManager, WALLET_HMY_MASTER, [HMY_MASTER_ADDRESS]),
      deployEthContract(ContractName.HRC1155TokenManager, WALLET_ETH_MASTER),
    ])

    // Create contract instances
    hrc1155 = new HRC1155Mintable(hrc1155Options.addr, hrc1155Options.abi, WALLET_HMY_MASTER)
    ownerHrc1155 = new HRC1155(hrc1155Options.addr, hrc1155Options.abi, WALLET_HMY_OWNER)
    hmyManager = new HRC1155HmyManager(hmyManagerOptions.addr, WALLET_HMY_MASTER)
    ownerHmyManager = new HRC1155HmyManager(hmyManagerOptions.addr, WALLET_HMY_OWNER)
    ethManager = new HRC1155EthManager(ethManagerOptions.addr, WALLET_ETH_MASTER)
    ownerEthManager = new HRC1155EthManager(ethManagerOptions.addr, WALLET_ETH_OWNER)
    tokenManager = new HRC1155TokenManager(tokenManagerOptions.addr, WALLET_ETH_MASTER)

    // approve HRC1155EthManager on HRC1155TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC1155TokenManager rely tx hash: ', relyTx.transactionHash)

    // Add token manager
    const addTokenTx = await ethManager.addToken(tokenManager.address, hrc1155.address, name, symbol, tokenURI)
    console.info('HRC1155EthManager addToken tx hash: ', addTokenTx.transactionHash)

    erc1155Addr = await ethManager.mappings(hrc1155.address)
    bridgedToken = new BridgedHRC1155Token(erc1155Addr, WALLET_ETH_OWNER)
  })

  it('contracts should be defined', () => {
    expect(hrc1155).to.not.be.undefined
    expect(ownerHrc1155).to.not.be.undefined
    expect(bridgedToken).to.not.be.undefined
    expect(ethManager).to.not.be.undefined
    expect(hmyManager).to.not.be.undefined
    expect(tokenManager).to.not.be.undefined
  })

  describe('Send HRC1155 from Harmony to Ethereum network', () => {
    it('hrc1155 holder should have zero tokens before mint', async () => {
      const balance1 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[0], E2E_TX_OPTIONS)
      const balance2 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[1], E2E_TX_OPTIONS)
      expect(balance1.isZero()).to.be.true
      expect(balance2.isZero()).to.be.true
    })

    it(`hrc1155 holder should have ${amounts[0]} token with tokenId ${tokenIds[0]} and ${amounts[1]} tokens with tokenId ${tokenIds[1]} after mint`, async () => {
      const mintTx1 = await hrc1155.mint(HMY_OWNER_ADDRESS, tokenIds[0], amounts[0])
      console.info('HRC1155Mintable mint tx hash: ', mintTx1.id)
      const balance1 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[0], E2E_TX_OPTIONS)
      expect(mintTx1.txStatus).eq(TxStatus.CONFIRMED)
      expect(balance1.isZero()).to.not.be.true
      expect(balance1.eq(new BN(amounts[0]))).to.be.true

      const mintTx2 = await hrc1155.mint(HMY_OWNER_ADDRESS, tokenIds[1], amounts[1])
      console.info('HRC1155Mintable mint tx hash: ', mintTx2.id)
      const balance2 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[1], E2E_TX_OPTIONS)
      expect(mintTx2.txStatus).eq(TxStatus.CONFIRMED)
      expect(balance2.isZero()).to.not.be.true
      expect(balance2.eq(new BN(amounts[1]))).to.be.true
    })

    it('hrc1155 holder should approve Harmony Manager', async () => {
      const approveTx = await ownerHrc1155.setApprovalForAll(hmyManager.address, true, E2E_TX_OPTIONS)

      expect(approveTx.id).to.not.be.undefined
      expect(approveTx.txStatus).eq(TxStatus.CONFIRMED)

      console.info('HRC1155 approve tx hash: ', approveTx.id)
    })

    it('Harmony Manager should lock the holder tokens', async () => {
      const balanceBeforeLock1 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[0], E2E_TX_OPTIONS)
      const balanceBeforeLock2 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[1], E2E_TX_OPTIONS)

      expect(balanceBeforeLock1.eq(new BN(amounts[0]))).to.be.true
      expect(balanceBeforeLock2.eq(new BN(amounts[1]))).to.be.true

      // This is necessary because the contract can only lock for the msg.sender
      const lockTokenTx = await ownerHmyManager.lockHRC1155Tokens(
        hrc1155.address,
        tokenIds,
        ETH_OWNER_ADDRESS,
        amounts,
        E2E_TX_OPTIONS,
      )

      console.log(lockTokenTx)
      lockTokenTxHash = lockTokenTx.id

      expect(lockTokenTxHash).to.not.be.undefined
      expect(lockTokenTx.receipt?.blockNumber).to.not.be.undefined
      expect(lockTokenTx.txStatus).eq(TxStatus.CONFIRMED)

      console.info('HRC1155HmyManager lockTokenFor tx hash: ', lockTokenTxHash)

      await waitForNewBlock(parseInt(hexToNumber(lockTokenTx.receipt?.blockNumber ?? ''), 10) + 6)

      const balanceAfterLock1 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[0], E2E_TX_OPTIONS)
      const balanceAfterLock2 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[1], E2E_TX_OPTIONS)
      const balanceHmyManager1 = await hrc1155.balanceOf(hmyManager.address, tokenIds[0], E2E_TX_OPTIONS)
      const balanceHmyManager2 = await hrc1155.balanceOf(hmyManager.address, tokenIds[1], E2E_TX_OPTIONS)

      expect(balanceAfterLock1.isZero()).to.be.true
      expect(balanceAfterLock2.isZero()).to.be.true
      expect(balanceHmyManager1.eq(new BN(amounts[0]))).to.be.true
      expect(balanceHmyManager2.eq(new BN(amounts[1]))).to.be.true
    })

    it(`erc1155 holder should have ${amounts[0]} token with id ${tokenIds[0]} and ${amounts[1]} token with id ${tokenIds[1]} after mint in eth side`, async () => {
      const balanceBeforeMint1 = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS, tokenIds[0])
      const balanceBeforeMint2 = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS, tokenIds[1])

      expect(balanceBeforeMint1.isZero()).to.be.true
      expect(balanceBeforeMint2.isZero()).to.be.true

      const mintTokenTx = await ethManager.mintTokens(erc1155Addr, tokenIds, ETH_OWNER_ADDRESS, lockTokenTxHash, amounts)

      expect(mintTokenTx.transactionHash).to.not.be.undefined
      expect(mintTokenTx.status).eq(1) // The status of a transaction is 1 is successful

      console.info('HRC1155EthManager mintToken tx hash: ', mintTokenTx.transactionHash)

      const balanceAfterLock1 = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS, tokenIds[0])
      const balanceAfterLock2 = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS, tokenIds[1])

      expect(balanceAfterLock1.eq(amounts[0])).to.be.true
      expect(balanceAfterLock2.eq(amounts[1])).to.be.true
    })
  })

  describe('Send an ERC1155 (BridgedToken) from Ethereum to Harmony Network', () => {
    it('erc1155 holder should approve Ethereum Manager', async () => {
      const approveTx = await bridgedToken.setApprovalForAll(ethManager.address, true)

      expect(approveTx.transactionHash).to.not.be.undefined
      expect(approveTx.status).eq(1) // The status of a transaction is 1 is successful

      console.info('HRC1155 approve tx hash: ', approveTx.transactionHash)
    })

    it('erc1155 holder should burn the token through Ethereum Manager', async () => {
      const balanceBeforeBurn1 = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS, tokenIds[0])
      const balanceBeforeBurn2 = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS, tokenIds[1])

      expect(balanceBeforeBurn1.eq(amounts[0])).to.be.true
      expect(balanceBeforeBurn2.eq(amounts[1])).to.be.true

      const burnTx = await ownerEthManager.burnTokens(erc1155Addr, tokenIds, HMY_OWNER_ADDRESS, amounts)

      expect(burnTx.transactionHash).to.not.be.undefined
      expect(burnTx.status).eq(1) // The status of a transaction is 1 is successful

      burnTokenTxHash = burnTx.transactionHash

      console.info('HRC1155EthManager burnToken tx hash: ', burnTokenTxHash)

      const balanceAfterBurn1 = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS, tokenIds[0])
      const balanceAfterBurn2 = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS, tokenIds[1])

      expect(balanceAfterBurn1.isZero()).to.be.true
      expect(balanceAfterBurn2.isZero()).to.be.true
    })

    it(`hrc1155 holder should have 1 token after unlock in Harmony side`, async () => {
      const balanceBeforeUnlock1 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[0], E2E_TX_OPTIONS)
      const balanceBeforeUnlock2 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[1], E2E_TX_OPTIONS)

      expect(balanceBeforeUnlock1.isZero()).to.be.true
      expect(balanceBeforeUnlock2.isZero()).to.be.true

      const unlockTokenTx = await hmyManager.unlockHRC1155Tokens(
        hrc1155.address,
        tokenIds,
        HMY_OWNER_ADDRESS,
        burnTokenTxHash,
        amounts,
        E2E_TX_OPTIONS,
      )

      expect(unlockTokenTx.id).to.not.be.undefined
      expect(unlockTokenTx.receipt?.blockNumber).to.not.be.undefined
      expect(unlockTokenTx.txStatus).eq(TxStatus.CONFIRMED)

      console.info('HRC1155HmyManager lockTokenFor tx hash: ', lockTokenTxHash)

      const balanceAfterUnLock1 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[0], E2E_TX_OPTIONS)
      const balanceAfterUnLock2 = await hrc1155.balanceOf(HMY_OWNER_ADDRESS, tokenIds[1], E2E_TX_OPTIONS)

      expect(balanceAfterUnLock1.eq(new BN(amounts[0]))).to.be.true
      expect(balanceAfterUnLock2.eq(new BN(amounts[1]))).to.be.true
    })
  })
})
