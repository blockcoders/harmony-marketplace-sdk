import { Harmony } from '@harmony-js/core'
import { BaseToken } from './base-token'

export class HRC1155 extends BaseToken {
  constructor(address: string, abi: any, client: Harmony) {
    super(address, abi, client)
  }

  async balanceOf(address: string, id: string): Promise<number> {
    return await this._getBalance(address, id)
  }

  async balanceOfBatch(accounts: string[], ids: string[]): Promise<number[]> {
    return [0]
  }

  async safeTransferFrom(fromAddress: string, toAddress: string, id: string, amount: number, data: any): Promise<any> {
    return
  }

  async safeBatchTransferFrom(
    fromAddress: string,
    toAddress: string,
    ids: string[],
    amounts: number[],
    data: any,
  ): Promise<any> {
    return
  }
}
