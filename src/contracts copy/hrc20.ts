import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { BNish, ContractProviderType, ITransactionOptions } from '../interfaces'
import { BaseToken } from './base-token'

export class HRC20 extends BaseToken {
  constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions) {
    super(address, abi, provider, options)
  }

  public async totalSupply(txOptions?: ITransactionOptions): Promise<BN> {
    return this.call<BN>('totalSupply', [], txOptions)
  }

  public async balanceOf(address: string, txOptions?: ITransactionOptions): Promise<BN> {
    return await this.getBalance(address, undefined, txOptions)
  }

  public async transfer(to: string, amount: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('transfer', [to, amount], txOptions)
  }

  public async allowance(owner: string, spender: string, txOptions?: ITransactionOptions): Promise<BN> {
    return this.call<BN>('allowance', [owner, spender], txOptions)
  }

  public async approve(spender: string, amount: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('approve', [spender, amount], txOptions)
  }

  public async transferFrom(
    from: string,
    to: string,
    amount: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('transferFrom', [from, to, amount], txOptions)
  }

  public async symbol(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('symbol', [], txOptions)
  }

  public async name(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('name', [], txOptions)
  }

  public async decimals(txOptions?: ITransactionOptions): Promise<number> {
    return this.call<number>('decimals', [], txOptions)
  }
}
