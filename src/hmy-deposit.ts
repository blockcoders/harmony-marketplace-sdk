import { Transaction } from '@harmony-js/transaction'
import { withDecimals } from 'bridge-sdk/lib/blockchain/utils'
import { BaseTokenContract } from './base-token-contract'
import { ITransactionOptions } from './interfaces'

export class HarmonyDepositContract extends BaseTokenContract {
  deposit(amount: number, txOptions?: ITransactionOptions): Promise<Transaction> {
    try {
      return this.send('deposit', [withDecimals(amount, 18)], txOptions)
    } catch (error) {
      throw Error(`Error executing deposit: ${error}`)
    }
  }
}
