import { ITransactionOptions } from '../../../interfaces'
import { BaseTokenContract } from '../../../tokens/base-token-contract'

export class HRC721EthManagerContract extends BaseTokenContract {
  /**
   * @dev map an ethereum token to harmony
   * @param tokenManager address to token manager
   * @param ethTokenAddr ethereum token address to map
   * @param name of the ethereum token
   * @param symbol of the ethereum token
   * @param baseURI base URI of the token
   */
  async addToken(
    tokenManager: string,
    ethTokenAddr: string,
    name: string,
    symbol: string,
    baseURI: string,
    txOptions: ITransactionOptions,
  ) {
    try {
      // console.log('Executing addToken: ', { tokenManager, ethTokenAddr, name, symbol, baseURI, txOptions })
      return this.send('addToken', [tokenManager, ethTokenAddr, name, symbol, baseURI], txOptions)
    } catch (error) {
      throw Error(`Error in method "addToken": ${error}`)
    }
  }

  /**
   * @dev deregister token mapping in the token manager
   * @param tokenManager address to token manager
   * @param ethTokenAddr address to remove token
   */
  async removeToken(tokenManager: string, ethTokenAddr: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing removeToken: ', { tokenManager, ethTokenAddr, txOptions })
      return this.send('removeToken', [tokenManager, ethTokenAddr], txOptions)
    } catch (error) {
      throw Error(`Error in method "removeToken": ${error}`)
    }
  }

  /**
   * @dev burns tokens on harmony to be unlocked on ethereum
   * @param oneToken harmony token address
   * @param tokenId tokenId to burn
   * @param recipient recipient of the unlock tokens on ethereum
   */
  async burnToken(oneToken: string, tokenId: number, recipient: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing burnToken: ', { oneToken, tokenId, recipient, txOptions })
      return this.send('burnToken', [oneToken, tokenId, recipient], txOptions)
    } catch (error) {
      throw Error(`Error in method "burnToken": ${error}`)
    }
  }

  /**
   * @dev burns tokens on harmony to be unlocked on ethereum
   * @param oneToken harmony token address
   * @param tokenIds tokenIds to burn
   * @param recipient recipient of the unlock tokens on ethereum
   */
  async burnTokens(oneToken: string, tokenIds: number[], recipient: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing burnTokens: ', { oneToken, tokenIds, recipient, txOptions })
      return this.send('burnTokens', [oneToken, tokenIds, recipient], txOptions)
    } catch (error) {
      throw Error(`Error in method "burnTokens": ${error}`)
    }
  }

  /**
   * @dev mints tokens corresponding to the tokens locked in the ethereum chain
   * @param oneToken is the token address for minting
   * @param tokenId tokenId for minting
   * @param recipient recipient of the minted tokens (harmony address)
   * @param receiptId transaction hash of the lock event on ethereum chain
   */
  async mintToken(
    oneToken: string,
    tokenId: number,
    recipient: string,
    receiptId: string,
    txOptions: ITransactionOptions,
  ) {
    try {
      // console.log('Executing mintToken: ', { oneToken, tokenId, recipient, receiptId, txOptions })
      return this.send('mintToken', [oneToken, tokenId, recipient, receiptId], txOptions)
    } catch (error) {
      throw Error(`Error in method "mintToken": ${error}`)
    }
  }

  /**
   * @dev mints tokens corresponding to the tokens locked in the ethereum chain
   * @param oneToken is the token address for minting
   * @param tokenIds tokenIds for minting
   * @param recipient recipient of the minted tokens (harmony address)
   * @param receiptId transaction hash of the lock event on ethereum chain
   */
  async mintTokens(
    oneToken: string,
    tokenIds: number[],
    recipient: string,
    receiptId: string,
    txOptions: ITransactionOptions,
  ) {
    try {
      // console.log('Executing mintTokens: ', { oneToken, tokenIds, recipient, receiptId, txOptions })
      return this.send('mintTokens', [oneToken, tokenIds, recipient, receiptId], txOptions)
    } catch (error) {
      throw Error(`Error in method "mintTokens": ${error}`)
    }
  }
}
