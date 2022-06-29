import { Transaction, TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import {
  DEFAULT_TX_OPTIONS,
  DEVNET_HRC721_CONTRACTS_ADDRESSES,
  MAINNET_HRC721_CONTRACTS_ADDRESSES,
} from '../constants'
import { HRC721 } from '../contracts'
import ABI from './hrc721/abi'
import { BNish, HRC721Info, ITransactionOptions } from '../interfaces'
import { waitForNewBlock } from '../utils'
import { BridgedHRC721Token } from './bridgedHrc721Token'
import { BridgeToken } from './bridgeToken'
import { HRC721EthManager } from './hrc721EthManager'
import { HRC721HmyManager } from './hrc721HmyManager'
import { HRC721TokenManager } from './hrc721TokenManager'
import { TransactionReceipt } from '@ethersproject/providers'

export class BridgeHRC721Token extends BridgeToken {
  public async ethToHmy(
    sender: string,
    recipient: string,
    token: HRC721,
    tokenInfo: HRC721Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<Transaction>  {
    const { ethManagerAddress, hmyManagerAddress } = this.isMainnet
      ? MAINNET_HRC721_CONTRACTS_ADDRESSES
      : DEVNET_HRC721_CONTRACTS_ADDRESSES
    const hmyManager = new HRC721HmyManager(hmyManagerAddress, this.hmyMasterWallet)
    const ownerSignedEthManager = new HRC721EthManager(ethManagerAddress, this.ethOwnerWallet)
    const ethManager = new HRC721EthManager(ethManagerAddress, this.ethMasterWallet)
    const erc721Address = await ethManager.mappings(token.address)
    const erc721 = new BridgedHRC721Token(erc721Address, this.ethOwnerWallet)
    console.log('ERC721 Bridged Token at address: ', erc721Address)

    // Verify parameters and balance
    const balance = await erc721.balanceOf(sender)
    if (balance.toNumber() < 1) {
      throw Error('Insufficient funds')
    }
    const { tokenId } = tokenInfo
    if (!tokenId) {
      throw Error('Error in tokenInfo, tokenId cannot be undefined for HRC721')
    }

    // Approve ethManager to burn tokens on the Ethereum Network
    const approveTx = await erc721.approve(ethManager.address, tokenId)
    console.info(
      'HRC721 approve EthManager to burn tokens on the Ethereum Network. Transaction Hash: ',
      approveTx?.transactionHash,
    )

    // Burn tokens to unlock on Hamrnoy Network
    const burnTx = await ownerSignedEthManager.burnToken(erc721Address, tokenId, recipient)
    const burnTokenTxHash = burnTx?.transactionHash
    console.info('HRC20EthManager burnToken on the Ethereum Network. Transaction Hash: ', burnTokenTxHash)

    // Unlock tokens after burn
    const unlockTokenTx = await hmyManager.unlockToken(token.address, tokenId, recipient, burnTokenTxHash, txOptions)
    if (unlockTokenTx.txStatus !== TxStatus.CONFIRMED) {
      throw Error(`Failed to unlock tokens. Status: ${unlockTokenTx.txStatus}`)
    }
    console.info('HRC721HmyManager unlockToken on Harmony Network. Transaction Hash: ', unlockTokenTx.id)
    return unlockTokenTx
  }

  public async getBridgedTokenAddress(
    token: HRC721,
    tokenId: BNish,
    ethManager: HRC721EthManager,
    tokenManager: HRC721TokenManager,
    txOptions: ITransactionOptions,
  ): Promise<string> {
    let erc721Addr = undefined
    // can throw an error if the mapping do not exist.
    try {
      erc721Addr = await ethManager.mappings(token.address)
    } catch (err) {}

    if (!erc721Addr) {
      const [name, symbol, tokenURI] = await Promise.all([
        token.name(txOptions),
        token.symbol(txOptions),
        token.tokenURI(tokenId, txOptions),
      ])

      const addTokenTx = await ethManager.addToken(tokenManager.address, token.address, name, symbol, tokenURI)
      console.info('HRC20EthManager addToken tx hash: ', addTokenTx?.transactionHash)

      erc721Addr = await ethManager.mappings(token.address)
    }
    return erc721Addr
  }

  public async hmyToEth(
    sender: string,
    recipient: string,
    token: HRC721,
    tokenInfo: HRC721Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<TransactionReceipt> {
    const { tokenId } = tokenInfo

    // Verify parameters and balance
    if (!tokenId) {
      throw Error('Error in tokenInfo, tokenId cannot be undefined for HRC721')
    }
    const balance = await token.balanceOf(sender, txOptions)
    if (balance < new BN(1)) {
      throw new Error(`Insufficient funds. Balance: ${balance}. TokenId: ${tokenId}`)
    }
    
    const { ethManagerAddress, hmyManagerAddress, tokenManagerAddress } = this.isMainnet
      ? MAINNET_HRC721_CONTRACTS_ADDRESSES
      : DEVNET_HRC721_CONTRACTS_ADDRESSES
      
    const ownerSignedHmyManager = new HRC721HmyManager(hmyManagerAddress, this.hmyOwnerWallet)
    const ethManager = new HRC721EthManager(ethManagerAddress, this.ethMasterWallet)
    const tokenManager = new HRC721TokenManager(tokenManagerAddress, this.ethMasterWallet)
    const ownerHrc721 = new HRC721(token.address, ABI, this.hmyOwnerWallet)

    // Get Bridged Token address
    const erc721Addr = await this.getBridgedTokenAddress(token, tokenId, ethManager, tokenManager, txOptions)
    console.log('ERC721 Bridged Token at address: ', erc721Addr)

    // Approve manager to lock tokens on Harmony network
    const approveTx = await ownerHrc721.approve(hmyManagerAddress, tokenId, txOptions)
    if (approveTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx?.txStatus}`)
    }
    console.log('Approve Harmony Manager to Lock Tokens. Transaction Status: ', approveTx?.txStatus)

    // Lock tokens on Harmony Network to mint on Ethereum Network
    const lockTokenTx = await ownerSignedHmyManager.lockNFT721Token(token.address, tokenId, recipient, txOptions)
    if (lockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx?.txStatus}`)
    }
    console.log('Tokens Locked on Harmony Network. Transaction Status: ', lockTokenTx?.txStatus)

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx?.receipt?.blockNumber ?? ''), 10) + 6

    console.log(`Waiting for block ${expectedBlockNumber} for safety reasons`)
    await waitForNewBlock(
      expectedBlockNumber,
      token.messenger.provider.url,
      token.messenger.chainType,
      token.messenger.chainId,
    )
    console.log("Expected block number reached")
    // Mint tokens on Eth Network
    const mintTokenTx = await ethManager.mintToken(erc721Addr, tokenId, recipient, lockTokenTx.id)
    if (mintTokenTx?.status !== 1) {
      throw new Error(`Failed to mint tokens: ${mintTokenTx}`)
    }
    console.log('Minted tokens on the Ethereum Network. Transaction Hash: ', mintTokenTx?.transactionHash)
    return mintTokenTx
  }
}
