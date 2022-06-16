import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import { BaseContract } from '../../contracts'
import { BNish, ContractProviderType, ITransactionOptions } from '../../interfaces'
import ABI from './abi'

export class HRC721HmyManager extends BaseContract {
  constructor(address: string, provider: ContractProviderType, options?: ContractOptions) {
    super(address, ABI, provider, options)
  }

  public async lockNFT721Token(
    ethTokenAddr: string,
    tokenId: BNish,
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('lockNFT721Token', [ethTokenAddr, tokenId, recipient], txOptions)
  }

  public async lockNFT1155Token(
    ethTokenAddr: string,
    tokenId: BNish,
    recipient: string,
    amount: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('lockNFT1155Token', [ethTokenAddr, tokenId, recipient, amount], txOptions)
  }

  public async lockTokens(
    ethTokenAddr: string,
    tokenIds: BNish[],
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('lockTokens', [ethTokenAddr, tokenIds, recipient], txOptions)
  }

  public async lockNFT1155Tokens(
    ethTokenAddr: string,
    tokenIds: BNish[],
    recipient: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('lockNFT1155Tokens', [ethTokenAddr, tokenIds, recipient], txOptions)
  }

  public async unlockToken(
    ethTokenAddr: string,
    tokenId: BNish,
    recipient: string,
    receiptId: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('unlockToken', [ethTokenAddr, tokenId, recipient, receiptId], txOptions)
  }

  public async unlockNFT1155Token(
    ethTokenAddr: string,
    tokenId: BNish,
    recipient: string,
    receiptId: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('unlockNFT1155Token', [ethTokenAddr, tokenId, recipient, receiptId], txOptions)
  }

  public async unlockTokens(
    ethTokenAddr: string,
    tokenIds: BNish[],
    recipient: string,
    receiptId: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('unlockTokens', [ethTokenAddr, tokenIds, recipient, receiptId], txOptions)
  }

  public async unlockNFT1155Tokens(
    ethTokenAddr: string,
    tokenIds: BNish[],
    recipient: string,
    receiptId: string,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('unlockNFT1155Tokens', [ethTokenAddr, tokenIds, recipient, receiptId], txOptions)
  }
}
