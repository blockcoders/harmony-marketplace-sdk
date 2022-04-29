import { BaseTokenContract } from '../../../tokens/base-token-contract'

export class HRC721HmyManagerContract extends BaseTokenContract {
  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockNFT721Token(ethTokenAddr: string, tokenId: number, recipient: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenIds tokenIds of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockTokens(ethTokenAddr: string, tokenIds: number[], recipient: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev unlock tokens after burning them on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to unlock
   * @param recipient recipient of the unlock tokens
   * @param receiptId transaction hash of the burn event on harmony chain
   */
  async unlockToken(ethTokenAddr: string, tokenId: number, recipient: string, receiptId: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev unlock tokens after burning them on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenIds tokenIds of the token to unlock
   * @param recipient recipient of the unlock tokens
   * @param receiptId transaction hash of the burn event on harmony chain
   */
  async unlockTokens(ethTokenAddr: string, tokenIds: number[], recipient: string, receiptId: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenId tokenId of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockNFT1155Token(ethTokenAddr: string, tokenId: number, recipient: string, amount: number, data: any) {
    throw Error('Not implemented yet')
  }

  async unlockNFT1155Token(ethTokenAddr: string, tokenId: number, recipient: string, receiptId: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev lock tokens to be minted on harmony chain
   * @param ethTokenAddr is the ethereum token contract address
   * @param tokenIds tokenIds of the token to lock
   * @param recipient recipient address on the harmony chain
   */
  async lockNFT1155Tokens(ethTokenAddr: string, tokenIds: number[], recipient: string) {
    throw Error('Not implemented yet')
  }

  async unlockNFT1155Tokens(ethTokenAddr: string, tokenIds: number[], recipient: string, receiptId: string) {
    throw Error('Not implemented yet')
  }
}
