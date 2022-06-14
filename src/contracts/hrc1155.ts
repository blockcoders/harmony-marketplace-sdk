import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { AddressZero } from '../constants'
import { BNish, ITransactionOptions } from '../interfaces'
import { ContractError } from './baseContract'
import { BaseToken } from './baseToken'

export class HRC1155 extends BaseToken {
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

  public async setApprovalForAll(
    addressOperator: string,
    approved: boolean,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    if (!addressOperator) {
      throw new Error('You must provide an addressOperator')
    }
    return this.send('setApprovalForAll', [addressOperator, approved], txOptions)
  }

  public async isApprovedForAll(owner: string, operator: string, txOptions?: ITransactionOptions): Promise<boolean> {
    if (!owner || owner === AddressZero) {
      throw new ContractError('Invalid owner provided', 'isApprovedForAll')
    }

    if (!operator || operator === AddressZero) {
      throw new ContractError('Invalid operator provided', 'isApprovedForAll')
    }

    return this.call('isApprovedForAll', [owner, operator], txOptions)
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

  public async totalSupply(id: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    return this.call<BN>('totalSupply', [id], txOptions)
  }
}
