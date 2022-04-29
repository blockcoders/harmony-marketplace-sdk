import { Transaction } from '@harmony-js/transaction'
import { BaseTokenContract } from '../../../tokens/base-token-contract'

export class ERC721EthManagerContract extends BaseTokenContract {
  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockToken(ethTokenAddr: string, tokenId: number, recipient: string): Promise<Transaction> {
    throw Error('Not implemented yet')
  }

  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenIds tokenIds of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockTokens(ethTokenAddr: string, tokenIds: number[], recipient: string): Promise<Transaction> {
    throw Error('Not implemented yet')
  }

  /**
   * @dev lock tokens for a user address to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param userAddr is token holder address
   * @param tokenId tokenId of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockTokenFor(ethTokenAddr: string, userAddr: string, tokenId: number, recipient: string): Promise<Transaction> {
    throw Error('Not implemented yet')
  }

  /**
   * @dev unlock tokens after burning them on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to unlock
   * @param recipient recipient of the unlock tokens
   * @param receiptId transaction hash of the burn event on harmony chain
   */
  async unlockToken(ethTokenAddr: string, tokenId: number, recipient: string, receiptId: string): Promise<Transaction> {
    throw Error('Not implemented yet')
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
  ): Promise<Transaction> {
    throw Error('Not implemented yet')
  }
}
