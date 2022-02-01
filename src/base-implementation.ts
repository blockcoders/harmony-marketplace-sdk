import { Wallet } from '@harmony-js/account'
import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { BigNumber, logger, constants } from 'ethers'
import { Logger } from 'ethers/lib/utils'
import { Base } from './base-token'

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

export class BaseToken extends Base {
  public contract: Contract
  public isSignerSet = false

  constructor(address: string, abi: any, private client: Harmony) {
    super()
    this.contract = this.client.contracts.createContract(abi, address)
  }

  async _getBalance(address: string, id?: string): Promise<BigNumber> {
    if (!address) {
      throw new Error('You have provide an address')
    }

    try {
      let balance: BigNumber = constants.Zero

      if (!id) {
        balance = await this.contract.methods.balanceOf(address).call()
        return balance
      }

      balance = await this.contract.methods.balanceOf(address, id).call()
      return balance
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        params: { address, id },
        error,
      })
    }
  }

  async setApprovalForAll(addressOperator: string, approved: boolean): Promise<any> {
    return
  }

  async isApprovedForAll(addressOwner: string, addressOperator: string): Promise<boolean> {
    if (!addressOwner && !addressOperator) {
      throw new Error('You must provide an addressOwner and an addressOperator')
    }

    try {
      return await this.contract.methods.isApprovedForAll(addressOwner, addressOperator).call()
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
  setSignerByPrivateKey(privateKey: string): void {
    if (!privateKey) throw new BaseError('You must provide a privateKey', 'HRC721', -1, privateKey)

    const wallet: Wallet = this.contract.wallet
    const account = wallet.addByPrivateKey(privateKey)

    if (!account.address) throw new BaseError('You must provide a valid privateKey', 'HRC721', -1, privateKey)

    wallet.setSigner(account.address)
    this.isSignerSet = true
  }

  checkForSigner(): void {
    if (!this.isSignerSet)
      throw new BaseError(
        'You must set the signer before executing transactions. Call setSignerByPrivateKey',
        'HRC721',
        -1,
        '',
      )
  }
}
