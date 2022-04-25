import { Transaction } from '@harmony-js/transaction'
import { BaseTokenContract } from './base-token-contract'
import { ITransactionOptions } from './interfaces'

export class HarmonyManagerContract extends BaseTokenContract {
  addToken(tokenManager: string, ethTokenAddr: string, name: string, symbol: string) {
    console.log(tokenManager, ethTokenAddr, name, symbol)
    throw Error('Not implemented yet')
  }

  removeToken(tokenManager: string, ethTokenAddr: string) {
    console.log(tokenManager, ethTokenAddr)
    throw Error('Not implemented yet')
  }

  burnToken(
    oneToken: string,
    tokenId: number,
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    try {
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
      return this.send('burnTokens', [oneToken, tokenIds, recipient], txOptions)
    } catch (error) {
      throw Error(`Error executing burnTokens: ${error}`)
    }
  }

  mintToken(oneToken: string, tokenId: number, recipient: string, receipt: any /* bytes32 ? */) {
    console.log(oneToken, tokenId, recipient, receipt)
    throw Error('Not implemented yet')
  }

  mintTokens(oneToken: string, tokenIds: number[], recipient: string, receipt: any /* bytes32 ? */) {
    console.log(oneToken, tokenIds, recipient, receipt)
    throw Error('Not implemented yet')
  }
}
