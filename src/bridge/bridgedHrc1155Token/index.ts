import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish, BigNumber } from '@ethersproject/bignumber'
import { CallOverrides } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { AddressZero } from '../../constants'
import { ContractError, EthBaseContract } from '../../contracts'
import ABI from './abi'

export class BridgedHRC1155Token extends EthBaseContract {
  constructor(address: string, signer: Signer) {
    super(address, ABI, signer)
  }

  public async balanceOf(address: string, id: BigNumberish): Promise<BigNumber> {
    return this.read<BigNumber>('balanceOf', [address, id])
  }

  public async balanceOfBatch(accounts: string[], ids: BigNumberish[]): Promise<BigNumber[]> {
    if (accounts.length !== ids.length) {
      throw new ContractError('Accounts and ids must have the same length', 'balanceOfBatch')
    }

    return this.read<BigNumber[]>('balanceOfBatch', [accounts, ids])
  }

  public async safeTransferFrom(
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: any,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    if (to === AddressZero) {
      throw new ContractError(`The to cannot be the ${AddressZero}`, 'safeTransferFrom')
    }

    return this.write('safeTransferFrom', [from, to, id, amount, data], txOptions)
  }

  public async safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: any,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    if (amounts.length !== ids.length) {
      throw new ContractError('amounts and ids must have the same length', 'safeBatchTransferFrom')
    }

    return this.write('safeBatchTransferFrom', [from, to, ids, amounts, data], txOptions)
  }

  public async setApprovalForAll(
    addressOperator: string,
    approved: boolean,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    if (!addressOperator) {
      throw new Error('You must provide an addressOperator')
    }
    return this.write('setApprovalForAll', [addressOperator, approved], txOptions)
  }

  public async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    if (!owner || owner === AddressZero) {
      throw new ContractError('Invalid owner provided', 'isApprovedForAll')
    }

    if (!operator || operator === AddressZero) {
      throw new ContractError('Invalid operator provided', 'isApprovedForAll')
    }

    return this.read('isApprovedForAll', [owner, operator])
  }

  public async owner(): Promise<string> {
    const address = await this.read<string>('owner', [])
    return address.toLowerCase()
  }

  public async tokenURIPrefix(): Promise<string> {
    return this.read<string>('tokenURIPrefix', [])
  }

  public async contractURI(): Promise<string> {
    return this.read<string>('contractURI', [])
  }

  public async totalSupply(id: BigNumberish): Promise<BigNumber> {
    return this.read<BigNumber>('totalSupply', [id])
  }
}
