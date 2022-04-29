import { Account } from '@harmony-js/account'
import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { AddressZero } from '../constants'
import { BNish, BridgeParams, ITransactionOptions } from '../interfaces'
import { Key } from '../key'
import { MnemonicKey } from '../mnemonic-key'
import { PrivateKey } from '../private-key'
import { isBNish } from '../utils'
import { BaseTokenContract, ContractError } from './base-token-contract'

export abstract class BaseToken extends BaseTokenContract {
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

  protected abstract bridgeToken(options: BridgeParams, hmyProvider: PrivateKey,txOptions?: ITransactionOptions): Promise<void>
}
