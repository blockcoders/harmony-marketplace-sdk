import BN from 'bn.js'
import { AddressZero } from '../constants'
import { BNish, ITransactionOptions } from '../interfaces'
import { isBNish } from '../utils'
import { BaseContract, ContractError } from './base-contract'

export abstract class BaseToken extends BaseContract {
  protected async getBalance(address: string, id?: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    if (!address || address === AddressZero) {
      throw new ContractError('Invalid address provided', '_getBalance')
    }

    const args: any[] = [address]

    if (isBNish(id)) {
      args.push(id)
    }

    return this.call<BN>('balanceOf', args, txOptions)
  }
}
