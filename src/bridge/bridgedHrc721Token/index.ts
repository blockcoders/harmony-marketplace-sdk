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

  public async approve(spender: string, tokenId: BigNumberish, txOptions?: CallOverrides): Promise<TransactionReceipt> {
    return this.write('approve', [spender, tokenId], txOptions)
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

  public async baseURI(): Promise<string> {
    return this.read<string>('baseURI')
  }

  public async tokenURI(tokenId: BigNumberish): Promise<number> {
    return this.read<number>('tokenURI', [tokenId])
  }

  public async tokenByIndex(index: BigNumberish): Promise<BigNumber> {
    try {
      BigNumber.from(index)
    } catch (error) {
      throw new ContractError('You must provide a valid index', 'tokenByIndex')
    }

    return this.read<BigNumber>('tokenByIndex', [index])
  }

  public async tokenOfOwnerByIndex(owner: string, index: BigNumberish): Promise<BigNumber> {
    if (!owner || owner === AddressZero) {
      throw new ContractError('Invalid owner provided', 'tokenOfOwnerByIndex')
    }

    try {
      BigNumber.from(index)
    } catch (error) {
      throw new ContractError('You must provide a valid index', 'tokenOfOwnerByIndex')
    }

    return this.read<BigNumber>('tokenOfOwnerByIndex', [owner, index])
  }

  public async supportsInterface(interfaceId: string): Promise<boolean> {
    if (!interfaceId) {
      throw new ContractError('You must provide an interfaceId', 'supportsInterface')
    }

    return this.read<boolean>('supportsInterface', [interfaceId])
  }

  public async setTokenURI(
    tokenId: BigNumberish,
    tokenURI: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    try {
      BigNumber.from(tokenId)
    } catch (error) {
      throw new ContractError('You must provide a valid tokenId', 'setTokenURI')
    }

    return this.write('setTokenURI', [tokenId, tokenURI], txOptions)
  }
}
