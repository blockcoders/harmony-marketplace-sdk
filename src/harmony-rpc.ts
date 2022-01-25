import { Logger } from '@ethersproject/logger'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { BaseHR721 } from './base-hr721'
import { logger } from './logger'

export class RpcError extends Error {
  public readonly type: string
  public readonly code: number
  public readonly data: string

  constructor(message: string, type: string, code: number, data: string) {
    super(message)
    this.name = RpcError.name
    this.type = type
    this.code = code
    this.data = data

    Error.captureStackTrace(this, this.constructor)
  }
}

export class HR721 extends BaseHR721 {
  private readonly rpcProvider: JsonRpcProvider
  private abi: any[]
  private readonly contract: ethers.Contract
  constructor(provider: JsonRpcProvider, abi: any[], address: string) {
    super()
    this.rpcProvider = provider
    this.abi = abi
    this.contract = new ethers.Contract(address, this.abi, this.rpcProvider)
  }

  async balanceOf(address: string): Promise<string> {
    if (address) {
      throw new Error('Balance query for the zero address')
    }

    return ''
  }

  async ownerOf(tokenId: string): Promise<string> {
    if (!tokenId) {
      throw new Error('Owner query for nonexistent token')
    }

    const owner = await this.contract.ownerOf(tokenId)
    try {
      return owner
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'ownerOf',
        params: tokenId,
        result: owner,
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
    return true
  }

  async safeTransferFromWithData(fromAddress: string, toAddress: string, tokenId: string, data: any): Promise<any> {
    return
  }
}
