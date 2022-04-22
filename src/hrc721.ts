import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { BaseToken } from './base-token'
import { ContractError } from './base-token-contract'
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

  protected async bridgeApproval(
    data: BridgeApprovalParams,
    sendTxCallback: (tx: string) => void,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      console.log('APPROVE')

      const { to, tokenId } = data || {}
      if (!tokenId) {
        throw Error('tokenId is required')
      }
      const approveTx = await this.approve(to, tokenId, txOptions)
      if (approveTx.txStatus !== 'CONFIRMED') {
        throw Error(`Transaction ${approveTx.txStatus}: ${approveTx}`)
      }
      await sendTxCallback(approveTx.id)
      return approveTx
    } catch (e) {
      throw Error(`Error while executing bridgeApproval: ${e}`)
    }
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
