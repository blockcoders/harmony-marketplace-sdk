import { ITransactionOptions } from '../../interfaces'
import { BaseTokenContract } from '../../tokens/base-token-contract'

export class TokenManager extends BaseTokenContract {
  async rely(guy: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing rely: ', { guy, txOptions })
      return this.send('rely', [guy], txOptions)
    } catch (error) {
      throw Error(`Error in method "rely": ${error}`)
    }
  }

  async deny(guy: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing deny: ', { guy, txOptions })
      return this.send('deny', [guy], txOptions)
    } catch (error) {
      throw Error(`Error in method "deny": ${error}`)
    }
  }

  /**
   * @dev map ethereum token to harmony token and emit mintAddress
   * @param ethTokenAddr address of the ethereum token
   * @return mintAddress of the mapped token
   */
  async addToken(ethTokenAddr: string, name: string, symbol: string, decimals: number, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing addToken: ', { ethTokenAddr, name, symbol, decimals, txOptions })
      return this.send('addToken', [ethTokenAddr, name, symbol, decimals], txOptions)
    } catch (error) {
      throw Error(`Error in method "addToken": ${error}`)
    }
  }

  /**
   * @dev register an ethereum token to harmony token mapping
   * @param ethTokenAddr address of the ethereum token
   * @return oneToken of the mapped harmony token
   */
  async registerToken(ethTokenAddr: string, oneTokenAddr: string, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing registerToken: ', { ethTokenAddr, oneTokenAddr, txOptions })
      return this.send('registerToken', [ethTokenAddr, oneTokenAddr], txOptions)
    } catch (error) {
      throw Error(`Error in method "registerToken": ${error}`)
    }
  }

  /**
   * @dev remove an existing token mapping
   * @param ethTokenAddr address of the ethereum token
   * @param supply only allow removing mapping when supply, e.g., zero or 10**27
   */
  async removeToken(ethTokenAddr: string, supply: number, txOptions: ITransactionOptions) {
    try {
      // console.log('Executing removeToken: ', { ethTokenAddr, supply, txOptions })
      return this.send('removeToken', [ethTokenAddr, supply], txOptions)
    } catch (error) {
      throw Error(`Error in method "removeToken": ${error}`)
    }
  }
}
