import { Account, Wallet } from '@harmony-js/account'
import { Contract as HmyContract } from '@harmony-js/contract'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Messenger } from '@harmony-js/network'
import { Transaction } from '@harmony-js/transaction'
import { hexToNumber, numberToHex } from '@harmony-js/utils'
import { DEFAULT_GAS_PRICE } from '../constants'
import { ContractProviderType, ITransactionOptions } from '../interfaces'
import { Key, MnemonicKey, PrivateKey } from '../wallets'

export class ContractError extends Error {
  public readonly type: string

  constructor(message: string, type: string) {
    super(message)
    this.name = ContractError.name
    this.type = type

    Error.captureStackTrace(this, this.constructor)
  }
}

export class HarmonyContract extends HmyContract {
  public readonly wallet: Wallet

  constructor(abi: any[], address: string, provider: ContractProviderType, options?: ContractOptions) {
    super(abi, address, options, provider)
    this.wallet = provider
  }
}

export abstract class BaseContract {
  protected readonly _contract: HarmonyContract
  protected readonly _provider: ContractProviderType

  public get address(): string {
    return this._contract.address
  }

  public get messenger(): Messenger {
    return this._provider.messenger
  }

  constructor(address: string, abi: any[], provider: ContractProviderType, options?: ContractOptions) {
    this._contract = new HarmonyContract(abi, address, provider, options)
    this._provider = provider
  }

  protected sanitizeAddress(address: string): string {
    return address.toLowerCase()
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
        gasPrice: numberToHex(options.gasPrice),
      })
      gasLimit = hexToNumber(hexValue)
    }

    return { ...options, gasLimit }
  }

  public async call<T>(method: string, args: any[] = [], txOptions?: ITransactionOptions): Promise<T> {
    const options = await this.estimateGas(method, args, txOptions)

    return this._contract.methods[method](...args).call(options)
  }

  public async send(method: string, args: any[] = [], txOptions?: ITransactionOptions): Promise<Transaction> {
    const options = await this.estimateGas(method, args, txOptions)
    const response: HmyContract = await this._contract.methods[method](...args).send(options)

    if (!response.transaction) {
      throw new ContractError('Invalid transaction response', method)
    }

    return response.transaction
  }

  public setSignerByPrivateKey(privateKey: string): Account {
    const account = this._contract.wallet.addByPrivateKey(privateKey)

    // Force the new account as defaultSigner
    if (account.address) {
      this._contract.wallet.setSigner(account.address)
    }

    return account
  }

  public setSignerByMnemonic(mnemonic: string, index = 0): Account {
    const account = this._contract.wallet.addByMnemonic(mnemonic, index)

    // Force the new account as defaultSigner
    if (account.address) {
      this._contract.wallet.setSigner(account.address)
    }

    return account
  }

  public setSignerByKey(key: Key | PrivateKey | MnemonicKey): void {
    this._contract.connect(key)
  }
}
