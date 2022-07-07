import { TxStatus } from '@harmony-js/transaction'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  BridgedHRC1155Token,
  BridgedHRC20Token,
  BridgedHRC721Token,
  HRC1155EthManager,
  HRC1155HmyManager,
  HRC20EthManager,
  HRC20HmyManager,
  HRC721EthManager,
  HRC721HmyManager,
} from '../../bridge'
import { BridgeHRC1155Token } from '../../bridge/bridgeHrc1155Token'
import { BridgeHRC20Token } from '../../bridge/bridgeHrc20Token'
import { BridgeHRC721Token } from '../../bridge/bridgeHrc721Token'
import {
  BridgeType,
  DEVNET_HRC20_CONTRACTS_ADDRESSES,
  DEVNET_HRC721_CONTRACTS_ADDRESSES,
  DEVNET_HRC1155_CONTRACTS_ADDRESSES,
  HARMONY_RPC_DEVNET_WS,
  NetworkInfo,
} from '../../constants'
import { HRC1155, HRC20, HRC721 } from '../../contracts'
import { HRC1155Info, HRC20Info, HRC721Info } from '../../interfaces'
import {
  WALLET_ETH_MASTER,
  WALLET_HMY_MASTER,
  WALLET_HMY_OWNER,
  WALLET_ETH_OWNER,
  HMY_OWNER_ADDRESS,
  ETH_OWNER_ADDRESS,
  ContractName,
  E2E_TX_OPTIONS,
} from '../constants'
import { deployContract } from '../helpers'

use(chaiAsPromised)

describe('Bridge Token', () => {
  const sender = ETH_OWNER_ADDRESS
  const recipient = HMY_OWNER_ADDRESS
  const name = 'Blockcoders'
  const symbol = 'BC'

  describe('Bridge HRC20 Tokens', () => {
    const decimals = 18
    const amount = (500 * 10 ** decimals).toString() // 500 in Gwei
    const tokenInfo: HRC20Info = { amount, ws: HARMONY_RPC_DEVNET_WS, waitingFor: 6 }
    const hmyManager = new HRC20HmyManager(DEVNET_HRC20_CONTRACTS_ADDRESSES.hmyManagerAddress, WALLET_HMY_MASTER)
    let hrc20: HRC20
    let bridge: BridgeHRC20Token

    before(async () => {
      const { addr, abi } = await deployContract(ContractName.BlockcodersHRC20, WALLET_HMY_MASTER, [
        name,
        symbol,
        decimals,
      ])

      const token = new HRC20(addr, abi, WALLET_HMY_MASTER)

      await token.mint(HMY_OWNER_ADDRESS, amount, E2E_TX_OPTIONS)

      hrc20 = new HRC20(addr, abi, WALLET_HMY_OWNER)
      bridge = new BridgeHRC20Token(WALLET_HMY_OWNER, WALLET_ETH_OWNER, WALLET_ETH_MASTER.provider, NetworkInfo.DEVNET)
    })

    it('Should send the tokens from Hmy to Eth', async () => {
      const balanceBeforeLock = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

      expect(balanceBeforeLock.eq(new BN(amount))).to.be.true

      const { addr, receiptId } = await bridge.sendToken(
        BridgeType.HMY_TO_ETH,
        sender,
        recipient,
        hrc20,
        tokenInfo,
        E2E_TX_OPTIONS,
      )
      const balanceAfterLock = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
      const balanceHmyManager = await hrc20.balanceOf(hmyManager.address, E2E_TX_OPTIONS)

      expect(balanceAfterLock.isZero()).to.be.true
      expect(balanceHmyManager.eq(new BN(amount))).to.be.true

      const ethManager = new HRC20EthManager(DEVNET_HRC20_CONTRACTS_ADDRESSES.ethManagerAddress, WALLET_ETH_MASTER)

      // Mint tokens on Eth side as validators
      const mintTokenTx = await ethManager.mintToken(addr, amount, recipient, receiptId)

      console.info('HRC20EthManager mintToken tx hash: ', mintTokenTx.transactionHash)

      expect(mintTokenTx.transactionHash).to.not.be.undefined
      expect(mintTokenTx.status).eq(1)
    })

    it('Should send the tokens from Eth to Hmy', async () => {
      const erc20Addr = await bridge.getBridgedTokenAddress(hrc20, E2E_TX_OPTIONS)
      const bridgedToken = new BridgedHRC20Token(erc20Addr, WALLET_ETH_OWNER)
      const balanceBeforeBurn = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)

      expect(balanceBeforeBurn.eq(amount)).to.be.true

      const { addr, receiptId } = await bridge.sendToken(
        BridgeType.ETH_TO_HMY,
        sender,
        recipient,
        hrc20,
        tokenInfo,
        E2E_TX_OPTIONS,
      )

      const balanceAfterBurn = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)

      expect(balanceAfterBurn.isZero()).to.be.true

      // Unlock Tokens on Harmony Netowrk
      const unlockTokenTx = await hmyManager.unlockToken(addr, amount, recipient, receiptId, E2E_TX_OPTIONS)

      console.info('HRC20HmyManager unlockToken on Harmony Network. Transaction Hash: ', unlockTokenTx?.id)

      expect(unlockTokenTx.id).to.not.be.undefined
      expect(unlockTokenTx.receipt?.blockNumber).to.not.be.undefined
      expect(unlockTokenTx.txStatus).eq(TxStatus.CONFIRMED)
    })
  })

  describe('Bridge HRC721 Tokens', () => {
    const tokenURI = 'https://fakeURI.com'
    const tokenId = 1
    const tokenInfo: HRC721Info = { tokenId, ws: HARMONY_RPC_DEVNET_WS, waitingFor: 6 }
    const hmyManager = new HRC721HmyManager(DEVNET_HRC721_CONTRACTS_ADDRESSES.hmyManagerAddress, WALLET_HMY_MASTER)
    let hrc721: HRC721
    let bridge: BridgeHRC721Token

    before(async () => {
      const { addr, abi } = await deployContract(ContractName.BlockcodersHRC721, WALLET_HMY_MASTER, [
        name,
        symbol,
        tokenURI,
      ])
      const token = new HRC721(addr, abi, WALLET_HMY_MASTER)

      await token.mint(HMY_OWNER_ADDRESS, tokenId, E2E_TX_OPTIONS)

      hrc721 = new HRC721(addr, abi, WALLET_HMY_OWNER)
      bridge = new BridgeHRC721Token(WALLET_HMY_OWNER, WALLET_ETH_OWNER, WALLET_ETH_MASTER.provider, NetworkInfo.DEVNET)
    })

    it('Should send the tokens from Hmy to Eth', async () => {
      const balanceBeforeLock = await hrc721.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

      expect(balanceBeforeLock.eq(new BN(tokenId))).to.be.true

      const { addr, receiptId } = await bridge.sendToken(
        BridgeType.HMY_TO_ETH,
        sender,
        recipient,
        hrc721,
        tokenInfo,
        E2E_TX_OPTIONS,
      )

      const balanceAfterLock = await hrc721.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)
      const balanceHmyManager = await hrc721.balanceOf(hmyManager.address, E2E_TX_OPTIONS)

      expect(balanceAfterLock.isZero()).to.be.true
      expect(balanceHmyManager.eq(new BN(tokenId))).to.be.true

      const ethManager = new HRC721EthManager(DEVNET_HRC721_CONTRACTS_ADDRESSES.ethManagerAddress, WALLET_ETH_MASTER)

      // Mint tokens on Eth Network
      const mintTokenTx = await ethManager.mintToken(addr, tokenId, recipient, receiptId)

      console.log('Minted tokens on the Ethereum Network. Transaction Hash: ', mintTokenTx?.transactionHash)

      expect(mintTokenTx.transactionHash).to.not.be.undefined
      expect(mintTokenTx.status).eq(1)
    })

    it('Should send the tokens from Eth to Hmy', async () => {
      const erc721Addr = await bridge.getBridgedTokenAddress(hrc721, tokenId, E2E_TX_OPTIONS)
      const bridgedToken = new BridgedHRC721Token(erc721Addr, WALLET_ETH_OWNER)
      const balanceBeforeBurn = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)

      expect(balanceBeforeBurn.eq(tokenId)).to.be.true

      const { addr, receiptId } = await bridge.sendToken(
        BridgeType.ETH_TO_HMY,
        sender,
        recipient,
        hrc721,
        tokenInfo,
        E2E_TX_OPTIONS,
      )

      const balanceAfterBurn = await bridgedToken.balanceOf(ETH_OWNER_ADDRESS)

      expect(balanceAfterBurn.isZero()).to.be.true

      // Unlock tokens after burn
      const unlockTokenTx = await hmyManager.unlockToken(addr, tokenId, recipient, receiptId, E2E_TX_OPTIONS)

      console.info('HRC721HmyManager unlockToken on Harmony Network. Transaction Hash: ', unlockTokenTx.id)

      expect(unlockTokenTx.id).to.not.be.undefined
      expect(unlockTokenTx.receipt?.blockNumber).to.not.be.undefined
      expect(unlockTokenTx.txStatus).eq(TxStatus.CONFIRMED)
    })
  })

  describe('Bridge HRC1155 Tokens', () => {
    const tokenURI = 'https://fakeURI.com'
    const tokenIds = [0, 1, 2]
    const amounts = [10, 20, 30]
    const accounts = Array.from({ length: tokenIds.length }, () => HMY_OWNER_ADDRESS)
    const tokenInfo: HRC1155Info = { tokenIds, amounts, ws: HARMONY_RPC_DEVNET_WS, waitingFor: 6 }
    const hmyManager = new HRC1155HmyManager(DEVNET_HRC1155_CONTRACTS_ADDRESSES.hmyManagerAddress, WALLET_HMY_MASTER)
    let hrc1155: HRC1155
    let bridge: BridgeHRC1155Token

    before(async () => {
      const { addr, abi } = await deployContract(ContractName.BlockcodersHRC1155, WALLET_HMY_MASTER, [
        name,
        symbol,
        tokenURI,
      ])

      const token = new HRC1155(addr, abi, WALLET_HMY_MASTER)

      await token.mintBatch(HMY_OWNER_ADDRESS, tokenIds, amounts, E2E_TX_OPTIONS)

      hrc1155 = new HRC1155(addr, abi, WALLET_HMY_OWNER)
      bridge = new BridgeHRC1155Token(
        WALLET_HMY_OWNER,
        WALLET_ETH_OWNER,
        WALLET_ETH_MASTER.provider,
        NetworkInfo.DEVNET,
      )
    })

    it('Should send the tokens from Hmy to Eth', async () => {
      const balancesBeforeLock = await hrc1155.balanceOfBatch(accounts, tokenIds, E2E_TX_OPTIONS)

      balancesBeforeLock.forEach((balanceBeforeLock, i) => {
        expect(balanceBeforeLock.eq(new BN(amounts[i]))).to.be.true
      })

      const { addr, receiptId } = await bridge.sendToken(
        BridgeType.HMY_TO_ETH,
        sender,
        recipient,
        hrc1155,
        tokenInfo,
        E2E_TX_OPTIONS,
      )

      const balancesAfterLock = await hrc1155.balanceOfBatch(accounts, tokenIds, E2E_TX_OPTIONS)
      const balancesHmyManager = await hrc1155.balanceOfBatch(
        Array.from({ length: tokenIds.length }, () => hmyManager.address),
        tokenIds,
        E2E_TX_OPTIONS,
      )

      balancesAfterLock.forEach((balanceAfterLock) => {
        expect(balanceAfterLock.isZero()).to.be.true
      })

      balancesHmyManager.forEach((balanceHmyManager, i) => {
        expect(balanceHmyManager.eq(new BN(amounts[i]))).to.be.true
      })

      const ethManager = new HRC1155EthManager(DEVNET_HRC1155_CONTRACTS_ADDRESSES.ethManagerAddress, WALLET_ETH_MASTER)

      // Mint tokens on Eth side
      const mintTokenTx = await ethManager.mintTokens(addr, tokenIds, amounts, recipient, receiptId, [])

      console.log('Minted tokens on the Ethereum Network. Transaction Hash: ', mintTokenTx?.transactionHash)

      expect(mintTokenTx.transactionHash).to.not.be.undefined
      expect(mintTokenTx.status).eq(1)
    })

    it('Should send the tokens from Eth to Hmy', async () => {
      const erc1155Addr = await bridge.getBridgedTokenAddress(hrc1155, tokenIds[0], E2E_TX_OPTIONS)
      const bridgedToken = new BridgedHRC1155Token(erc1155Addr, WALLET_ETH_OWNER)
      const balancesBeforeBurn = await bridgedToken.balanceOfBatch(accounts, tokenIds)

      balancesBeforeBurn.forEach((balanceBeforeBurn, i) => {
        expect(balanceBeforeBurn.eq(amounts[i])).to.be.true
      })

      const { addr, receiptId } = await bridge.sendToken(
        BridgeType.ETH_TO_HMY,
        sender,
        recipient,
        hrc1155,
        tokenInfo,
        E2E_TX_OPTIONS,
      )

      const balancesAfterBurn = await bridgedToken.balanceOfBatch(accounts, tokenIds)

      balancesAfterBurn.forEach((balanceAfterBurn, i) => {
        expect(balanceAfterBurn.isZero()).to.be.true
      })

      // Unlock Tokens on Harmony Netowrk
      const unlockTokenTx = await hmyManager.unlockHRC1155Tokens(
        addr,
        tokenIds,
        amounts,
        recipient,
        receiptId,
        [],
        E2E_TX_OPTIONS,
      )

      console.info('HRC1155HmyManager unlockHRC1155Tokens on Harmony Network. Transaction Hash: ', unlockTokenTx?.id)

      expect(unlockTokenTx.id).to.not.be.undefined
      expect(unlockTokenTx.receipt?.blockNumber).to.not.be.undefined
      expect(unlockTokenTx.txStatus).eq(TxStatus.CONFIRMED)
    })
  })
})
