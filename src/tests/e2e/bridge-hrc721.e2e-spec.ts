import 'dotenv/config'
import { Transaction, TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BridgedHRC721Token, HRC721EthManager, HRC721HmyManager, HRC721TokenManager } from '../../bridge'
import { HRC721 } from '../../contracts'
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

class HRC721Mintable extends HRC721 {
  public mint(account: string, tokenId: BNish): Promise<Transaction> {
    return this.send('mint', [account, tokenId], E2E_TX_OPTIONS)
  }
}

describe('Bridge HRC721 Token', () => {
  const name = 'Blockcoders NFT'
  const symbol = 'Blockcoders'
  const tokenURI = 'https://fakeURI.com'
  const tokenId = 1
  let lockTokenTxHash: string
  let burnTokenTxHash: string
  let hrc721: HRC721Mintable
  let ownerHrc721: HRC721
  let erc721Addr: string
  let bridgedToken: BridgedHRC721Token
  let ethManager: HRC721EthManager
  let ownerEthManager: HRC721EthManager
  let hmyManager: HRC721HmyManager
  let ownerHmyManager: HRC721HmyManager
  let tokenManager: HRC721TokenManager

  before(async () => {
    // Deploy contracts
    const [hrc721Options, ethManagerOptions] = await Promise.all([
      deployContract(ContractName.BlockcodersHRC721, WALLET_HMY_MASTER, [name, symbol, tokenURI]),
      deployEthContract(ContractName.HRC721EthManager, WALLET_ETH_MASTER, [ETH_MASTER_ADDRESS]),
    ])
    const [hmyManagerOptions, tokenManagerOptions] = await Promise.all([
      deployContract(ContractName.HRC721HmyManager, WALLET_HMY_MASTER, [HMY_MASTER_ADDRESS]),
      deployEthContract(ContractName.HRC721TokenManager, WALLET_ETH_MASTER),
    ])

    // Create contract instances
    hrc721 = new HRC721Mintable(hrc721Options.addr, hrc721Options.abi, WALLET_HMY_MASTER)
    ownerHrc721 = new HRC721(hrc721Options.addr, hrc721Options.abi, WALLET_HMY_OWNER)
    hmyManager = new HRC721HmyManager(hmyManagerOptions.addr, WALLET_HMY_MASTER)
    ownerHmyManager = new HRC721HmyManager(hmyManagerOptions.addr, WALLET_HMY_OWNER)
    ethManager = new HRC721EthManager(ethManagerOptions.addr, WALLET_ETH_MASTER)
    ownerEthManager = new HRC721EthManager(ethManagerOptions.addr, WALLET_ETH_OWNER)
    tokenManager = new HRC721TokenManager(tokenManagerOptions.addr, WALLET_ETH_MASTER)

    // approve HRC721EthManager on HRC721TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC721TokenManager rely tx hash: ', relyTx.transactionHash)

    // Add token manager
    const addTokenTx = await ethManager.addToken(tokenManager.address, hrc721.address, name, symbol, tokenURI)
    console.info('HRC721EthManager addToken tx hash: ', addTokenTx.transactionHash)

    erc721Addr = await ethManager.mappings(hrc721.address)
    bridgedToken = new BridgedHRC721Token(erc721Addr, WALLET_ETH_OWNER)
  })

  it('contracts should be defined', () => {
    expect(hrc721).to.not.be.undefined
    expect(ownerHrc721).to.not.be.undefined
    expect(bridgedToken).to.not.be.undefined
    expect(ethManager).to.not.be.undefined
    expect(hmyManager).to.not.be.undefined
    expect(tokenManager).to.not.be.undefined
  })

  describe("Send a HRC721 from Harmony to Ethereum network", () => {
    it('hrc721 holder should have zero tokens before mint', async () => {
      const balance = await hrc721.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
      expect(balance.isZero()).to.be.true
    })
  
    it(`hrc721 holder should have one token after mint`, async () => {
      const mintTx = await hrc721.mint(HMY_OWNER_ADDRESS, tokenId)
  
      console.info('HRC721Mintable mint tx hash: ', mintTx.id)
  
      const balance = await hrc721.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
  
      expect(mintTx.txStatus).eq(TxStatus.CONFIRMED)
      expect(balance.isZero()).to.not.be.true
      expect(balance.eq(new BN(1))).to.be.true
    })
  
    it('hrc721 holder should approve Harmony Manager', async () => {
      const approveTx = await ownerHrc721.approve(hmyManager.address, tokenId, E2E_TX_OPTIONS)
  
      expect(approveTx.id).to.not.be.undefined
      expect(approveTx.txStatus).eq(TxStatus.CONFIRMED)
  
      console.info('HRC721 approve tx hash: ', approveTx.id)
    })
  
    it('Harmony Manager should lock the holder tokens', async () => {
      const balanceBeforeLock = await hrc721.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
      console.log('BALANCE: ', balanceBeforeLock)
      expect(balanceBeforeLock.eq(new BN(1))).to.be.true
      // This is necessary because the contract can only lock for the msg.sender
      const lockTokenTx = await ownerHmyManager.lockNFT721Token(hrc721.address, tokenId, ETH_OWNER_ADDRESS, E2E_TX_OPTIONS)
  
      console.log(lockTokenTx)
      lockTokenTxHash = lockTokenTx.id
  
      expect(lockTokenTxHash).to.not.be.undefined
      expect(lockTokenTx.receipt?.blockNumber).to.not.be.undefined
      expect(lockTokenTx.txStatus).eq(TxStatus.CONFIRMED)
  
      console.info('HRC721HmyManager lockTokenFor tx hash: ', lockTokenTxHash)
  
      await waitForNewBlock(parseInt(hexToNumber(lockTokenTx.receipt?.blockNumber ?? ''), 10) + 6)
  
      const balanceAfterLock = await hrc721.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
      const balanceHmyManager = await hrc721.balanceOf(hmyManager.address, E2E_TX_OPTIONS)
  
      expect(balanceAfterLock.isZero()).to.be.true
      expect(balanceHmyManager.eq(new BN(1))).to.be.true
    })
  
    it(`erc721 holder should have one token with id ${tokenId} after mint in eth side`, async () => {
      const balanceBeforeMint = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)
  
      expect(balanceBeforeMint.isZero()).to.be.true
  
      const mintTokenTx = await ethManager.mintToken(erc721Addr, tokenId, ETH_OWNER_ADDRESS, lockTokenTxHash)
  
      expect(mintTokenTx.transactionHash).to.not.be.undefined
      expect(mintTokenTx.status).eq(1) // The status of a transaction is 1 is successful
  
      console.info('HRC721EthManager mintToken tx hash: ', mintTokenTx.transactionHash)
  
      const balanceAfterLock = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)
  
      expect(balanceAfterLock.eq(1)).to.be.true
    })
  })

  describe("Send an ERC721 (BridgedToken) from Ethereum to Harmony Network", () => {
    it('erc721 holder should approve Ethereum Manager', async () => {
      const approveTx = await bridgedToken.approve(ethManager.address, tokenId)
  
      expect(approveTx.transactionHash).to.not.be.undefined
      expect(approveTx.status).eq(1) // The status of a transaction is 1 is successful
  
      console.info('HRC721 approve tx hash: ', approveTx.transactionHash)
    })
  
    it('erc721 holder should burn the token through Ethereum Manager', async () => {
      const balanceBeforeBurn = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)
  
      expect(balanceBeforeBurn.eq(1)).to.be.true
  
      const burnTx = await ownerEthManager.burnToken(erc721Addr, tokenId, HMY_OWNER_ADDRESS)
  
      expect(burnTx.transactionHash).to.not.be.undefined
      expect(burnTx.status).eq(1) // The status of a transaction is 1 is successful
  
      burnTokenTxHash = burnTx.transactionHash
  
      console.info('HRC721EthManager burnToken tx hash: ', burnTokenTxHash)
  
      const balanceAfterBurn = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)
  
      expect(balanceAfterBurn.isZero()).to.be.true
    })
  
    it(`hrc721 holder should have 1 token after unlock in Harmony side`, async () => {
      const balanceBeforeUnlock = await hrc721.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
  
      expect(balanceBeforeUnlock.isZero()).to.be.true
  
      const unlockTokenTx = await hmyManager.unlockToken(
        hrc721.address,
        tokenId,
        HMY_OWNER_ADDRESS,
        burnTokenTxHash,
        E2E_TX_OPTIONS,
      )
  
      expect(unlockTokenTx.id).to.not.be.undefined
      expect(unlockTokenTx.receipt?.blockNumber).to.not.be.undefined
      expect(unlockTokenTx.txStatus).eq(TxStatus.CONFIRMED)
  
      console.info('HRC721HmyManager lockTokenFor tx hash: ', lockTokenTxHash)
  
      const balanceAfterUnLock = await hrc721.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
  
      expect(balanceAfterUnLock.eq(new BN(1))).to.be.true
    })
  })
})
