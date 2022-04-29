import { BaseTokenContract } from '../../../tokens/base-token-contract'

export class ERC721HmyManagerContract extends BaseTokenContract {
  async mappings(ethTokenAddress: string): Promise<string> {
    throw Error('Not implemented yet')
  }

  /**
   * @dev map an ethereum token to harmony
   * @param tokenManager address to token manager
   * @param ethTokenAddr ethereum token address to map
   * @param name of the ethereum token
   * @param symbol of the ethereum token
   * @param baseURI base URI of the token
   */
  async addToken(tokenManager: string, ethTokenAddr: string, name: string, symbol: string, baseURI: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev deregister token mapping in the token manager
   * @param tokenManager address to token manager
   * @param ethTokenAddr address to remove token
   */
  async removeToken(tokenManager: string, ethTokenAddr: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev burns tokens on harmony to be unlocked on ethereum
   * @param oneToken harmony token address
   * @param tokenId tokenId to burn
   * @param recipient recipient of the unlock tokens on ethereum
   */
  async burnToken(oneToken: string, tokenId: number, recipient: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev burns tokens on harmony to be unlocked on ethereum
   * @param oneToken harmony token address
   * @param tokenIds tokenIds to burn
   * @param recipient recipient of the unlock tokens on ethereum
   */
  async burnTokens(oneToken: string, tokenIds: number[], recipient: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev mints tokens corresponding to the tokens locked in the ethereum chain
   * @param oneToken is the token address for minting
   * @param tokenId tokenId for minting
   * @param recipient recipient of the minted tokens (harmony address)
   * @param receiptId transaction hash of the lock event on ethereum chain
   */
  async mintToken(oneToken: string, tokenId: number, recipient: string, receiptId: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev mints tokens corresponding to the tokens locked in the ethereum chain
   * @param oneToken is the token address for minting
   * @param tokenIds tokenIds for minting
   * @param recipient recipient of the minted tokens (harmony address)
   * @param receiptId transaction hash of the lock event on ethereum chain
   */
  async mintTokens(oneToken: string, tokenIds: number[], recipient: string, receiptId: string) {
    throw Error('Not implemented yet')
  }
}
