import { Harmony } from '@harmony-js/core'
import { BigNumber, logger } from 'ethers'
import { Logger } from 'ethers/lib/utils'
import { BaseToken } from './base-implementation'

export class HRC1155 extends BaseToken {
  constructor(address: string, abi: any, client: Harmony) {
    super(address, abi, client)
  }

  async balanceOf(address: string, id: string): Promise<number> {
    if (!address) {
      throw new Error('You have provide an address')
    }

    try {
      const balance: BigNumber = await this._getBalance(address, id)
      return balance.toNumber()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'balanceOf',
        params: address,
        error,
      })
    }
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
