import { Transaction } from '@harmony-js/transaction'
import { BaseContract } from '../contracts'
import { BNish, ITransactionOptions } from '../interfaces'

export class HRC20EthManager extends BaseContract {
  public async addToken(
    tokenManager: string,
    hmyTokenAddr: string,
    name: string,
    symbol: string,
    decimals: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('addToken', [tokenManager, hmyTokenAddr, name, symbol, decimals], txOptions)
  }

  public async removeToken(
    tokenManager: string,
    hmyTokenAddr: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('removeToken', [tokenManager, hmyTokenAddr], txOptions)
  }

  public async burnToken(
    ethToken: string,
    amount: BNish,
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('burnToken', [ethToken, amount, recipient], txOptions)
  }

  public async mintToken(
    ethToken: string,
    amount: BNish,
    recipient: string,
    receiptId: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('mintToken', [ethToken, amount, recipient, receiptId], txOptions)
  }
}
