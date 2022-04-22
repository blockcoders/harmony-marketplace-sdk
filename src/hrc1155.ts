import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { BaseToken } from './base-token'
import { ContractError } from './base-token-contract'
import { AddressZero } from './constants'
import { BNish, BridgeApprovalParams, ContractProviderType, ITransactionOptions } from './interfaces'

export class HRC1155 extends BaseToken {
  constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions) {
    super(address, abi, provider, options)
  }

  public async balanceOf(address: string, id: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    return this.getBalance(address, id, txOptions)
  }

  public async balanceOfBatch(accounts: string[], ids: BNish[], txOptions?: ITransactionOptions): Promise<BN[]> {
    if (accounts.length !== ids.length) {
      throw new ContractError('Accounts and ids must have the same length', 'balanceOfBatch')
    }

    return this.call<BN[]>('balanceOfBatch', [accounts, ids], txOptions)
  }

  public async safeTransferFrom(
    from: string,
    to: string,
    id: BNish,
    amount: BNish,
    data: any,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    if (to === AddressZero) {
      throw new ContractError(`The to cannot be the ${AddressZero}`, 'safeTransferFrom')
    }

    return this.send('safeTransferFrom', [from, to, id, amount, data], txOptions)
  }

  public async safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BNish[],
    amounts: BNish[],
    data: any,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    if (amounts.length !== ids.length) {
      throw new ContractError('amounts and ids must have the same length', 'safeBatchTransferFrom')
    }

    return this.send('safeBatchTransferFrom', [from, to, ids, amounts, data], txOptions)
  }

  public async owner(txOptions?: ITransactionOptions): Promise<string> {
    const address = await this.call<string>('owner', [], txOptions)

    return this.sanitizeAddress(address)
  }

  public async tokenURIPrefix(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('tokenURIPrefix', [], txOptions)
  }

  public async contractURI(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('contractURI', [], txOptions)
  }

  protected bridgeApproval(
    _data: BridgeApprovalParams,
    _sendTxCallback: (tx: string) => void,
    _txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    throw new Error('Method not implemented.')
  }
}
