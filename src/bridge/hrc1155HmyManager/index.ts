import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import { BaseContract } from '../../contracts'
import { BNish, ContractProviderType, ITransactionOptions } from '../../interfaces'
import ABI from './abi'

export class HRC1155HmyManager extends BaseContract {
  constructor(address: string, provider: ContractProviderType, options?: ContractOptions) {
    super(address, ABI, provider, options)
  }

  public async lockHRC1155Token(
    ethTokenAddr: string,
    tokenId: BNish,
    recipient: string,
    amount: BNish,
    data: string[],
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('lockHRC1155Token', [ethTokenAddr, tokenId, recipient, amount, data], txOptions)
  }

  public async lockHRC1155Tokens(
    ethTokenAddr: string,
    tokenIds: BNish[],
    recipient: string,
    amounts: BNish[],
    data: string[],
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('lockHRC1155Tokens', [ethTokenAddr, tokenIds, recipient, amounts, data], txOptions)
  }

  public async unlockHRC1155Token(
    ethTokenAddr: string,
    tokenId: BNish,
    amount: BNish,
    recipient: string,
    receiptId: string,
    data: string[],
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('unlockHRC1155Token', [ethTokenAddr, tokenId, recipient, receiptId, amount, data], txOptions)
  }

  public async unlockHRC1155Tokens(
    ethTokenAddr: string,
    tokenIds: BNish[],
    amounts: BNish[],
    recipient: string,
    receiptId: string,
    data: string[],
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('unlockHRC1155Tokens', [ethTokenAddr, tokenIds, recipient, receiptId, amounts, data], txOptions)
  }
}
