import { Transaction } from '@harmony-js/transaction'
import { BaseContract } from '../contracts'
import { BNish, ITransactionOptions } from '../interfaces'

export class HRC1155EthManager extends BaseContract {
  public async addToken(
    tokenManager: string,
    ethTokenAddr: string,
    name: string,
    symbol: string,
    baseURI: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('addToken', [tokenManager, ethTokenAddr, name, symbol, baseURI], txOptions)
  }

  public async removeToken(
    tokenManager: string,
    ethTokenAddr: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('removeToken', [tokenManager, ethTokenAddr], txOptions)
  }

  public async burnToken(
    oneToken: string,
    tokenId: BNish,
    recipient: string,
    amount: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('burnToken', [oneToken, tokenId, recipient, amount], txOptions)
  }

  public async burnTokens(
    oneToken: string,
    tokenIds: BNish[],
    recipient: string,
    amounts: BNish[],
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('burnTokens', [oneToken, tokenIds, recipient, amounts], txOptions)
  }


  public async mintToken(
    oneToken: string,
    tokenId: BNish,
    recipient: string,
    receiptId: string,
    amount: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('mintToken', [oneToken, tokenId, recipient, receiptId, amount], txOptions)
  }

  public async mintTokens(
    oneToken: string,
    tokenIds: BNish[],
    recipient: string,
    receiptId: string,
    amounts: BNish[],
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('mintTokens', [oneToken, tokenIds, recipient, receiptId, amounts], txOptions)
  }
}
