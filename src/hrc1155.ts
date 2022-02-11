import { BigNumberish } from '@ethersproject/bignumber/lib/bignumber'
import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { BaseToken } from './base-token'

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
    return [0]
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
    return
  }
}
