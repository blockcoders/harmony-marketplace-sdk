import { ITransactionOptions } from '../../../interfaces'
import { BaseTokenContract } from '../../../tokens/base-token-contract'

export class HRC721HmyManagerContract extends BaseTokenContract {
  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockNFT721Token(ethTokenAddr: string, tokenId: number, recipient: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing lockNFT721Token: ', { ethTokenAddr, tokenId, recipient, txOptions })
      return this.send('lockNFT721Token', [ethTokenAddr, tokenId, recipient], txOptions)
    } catch (error) {
      throw Error(`Error in method "lockNFT721Token": ${error}`)
    }
  }

  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenIds tokenIds of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockTokens(ethTokenAddr: string, tokenIds: number[], recipient: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing lockTokens: ', { ethTokenAddr, tokenIds, recipient, txOptions })
      return this.send('lockTokens', [ethTokenAddr, tokenIds, recipient], txOptions)
    } catch (error) {
      throw Error(`Error in method "lockTokens": ${error}`)
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
    tokenId: number,
    recipient: string,
    receiptId: string,
    txOptions: ITransactionOptions,
  ) {
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
  ) {
    try {
      // console.log('Executing unlockTokens: ', { ethTokenAddr, tokenIds, recipient, receiptId, txOptions })
      return this.send('unlockTokens', [ethTokenAddr, tokenIds, recipient, receiptId], txOptions)
    } catch (error) {
      throw Error(`Error in method "unlockTokens": ${error}`)
    }
  }

  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockNFT1155Token(
    ethTokenAddr: string,
    tokenId: number,
    recipient: string,
    amount: number,
    data: any,
    txOptions: ITransactionOptions,
  ) {
    try {
      // console.log('Executing lockNFT1155Token: ', { ethTokenAddr, tokenId, recipient, amount, data, txOptions })
      return this.send('lockNFT1155Token', [ethTokenAddr, tokenId, recipient, amount, data], txOptions)
    } catch (error) {
      throw Error(`Error in method "lockNFT1155Token": ${error}`)
    }
  }

  async unlockNFT1155Token(
    ethTokenAddr: string,
    tokenId: number,
    recipient: string,
    receiptId: string,
    txOptions: ITransactionOptions,
  ) {
    try {
      // console.log('Executing unlockNFT1155Token: ', { ethTokenAddr, tokenId, recipient, receiptId, txOptions })
      return this.send('unlockNFT1155Token', [ethTokenAddr, tokenId, recipient, receiptId], txOptions)
    } catch (error) {
      throw Error(`Error in method "unlockNFT1155Token": ${error}`)
    }
  }

  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenIds tokenIds of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockNFT1155Tokens(ethTokenAddr: string, tokenIds: number[], recipient: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing lockNFT1155Tokens: ', { ethTokenAddr, tokenIds, recipient, txOptions })
      return this.send('lockNFT1155Tokens', [ethTokenAddr, tokenIds, recipient], txOptions)
    } catch (error) {
      throw Error(`Error in method "lockNFT1155Tokens": ${error}`)
    }
  }

  async unlockNFT1155Tokens(
    ethTokenAddr: string,
    tokenIds: number[],
    recipient: string,
    receiptId: string,
    txOptions: ITransactionOptions,
  ) {
    try {
      // console.log('Executing unlockNFT1155Tokens: ', { ethTokenAddr, tokenIds, recipient, receiptId, txOptions })
      return this.send('unlockNFT1155Tokens', [ethTokenAddr, tokenIds, recipient, receiptId], txOptions)
    } catch (error) {
      throw Error(`Error in method "unlockNFT1155Tokens": ${error}`)
    }
  }
}
