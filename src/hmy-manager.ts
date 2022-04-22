import { Transaction } from '@harmony-js/transaction'
import { BaseTokenContract } from './base-token-contract'
import { ITransactionOptions } from './interfaces'

export class HarmonyManagerContract extends BaseTokenContract {
  addToken(tokenManager: string, ethTokenAddr: string, name: string, symbol: string) {
    console.log(tokenManager, ethTokenAddr, name, symbol)
  }

  removeToken(tokenManager: string, ethTokenAddr: string) {
    console.log(tokenManager, ethTokenAddr)
  }

  burnToken(
    oneToken: string,
    tokenId: number,
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      if (!txOptions) {
        txOptions = {
          gasPrice: 30000000000,
          gasLimit: 6721900,
        }
      }
      return this.send('burnToken', [oneToken, tokenId, recipient], txOptions)
    } catch (error) {
      throw Error(`Error executing burnToken: ${error}`)
    }
  }

  burnTokens(
    oneToken: string,
    tokenIds: number[],
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      if (!txOptions) {
        txOptions = {
          gasPrice: 30000000000,
          gasLimit: 6721900,
        }
      }
      return this.send('burnToken', [oneToken, tokenIds, recipient], txOptions)
    } catch (error) {
      throw Error(`Error executing burnTokens: ${error}`)
    }
  }

  mintToken(oneToken: string, tokenId: number, recipient: string, receipt: any /* bytes32 ? */) {
    console.log(oneToken, tokenId, recipient, receipt)
  }

  mintTokens(oneToken: string, tokenIds: number[], recipient: string, receipt: any /* bytes32 ? */) {
    console.log(oneToken, tokenIds, recipient, receipt)
  }
}
