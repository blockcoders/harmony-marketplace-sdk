import { Logger } from '@ethersproject/logger'
import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { Transaction } from '@harmony-js/transaction'
import { Unit } from '@harmony-js/utils'
import { hexToNumber } from '@harmony-js/utils'
import { BaseToken } from './base-token'
import { ITransactionOptions } from './interfaces'
import { logger } from './logger'

const DEFAULT_GAS_PRICE = new Unit('100').asGwei().toHex()

export class HRC721 extends BaseToken {
  private contract: Contract
  constructor(address: string, abi: any, private harmonyClient: Harmony) {
    super(address, abi, harmonyClient)
    this.contract = this.harmonyClient.contracts.createContract(abi, address)
  }

  async balanceOf(address: string): Promise<number> {
    return await this._getBalance(address)
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
