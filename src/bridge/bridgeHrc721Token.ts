import { TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import {
  AddressZero,
  DEFAULT_TX_OPTIONS,
  DEVNET_HRC721_CONTRACTS_ADDRESSES,
  HARMONY_RPC_WS,
  MAINNET_HRC721_CONTRACTS_ADDRESSES,
} from '../constants'
import { HRC721 } from '../contracts'
import { BNish, BridgeResponse, ContractAddresses, HRC721Info, ITransactionOptions } from '../interfaces'
import { waitForNewBlock } from '../utils'
import { BridgeToken } from './bridgeToken'
import { BridgedHRC721Token } from './bridgedHrc721Token'
import { HRC721EthManager } from './hrc721EthManager'
import { HRC721HmyManager } from './hrc721HmyManager'
import { HRC721TokenManager } from './hrc721TokenManager'

export class BridgeHRC721Token extends BridgeToken {
  private getContractAddresses(): ContractAddresses {
    return this.isMainnet ? MAINNET_HRC721_CONTRACTS_ADDRESSES : DEVNET_HRC721_CONTRACTS_ADDRESSES
  }

  public async getBridgedTokenAddress(
    token: HRC721,
    tokenId: BNish,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<string> {
    const { ethManagerAddress, tokenManagerAddress } = this.getContractAddresses()
    const ethManager = new HRC721EthManager(ethManagerAddress, this.ethOwnerWallet)
    const tokenManager = new HRC721TokenManager(tokenManagerAddress, this.ethMasterWallet)
    let erc721Addr = undefined
    // can throw an error if the mapping do not exist.
    try {
      erc721Addr = await ethManager.mappings(token.address)
    } catch (err) {}

    if (!erc721Addr || erc721Addr === AddressZero) {
      const [name, symbol, tokenURI] = await Promise.all([
        token.name(txOptions),
        token.symbol(txOptions),
        token.tokenURI(tokenId, txOptions),
      ])

      await ethManager.addToken(tokenManager.address, token.address, name, symbol, tokenURI)

      erc721Addr = await ethManager.mappings(token.address)
    }
    return erc721Addr
  }

  public async ethToHmy(
    sender: string,
    recipient: string,
    token: HRC721,
    tokenInfo: HRC721Info,
  ): Promise<BridgeResponse> {
    const { ethManagerAddress } = this.getContractAddresses()
    const ethManager = new HRC721EthManager(ethManagerAddress, this.ethOwnerWallet)
    const erc721Address = await ethManager.mappings(token.address)
    const erc721 = new BridgedHRC721Token(erc721Address, this.ethOwnerWallet)

    // Verify parameters and balance
    const balance = await erc721.balanceOf(sender)

    if (balance.lt(1)) {
      throw Error('Insufficient funds')
    }
    const { tokenId } = tokenInfo
    if (!tokenId) {
      throw Error('Error in tokenInfo, tokenId cannot be undefined for HRC721')
    }

    // Approve ethManager to burn tokens on the Ethereum Network
    const approveTx = await erc721.approve(ethManager.address, tokenId)

    if (approveTx?.status !== 1) {
      throw new Error(`Failed to approve erc721: ${approveTx?.transactionHash}`)
    }

    // Burn tokens to unlock on Hamrnoy Network
    const burnTx = await ethManager.burnToken(erc721Address, tokenId, recipient)

    if (burnTx?.status !== 1) {
      throw new Error(`Failed to approve erc721: ${burnTx?.transactionHash}`)
    }

    return { addr: token.address, receiptId: burnTx?.transactionHash }
  }

  public async hmyToEth(
    sender: string,
    recipient: string,
    token: HRC721,
    tokenInfo: HRC721Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<BridgeResponse> {
    const { tokenId, ws = HARMONY_RPC_WS, waitingFor = 12 } = tokenInfo

    // Verify parameters and balance
    if (!tokenId) {
      throw Error('Error in tokenInfo, tokenId cannot be undefined for HRC721')
    }

    const balance = await token.balanceOf(sender, txOptions)

    if (balance.lt(new BN(1))) {
      throw new Error(`Insufficient funds. Balance: ${balance}. TokenId: ${tokenId}`)
    }

    const { hmyManagerAddress } = this.getContractAddresses()
    const hmyManager = new HRC721HmyManager(hmyManagerAddress, this.hmyOwnerWallet)
    // Get Bridged Token address
    const erc721Addr = await this.getBridgedTokenAddress(token, tokenId, txOptions)
    // Approve manager to lock tokens on Harmony network
    const approveTx = await token.approve(hmyManagerAddress, tokenId, txOptions)

    if (approveTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx?.id}`)
    }

    // Lock tokens on Harmony Network to mint on Ethereum Network
    const lockTokenTx = await hmyManager.lockNFT721Token(token.address, tokenId, recipient, txOptions)

    if (lockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx?.id}`)
    }

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx?.receipt?.blockNumber ?? ''), 10) + waitingFor

    await waitForNewBlock(expectedBlockNumber, ws, token.messenger.chainType, token.messenger.chainId)

    return { addr: erc721Addr, receiptId: lockTokenTx.id }
  }
}
