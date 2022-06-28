import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { BNish, ITransactionOptions } from '../interfaces'
import { BaseToken } from './baseToken'

export class HRC20 extends BaseToken {
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

  public mint(account: string, amount: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('mint', [account, amount], txOptions)
  }

  public burn(amount: number, txOptions?: ITransactionOptions) {
    return this.send('burn', [amount], txOptions)
  }

  public burnFrom(account: string, amount: number, txOptions?: ITransactionOptions) {
    return this.send('burnFrom', [account, amount], txOptions)
  }
}
