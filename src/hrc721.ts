import { getStatic } from '@ethersproject/properties'
import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { BaseHRC721 } from './base-hr721'
import { getNetwork } from './networks'

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

  async balanceOf(address: string): Promise<string> {
    if (!address) {
      throw new Error('Balance query for the zero address')
    }

    try {
      const balance = await this.contract.methods.balanceOf(address).call()
      return balance
    } catch (error) {
      console.error('failed', error)
      throw error
    }
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
