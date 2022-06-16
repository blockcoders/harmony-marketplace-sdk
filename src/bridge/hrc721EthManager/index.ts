import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { CallOverrides } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { EthBaseContract } from '../../contracts'
import ABI from './abi'

export class HRC721EthManager extends EthBaseContract {
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
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('burnToken', [oneToken, tokenId, recipient], txOptions)
  }

  public async burnTokens(
    oneToken: string,
    tokenIds: BigNumberish[],
    recipient: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('burnTokens', [oneToken, tokenIds, recipient], txOptions)
  }

  public async mintToken(
    oneToken: string,
    tokenId: BigNumberish,
    recipient: string,
    receiptId: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('mintToken', [oneToken, tokenId, recipient, receiptId], txOptions)
  }

  public async mintTokens(
    oneToken: string,
    tokenIds: BigNumberish[],
    recipient: string,
    receiptId: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('mintTokens', [oneToken, tokenIds, recipient, receiptId], txOptions)
  }
  public async mappings(hrc721Addr: string): Promise<string> {
    return this.read<string>('mappings', [hrc721Addr])
  }
}
