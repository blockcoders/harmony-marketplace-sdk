import { JsonRpcProvider } from '@ethersproject/providers'
import { BaseHR721 } from './base-hr721'

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
  constructor(provider: JsonRpcProvider) {
    super()
    this.rpcProvider = provider
  }

  async balanceOf(address: string): Promise<string> {
    if (!address) {
      throw new Error('Balance query for the zero address')
    }

    const balance = await this.rpcProvider.getBalance(address)
    return balance.toHexString()
  }

  async ownerOf(tokenId: string): Promise<string> {
    return ''
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
