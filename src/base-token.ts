import { BigNumber, BigNumberish, isBigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { Zero, AddressZero } from '@ethersproject/constants'
import { Logger } from '@ethersproject/logger'
import { Wallet } from '@harmony-js/account'
import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { logger } from './logger'
export class BaseError extends Error {
  public readonly type: string
  public readonly code: number
  public readonly data: string

  constructor(message: string, type: string, code: number, data: string) {
    super(message)
    this.name = BaseError.name
    this.type = type
    this.code = code
    this.data = data

    Error.captureStackTrace(this, this.constructor)
  }
}

export abstract class BaseToken {
  private baseContract: Contract
  private isSignerSet = false

  constructor(address: string, abi: any, private client: Harmony) {
    this.baseContract = this.client.contracts.createContract(abi, address)
  }

  async _getBalance(address: string, id?: BigNumberish): Promise<number> {
    if (!address) {
      throw new Error('You have to provide an address')
    }

    this.checkNotBeZeroAddress(address)

    try {
      let balance: BigNumber = Zero
      if (!isBigNumberish(id)) {
        balance = await this.baseContract.methods.balanceOf(address).call()
        return balance.toNumber()
      }

      balance = await this.baseContract.methods.balanceOf(address, id).call()
      return balance.toNumber()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        params: { address, id },
        error,
      })
    }
  }

  async setApprovalForAll(addressOperator: string, approved: boolean): Promise<any> {
    throw new Error('setApprovalForAll is not implemented yet')
  }

  async isApprovedForAll(addressOwner: string, addressOperator: string): Promise<boolean> {
    if (!addressOwner && !addressOperator) {
      throw new Error('You must provide an addressOwner and an addressOperator')
    }

    try {
      return await this.baseContract.methods.isApprovedForAll(addressOwner, addressOperator).call()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'isApprovedForAll',
        params: { addressOwner, addressOperator },
        error,
      })
    }
  }

  /**
   * Will set the signer in order to execute transactions
   *
   * @param {string} privateKey
   * @memberof HRC721
   */
  setSignerByPrivateKey(privateKey: string, type: string): void {
    if (!privateKey) throw new BaseError('You must provide a privateKey', type, -1, privateKey)

    const wallet: Wallet = this.baseContract.wallet
    const account = wallet.addByPrivateKey(privateKey)

    if (!account.address) throw new BaseError('You must provide a valid privateKey', type, -1, privateKey)

    wallet.setSigner(account.address)
    this.isSignerSet = true
  }

  checkForSigner(type: string): void {
    if (!this.isSignerSet)
      throw new BaseError(
        'You must set the signer before executing transactions. Call setSignerByPrivateKey',
        type,
        -1,
        '',
      )
  }

  checkNotBeZeroAddress(firstAddress: string, secondsAddress?: string) {
    if (firstAddress === AddressZero || (secondsAddress && secondsAddress === AddressZero)) {
      throw new Error('You have to provide a non zero address')
    }
  }
}
