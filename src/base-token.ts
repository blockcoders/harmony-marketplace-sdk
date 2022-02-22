import { Account, Wallet } from '@harmony-js/account'
import { Contract as BaseContract } from '@harmony-js/contract'
import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import { hexToNumber, Unit } from '@harmony-js/utils'
import BN from 'bn.js'
import { AddressZero, DEFAULT_GAS_PRICE } from './constants'
import { BNish, ContractProviderType, ITransactionOptions } from './interfaces'
import { Key } from './key'
import { MnemonicKey } from './mnemonic-key'
import { PrivateKey } from './private-key'

class Contract extends BaseContract {
  public readonly wallet: Wallet

  constructor(abi: AbiItemModel[], address: string, provider: ContractProviderType, options?: ContractOptions) {
    super(abi, address, options, provider)

    this.wallet = provider
  }
}

export class ContractError extends Error {
  public readonly type: string

  constructor(message: string, type: string) {
    super(message)
    this.name = ContractError.name
    this.type = type

    Error.captureStackTrace(this, this.constructor)
  }
}

export abstract class BaseToken {
  private readonly _contract: Contract

  constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions) {
    this._contract = new Contract(abi, address, provider, options)
  }

  public get contract(): Contract {
    return this._contract
  }

  public get address(): string {
    return this._contract.address
  }

  protected async estimateGas(
    method: string,
    args: any[] = [],
    options: ITransactionOptions = {
      gasPrice: DEFAULT_GAS_PRICE,
    },
  ): Promise<ITransactionOptions> {
    let gasLimit = options.gasLimit

    if (!gasLimit) {
      const hexValue = await this._contract.methods[method](...args).estimateGas({
        gasPrice: new Unit(options.gasPrice).asGwei().toHex(),
      })
      gasLimit = hexToNumber(hexValue)
    }

    return { gasPrice: new Unit(options.gasPrice).asGwei().toWeiString(), gasLimit }
  }

  protected async call<T>(method: string, args: any[] = [], txOptions?: ITransactionOptions): Promise<T> {
    const options = await this.estimateGas(method, args, txOptions)
    const result: any = await this._contract.methods[method](...args).call(options)

    return result as T
  }

  protected async send(method: string, args: any[] = [], txOptions?: ITransactionOptions): Promise<Transaction> {
    const options = await this.estimateGas(method, args, txOptions)
    console.log(options)
    const response: BaseContract = await this._contract.methods[method](...args).send(options)

    if (!response.transaction) {
      throw new ContractError('Invalid transaction response', method)
    }

    console.log(response.transaction)

    return response.transaction
  }

  protected async _getBalance(address: string, id: BNish | null, txOptions?: ITransactionOptions): Promise<BN> {
    if (!address || address === AddressZero) {
      throw new ContractError('Invalid address provided', '_getBalance')
    }

    const args: any[] = [address]

    if (id !== null) {
      args.push(id)
    }

    return this.call<BN>('balanceOf', args, txOptions)
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
      throw new Error('Invalid owner provided')
    }

    if (!operator || operator === AddressZero) {
      throw new Error('Invalid operator provided')
    }

    return this.call('isApprovedForAll', [owner, operator], txOptions)
  }

  public setSignerByPrivateKey(privateKey: string): Account {
    return this._contract.wallet.addByPrivateKey(privateKey)
  }

  public setSignerByMnemonic(mnemonic: string, index = 0): Account {
    return this._contract.wallet.addByMnemonic(mnemonic, index)
  }

  public setSignerByKey(key: Key | PrivateKey | MnemonicKey): void {
    this._contract.connect(key)
  }
}
