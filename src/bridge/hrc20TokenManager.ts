import { Transaction } from '@harmony-js/transaction'
import { BaseContract } from '../contracts'
import { BNish, ITransactionOptions } from '../interfaces'

export class HRC20TokenManager extends BaseContract {
  public async rely(address: string, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('rely', [address], txOptions)
  }

  public async deny(address: string, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('deny', [address], txOptions)
  }

  public async addToken(
    ethTokenAddr: string,
    name: string,
    symbol: string,
    decimals: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('addToken', [ethTokenAddr, name, symbol, decimals], txOptions)
  }

  public async registerToken(
    ethTokenAddr: string,
    oneTokenAddr: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('registerToken', [ethTokenAddr, oneTokenAddr], txOptions)
  }

  public async removeToken(ethTokenAddr: string, supply: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('removeToken', [ethTokenAddr, supply], txOptions)
  }
}
