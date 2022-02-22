import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { BaseToken, ContractError } from './base-token'
import { BNish, ContractProviderType, ITransactionOptions } from './interfaces'

export class HRC721 extends BaseToken {
  constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions) {
    super(address, abi, provider, options)
  }

  public async balanceOf(address: string, txOptions?: ITransactionOptions): Promise<BN> {
    return await this._getBalance(address, null, txOptions)
  }

  public async ownerOf(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!tokenId) {
      throw new ContractError('You must provide a tokenId', 'ownerOf')
    }

    return this.call<string>('ownerOf', [tokenId], txOptions)
  }

  public async safeTransferFrom(
    from: string,
    to: string,
    tokenId: BNish,
    data?: any,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    const args: any[] = [from, to, tokenId]

    if (data) {
      args.push(data)
    }

    return this.send('safeTransferFrom', args, txOptions)
  }

  public async transferFrom(
    from: string,
    to: string,
    tokenId: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('transferFrom', [from, to, tokenId], txOptions)
  }

  public async approve(to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('approve', [to, tokenId], txOptions)
  }

  public async getApproved(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!tokenId) {
      throw new ContractError('You must provide a tokenId', 'getApproved')
    }

    return this.call<string>('getApproved', [tokenId], txOptions)
  }
}
