import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish, BigNumber } from '@ethersproject/bignumber'
import { CallOverrides } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { EthBaseContract } from '../../contracts'
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

  public async tokenURI(tokenId: BigNumberish): Promise<number> {
    return this.read<number>('tokenURI', [tokenId])
  }
}
