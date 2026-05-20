import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish, BigNumber } from '@ethersproject/bignumber'
import { CallOverrides } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { AddressZero } from '../../constants'
import { ContractError, EthBaseContract } from '../../contracts'
import ABI from './abi'

export class BridgedHRC721Token extends EthBaseContract {
  constructor(address: string, signer: Signer) {
    super(address, ABI, signer)
  }

  public async totalSupply(): Promise<BigNumber> {
    return this.read<BigNumber>('totalSupply')
  }

  public async balanceOf(address: string): Promise<BigNumber> {
    return this.read<BigNumber>('balanceOf', [address])
  }

  public async ownerOf(tokenId: BigNumberish): Promise<string> {
    try {
      BigNumber.from(tokenId)
    } catch (error) {
      throw new ContractError('You must provide a valid tokenId', 'ownerOf')
    }

    const address = await this.read<string>('ownerOf', [tokenId])
    return address.toLowerCase()
  }

  public async getApproved(tokenId: BigNumberish): Promise<string> {
    try {
      BigNumber.from(tokenId)
    } catch (error) {
      throw new ContractError('You must provide a valid tokenId', 'getApproved')
    }

    const address = await this.read<string>('getApproved', [tokenId])
    return address.toLowerCase()
  }

  public async approve(spender: string, tokenId: BigNumberish, txOptions?: CallOverrides): Promise<TransactionReceipt> {
    return this.write('approve', [spender, tokenId], txOptions)
  }

  public async setApprovalForAll(
    addressOperator: string,
    approved: boolean,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    if (!addressOperator || addressOperator === AddressZero) {
      throw new ContractError('Invalid operator provided', 'setApprovalForAll')
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

    return this.read<boolean>('isApprovedForAll', [owner, operator])
  }

  public async safeTransferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    if (to === AddressZero) {
      throw new ContractError(`The to cannot be the ${AddressZero}`, 'safeTransferFrom')
    }

    return this.write('safeTransferFrom(address,address,uint256)', [from, to, tokenId], txOptions)
  }

  public async transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('transferFrom', [from, to, tokenId], txOptions)
  }

  public async symbol(): Promise<string> {
    return this.read<string>('symbol')
  }

  public async name(): Promise<string> {
    return this.read<string>('name')
  }

  public async tokenURI(tokenId: BigNumberish): Promise<number> {
    return this.read<number>('tokenURI', [tokenId])
  }
}
