import { Transaction } from '@harmony-js/transaction'
import { BaseContract } from '../contracts'
import { BNish, ITransactionOptions } from '../interfaces'

export class HRC1155TokenManager extends BaseContract {
  public async rely(address: string, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('rely', [address], txOptions)
  }

  public async deny(address: string, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('deny', [address], txOptions)
  }

  public async addHRC1155Token(
    ethTokenAddr: string,
    name: string,
    symbol: string,
    baseURI: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('addHRC1155Token', [ethTokenAddr, name, symbol, baseURI], txOptions)
  }

  public async registerToken(
    ethTokenAddr: string,
    oneTokenAddr: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('registerToken', [ethTokenAddr, oneTokenAddr], txOptions)
  }

  public async removeHRC1155Token(ethTokenAddr: string, supply: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('removeHRC1155Token', [ethTokenAddr, supply], txOptions)
  }
}
