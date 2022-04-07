import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { BaseToken, ContractError } from './base-token'
import { BNish, BridgeApprovalParams, ContractProviderType, ITransactionOptions } from './interfaces'
import { isBNish } from './utils'

export class HRC721 extends BaseToken {
  constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions) {
    super(address, abi, provider, options)
  }

  public async balanceOf(address: string, txOptions?: ITransactionOptions): Promise<BN> {
    return await this.getBalance(address, undefined, txOptions)
  }

  public async ownerOf(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!isBNish(tokenId)) {
      throw new ContractError('You must provide a tokenId', 'ownerOf')
    }

    const address = await this.call<string>('ownerOf', [tokenId], txOptions)

    return this.sanitizeAddress(address)
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

  protected bridgeApproval(
    data: BridgeApprovalParams,
    sendTxCallback: (tx: string) => void,
    txOptions?: ITransactionOptions | undefined,
  ): Promise<Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('APPROVE')

        const { to, tokenId } = data || {}
        if (!tokenId) {
          throw Error('tokenId is required')
        }
        const response = await this.approve(to, tokenId, txOptions)

        if (response?.id === undefined) {
          throw Error('Transaction must have an id')
        }
        await sendTxCallback(response.id)
        resolve(response)
      } catch (e) {
        console.log('Error: ', e)
        reject(e)
      }
    })
  }

  public async getApproved(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!isBNish(tokenId)) {
      throw new ContractError('You must provide a tokenId', 'getApproved')
    }

    const address = await this.call<string>('getApproved', [tokenId], txOptions)

    return this.sanitizeAddress(address)
  }

  public async totalSupply(txOptions?: ITransactionOptions): Promise<number> {
    return this.call<number>('totalSupply', [], txOptions)
  }

  public async tokenURI(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!isBNish(tokenId)) {
      throw new ContractError('You must provide a tokenId', 'tokenURI')
    }

    return this.call<string>('tokenURI', [tokenId], txOptions)
  }

  public async symbol(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('symbol', [], txOptions)
  }

  public async name(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('name', [], txOptions)
  }
}
