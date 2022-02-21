import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Logger } from '@ethersproject/logger'
import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { BaseToken } from './base-token'
import { logger } from './logger'

export class HRC1155 extends BaseToken {
  private contract: Contract
  constructor(address: string, abi: any, private harmonyClient: Harmony) {
    super(address, abi, harmonyClient)
    this.contract = this.harmonyClient.contracts.createContract(abi, address)
  }

  async balanceOf(address: string, id: BigNumberish): Promise<number> {
    return await this._getBalance(address, id)
  }

  async balanceOfBatch(accounts: string[], ids: BigNumberish[]): Promise<number[]> {
    if (accounts.length !== ids.length) {
      throw new Error('Accounts and ids must have the same length')
    }

    try {
      const balances = await this.contract.methods.balanceOfBatch(accounts, ids).call()
      return balances.map((amount: BigNumber) => amount.toNumber())
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'balanceOfBatch',
        params: { accounts, ids },
        error,
      })
    }
  }

  async safeTransferFrom(
    fromAddress: string,
    toAddress: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: any,
  ): Promise<any> {
    return
  }

  async safeBatchTransferFrom(
    fromAddress: string,
    toAddress: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: any,
  ): Promise<any> {
    if (amounts.length !== ids.length) {
      throw new Error('Amounts and ids must have the same length')
    }
    try {
      const safe = this.contract.methods.safeBatchTransferFrom(fromAddress, toAddress, ids, amounts, data).send()
      return safe
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'safeBatchTransferFrom',
        params: { fromAddress, toAddress, ids, amounts, data },
        error,
      })
    }
  }
}
