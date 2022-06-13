import { BaseTokenContract } from '../../tokens/base-token-contract'

export class TokenManager extends BaseTokenContract {
  async rely(guy: string) {
    throw Error('Not implemented yet')
  }

  async deny(guy: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev map ethereum token to harmony token and emit mintAddress
   * @param ethTokenAddr address of the ethereum token
   * @return mintAddress of the mapped token
   */
  async addToken(ethTokenAddr: string, name: string, symbol: string, decimals: number) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev register an ethereum token to harmony token mapping
   * @param ethTokenAddr address of the ethereum token
   * @return oneToken of the mapped harmony token
   */
  async registerToken(ethTokenAddr: string, oneTokenAddr: string) {
    throw Error('Not implemented yet')
  }

  /**
   * @dev remove an existing token mapping
   * @param ethTokenAddr address of the ethereum token
   * @param supply only allow removing mapping when supply, e.g., zero or 10**27
   */
  async removeToken(ethTokenAddr: string, supply: number) {
    throw Error('Not implemented yet')
  }
}
