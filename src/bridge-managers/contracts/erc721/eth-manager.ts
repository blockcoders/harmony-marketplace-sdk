import { Transaction } from '@harmony-js/transaction'
import { BNish, ITransactionOptions } from '../../../interfaces'
import { BaseTokenContract } from '../../../tokens/base-token-contract'

export class ERC721EthManagerContract extends BaseTokenContract {
  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockToken(
    ethTokenAddr: string,
    tokenId: number,
    recipient: string,
    txOptions: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      // console.log('Executing lockToken: ', { ethTokenAddr, tokenId, recipient, txOptions })
      return this.send('lockToken', [ethTokenAddr, tokenId, recipient], txOptions)
    } catch (error) {
      throw Error(`Error in method "lockToken": ${error}`)
    }
  }

  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenIds tokenIds of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockTokens(
    ethTokenAddr: string,
    tokenIds: number[],
    recipient: string,
    txOptions: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      // console.log('Executing lockTokens: ', { ethTokenAddr, tokenIds, recipient, txOptions })
      return this.send('lockTokens', [ethTokenAddr, tokenIds, recipient], txOptions)
    } catch (error) {
      throw Error(`Error in method "lockTokens": ${error}`)
    }
  }

  /**
   * @dev lock tokens for a user address to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param userAddr is token holder address
   * @param tokenId tokenId of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockTokenFor(
    ethTokenAddr: string,
    userAddr: string,
    tokenId: BNish,
    recipient: string,
    txOptions: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      // console.log('Executing lockTokenFor: ', { ethTokenAddr, userAddr, tokenId, recipient, txOptions })
      return this.send('lockTokenFor', [ethTokenAddr, userAddr, tokenId, recipient], txOptions)
    } catch (error) {
      throw Error(`Error in method "lockTokenFor": ${error}`)
    }
  }

  /**
   * @dev unlock tokens after burning them on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to unlock
   * @param recipient recipient of the unlock tokens
   * @param receiptId transaction hash of the burn event on harmony chain
   */
  async unlockToken(
    ethTokenAddr: string,
    tokenId: BNish,
    recipient: string,
    receiptId: string,
    txOptions: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      // console.log('Executing unlockToken: ', { ethTokenAddr, tokenId, recipient, receiptId, txOptions })
      return this.send('unlockToken', [ethTokenAddr, tokenId, recipient, receiptId], txOptions)
    } catch (error) {
      throw Error(`Error in method "unlockToken": ${error}`)
    }
  }

  /**
   * @dev unlock tokens after burning them on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenIds tokenIds of the token to unlock
   * @param recipient recipient of the unlock tokens
   * @param receiptId transaction hash of the burn event on harmony chain
   */
  async unlockTokens(
    ethTokenAddr: string,
    tokenIds: number[],
    recipient: string,
    receiptId: string,
    txOptions: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      // console.log('Executing unlockTokens: ', { ethTokenAddr, tokenIds, recipient, receiptId, txOptions })
      return this.send('unlockTokens', [ethTokenAddr, tokenIds, recipient, receiptId], txOptions)
    } catch (error) {
      throw Error(`Error in method "unlockTokens": ${error}`)
    }
  }
}
