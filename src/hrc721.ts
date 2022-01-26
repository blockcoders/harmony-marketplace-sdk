import { Wallet } from '@harmony-js/account'
import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { Transaction } from '@harmony-js/transaction'
import { Unit } from '@harmony-js/utils'
import { hexToNumber } from '@harmony-js/utils'
import { BigNumber, logger } from 'ethers'
import { Logger } from 'ethers/lib/utils'
import { BaseHRC721 } from './base-hrc721'
import { ITransactionOptions } from './interfaces'

const DEFAULT_GAS_PRICE = new Unit('100').asGwei().toHex()

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

export class HRC721 extends BaseHRC721 {
  private contract: Contract
  private isSignerSet = false

  constructor(address: string, abi: any, private client: Harmony) {
    super()
    this.contract = this.client.contracts.createContract(abi, address)
  }

  async balanceOf(address: string): Promise<number> {
    if (!address) {
      throw new Error('You have provide an address')
    }

    try {
      const balance: BigNumber = await this.contract.methods.balanceOf(address).call()
      return balance.toNumber()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'balanceOf',
        params: address,
        error,
      })
    }
  }

  async ownerOf(tokenId: string): Promise<string> {
    if (!tokenId) {
      throw new Error('You must provide a tokenId')
    }
    try {
      return await this.contract.methods.ownerOf(tokenId).call()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'ownerOf',
        params: tokenId,
        error,
      })
    }
  }

  async safeTransferFrom(
    fromAddress: string,
    toAddress: string,
    tokenId: string,
    options: ITransactionOptions = {
      gasPrice: DEFAULT_GAS_PRICE,
    },
  ): Promise<Transaction> {
    this.checkForSigner()
    const method = this.contract.methods.safeTransferFrom(fromAddress, toAddress, tokenId)

    if (!options.gasLimit) {
      console.log('estimating')

      const gas = await method.estimateGas({ gasPrice: options.gasPrice })
      options.gasLimit = hexToNumber(gas)
    }

    const result = await method.send({
      gasPrice: options.gasPrice,
      gasLimit: options.gasLimit,
    })

    return result.transaction
  }

  async transferFrom(
    fromAddress: string,
    toAddress: string,
    tokenId: string,
    options: ITransactionOptions = {
      gasPrice: DEFAULT_GAS_PRICE,
    },
  ): Promise<Transaction> {
    this.checkForSigner()
    const method = this.contract.methods.transferFrom(fromAddress, toAddress, tokenId)

    if (!options.gasLimit) {
      const gas = await method.estimateGas({ gasPrice: options.gasPrice })
      options.gasLimit = hexToNumber(gas)
    }

    const result = await method.send({
      gasPrice: options.gasPrice,
      gasLimit: options.gasLimit,
    })

    return result.transaction
  }

  async approve(toAddress: string, tokenId: string): Promise<any> {
    return
  }

  async getApproved(tokenId: string): Promise<string> {
    return ''
  }

  async setApprovalForAll(addressOperator: string, approved: boolean): Promise<any> {
    return
  }

  async isApprovedForAll(addressOwner: string, addressOperator: string): Promise<boolean> {
    return true
  }

  async safeTransferFromWithData(fromAddress: string, toAddress: string, tokenId: string, data: any): Promise<any> {
    return
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

  private checkForSigner(): void {
    if (!this.isSignerSet)
      throw new BaseError(
        'You must set the signer before executing transactions. Call setSignerByPrivateKey',
        'HRC721',
        -1,
        '',
      )
  }
}
