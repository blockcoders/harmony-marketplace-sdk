import { Account, Wallet } from '@harmony-js/account'
import { Contract as BaseContract } from '@harmony-js/contract'
import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import { hexToNumber, Unit } from '@harmony-js/utils'
import BN from 'bn.js'
import { BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE } from 'bridge-sdk'
import configs from 'bridge-sdk/lib/configs'
import { AddressZero, DEFAULT_GAS_PRICE } from './constants'
import { BNish, ContractProviderType, ITransactionOptions } from './interfaces'
import { Key } from './key'
import { MnemonicKey } from './mnemonic-key'
import { PrivateKey } from './private-key'
import { isBNish } from './utils'

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

  public async call<T>(method: string, args: any[] = [], txOptions?: ITransactionOptions): Promise<T> {
    const options = await this.estimateGas(method, args, txOptions)
    const result: any = await this._contract.methods[method](...args).call(options)

    return result as T
  }

  public async send(method: string, args: any[] = [], txOptions?: ITransactionOptions): Promise<Transaction> {
    const options = await this.estimateGas(method, args, txOptions)
    const response: BaseContract = await this._contract.methods[method](...args).send(options)

    if (!response.transaction) {
      throw new ContractError('Invalid transaction response', method)
    }

    return response.transaction
  }

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

  protected sanitizeAddress(address: string): string {
    return address.toLowerCase()
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

  public async bridgeToken(
    oneAddress: string,
    ethAddress: string,
    network: NETWORK_TYPE = NETWORK_TYPE.BINANCE,
    type: EXCHANGE_MODE,
    token: TOKEN,
    amount: number,
  ): Promise<void> {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 }) // 2 - full logs, 1 - only success & errors, 0 - logs off

    await bridgeSDK.init(configs.testnet)

    type === EXCHANGE_MODE.ETH_TO_ONE
      ? await bridgeSDK.addEthWallet('0xxxxxx')
      : await bridgeSDK.addOneWallet('0xxxxxxx')

    await bridgeSDK.sendToken({
      type,
      token,
      network,
      amount,
      //erc1155TokenId: '1',
      //erc1155Address: '0x35889EB854f5B1beB779161D565Af5921f528757',
      //hrc20Address: '0x5a7759ac1df3573692c6e6cedcf5b7aad035441e',
      oneAddress,
      ethAddress,
    })
  }
}
