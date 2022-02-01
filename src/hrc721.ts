import { Harmony } from '@harmony-js/core'
import { Transaction } from '@harmony-js/transaction'
import { Unit } from '@harmony-js/utils'
import { hexToNumber } from '@harmony-js/utils'
import { BigNumber, logger } from 'ethers'
import { Logger } from 'ethers/lib/utils'
import { BaseToken } from './base-implementation'
import { ITransactionOptions } from './interfaces'

const DEFAULT_GAS_PRICE = new Unit('100').asGwei().toHex()

export class HRC721 extends BaseToken {
  constructor(address: string, abi: any, client: Harmony) {
    super(address, abi, client)
  }

  async balanceOf(address: string): Promise<number> {
    if (!address) {
      throw new Error('You have provide an address')
    }

    try {
      const balance: BigNumber = await this._getBalance(address)
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
    if (!tokenId) {
      throw new Error('You must provide a tokenId')
    }

    try {
      return await this.contract.methods.getApproved(tokenId).call()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'getApproved',
        params: tokenId,
        error,
      })
    }
  }

  async safeTransferFromWithData(fromAddress: string, toAddress: string, tokenId: string, data: any): Promise<any> {
    return
  }
}
