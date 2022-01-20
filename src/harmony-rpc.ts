import { BigNumber } from '@ethersproject/bignumber'
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
  private abi: string
  constructor(provider: JsonRpcProvider, abi: string) {
    super()
    this.rpcProvider = provider
    this.abi = abi
  }

  private async _createAContract(address: string): Promise<ethers.Contract> {
    return new ethers.Contract(address, this.abi)
  }

  async balanceOf(address: string): Promise<string> {
    if (!address) {
      throw new Error('Balance query for the zero address')
    }

    const contract = await this._createAContract(address)
    const balance = await contract.balanceOf(address)
    try {
      return BigNumber.from(balance).toString()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'balanceOf',
        params: address,
        result: balance,
        error,
      })
    }
  }

  async ownerOf(tokenId: string): Promise<string> {
    return tokenId
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
    return tokenId
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
