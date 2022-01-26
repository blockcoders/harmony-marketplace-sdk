import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { BigNumber, logger } from 'ethers'
import { Logger } from 'ethers/lib/utils'
import { BaseHRC721 } from './base-HRC721'

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

  async safeTransferFrom(fromAddress: string, toAddress: string, tokenId: string): Promise<any> {
    return
  }

  async transferFrom(fromAddress: string, toAddress: string, tokenId: string): Promise<any> {
    return
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

  async safeTransferFromWithData(fromAddress: string, toAddress: string, tokenId: string, data: any): Promise<any> {
    return
  }
}
