import { Transaction } from '@harmony-js/transaction'
import { BaseContract } from '../contracts'
import { BNish, ITransactionOptions } from '../interfaces'

export class HRC20HmyManager extends BaseContract {
  public async lockToken(
    hmyTokenAddr: string,
    amount: BNish,
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('lockToken', [hmyTokenAddr, amount, recipient], txOptions)
  }

  public async lockTokenFor(
    hmyTokenAddr: string,
    userAddr: string,
    amount: BNish,
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('lockTokenFor', [hmyTokenAddr, userAddr, amount, recipient], txOptions)
  }

  public async unlockToken(
    hmyTokenAddr: string,
    amount: BNish,
    recipient: string,
    receiptId: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('unlockToken', [hmyTokenAddr, amount, recipient, receiptId], txOptions)
  }

  public async lockOne(amount: BNish, recipient: string, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('lockOne', [amount, recipient], txOptions)
  }

  public async unlockOne(
    amount: BNish,
    recipient: string,
    receiptId: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('unlockOne', [amount, recipient, receiptId], txOptions)
  }
}
