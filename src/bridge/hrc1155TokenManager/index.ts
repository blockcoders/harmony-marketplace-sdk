import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { CallOverrides } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { EthBaseContract } from '../../contracts'
import ABI from './abi'

export class HRC1155TokenManager extends EthBaseContract {
  constructor(address: string, signer: Signer) {
    super(address, ABI, signer)
  }

  public async rely(address: string, txOptions?: CallOverrides): Promise<TransactionReceipt> {
    return this.write('rely', [address], txOptions)
  }

  public async deny(address: string, txOptions?: CallOverrides): Promise<TransactionReceipt> {
    return this.write('deny', [address], txOptions)
  }

  public async addHRC1155Token(
    ethTokenAddr: string,
    name: string,
    symbol: string,
    tokenURI: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('addHRC1155Token', [ethTokenAddr, name, symbol, tokenURI], txOptions)
  }

  public async registerToken(
    ethTokenAddr: string,
    oneTokenAddr: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('registerToken', [ethTokenAddr, oneTokenAddr], txOptions)
  }

  public async removeHRC1155Token(
    ethTokenAddr: string,
    supply: BigNumberish,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('removeHRC1155Token', [ethTokenAddr, supply], txOptions)
  }
}
