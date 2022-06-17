import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { CallOverrides } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { EthBaseContract } from '../../contracts'
import ABI from './abi'

export class HRC1155EthManager extends EthBaseContract {
  constructor(address: string, signer: Signer) {
    super(address, ABI, signer)
  }

  public async addToken(
    tokenManager: string,
    ethTokenAddr: string,
    name: string,
    symbol: string,
    tokenURI: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('addToken', [tokenManager, ethTokenAddr, name, symbol, tokenURI], txOptions)
  }

  public async removeToken(
    tokenManager: string,
    ethTokenAddr: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('removeToken', [tokenManager, ethTokenAddr], txOptions)
  }

  public async burnToken(
    oneToken: string,
    tokenId: BigNumberish,
    recipient: string,
    amount: BigNumberish,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('burnToken', [oneToken, tokenId, recipient, amount], txOptions)
  }

  public async burnTokens(
    oneToken: string,
    tokenIds: BigNumberish[],
    recipient: string,
    amounts: BigNumberish[],
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('burnTokens', [oneToken, tokenIds, recipient, amounts], txOptions)
  }

  public async mintToken(
    oneToken: string,
    tokenId: BigNumberish,
    recipient: string,
    receiptId: string,
    amount: BigNumberish,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('mintToken', [oneToken, tokenId, recipient, receiptId, amount], txOptions)
  }

  public async mintTokens(
    oneToken: string,
    tokenIds: BigNumberish[],
    recipient: string,
    receiptId: string,
    amounts: BigNumberish[],
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('mintTokens', [oneToken, tokenIds, recipient, receiptId, amounts], txOptions)
  }
}
