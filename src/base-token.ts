import { BigNumber } from 'ethers'

export abstract class Base {
  abstract _getBalance(address: string, id?: string): Promise<BigNumber>
  abstract setApprovalForAll(addressOperator: string, approved: boolean): Promise<any>
  abstract isApprovedForAll(addressOwner: string, addressOperator: string): Promise<boolean>
}
