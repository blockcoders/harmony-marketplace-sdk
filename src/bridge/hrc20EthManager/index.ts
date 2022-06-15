import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish } from '@ethersproject/bignumber'
import { CallOverrides } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { EthBaseContract } from '../../contracts'
import ABI from './abi'

export class HRC20EthManager extends EthBaseContract {
  constructor(address: string, signer: Signer) {
    super(address, ABI, signer)
  }

  public async addToken(
    tokenManager: string,
    hmyTokenAddr: string,
    name: string,
    symbol: string,
    decimals: BigNumberish,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('addToken', [tokenManager, hmyTokenAddr, name, symbol, decimals], txOptions)
  }

  public async removeToken(
    tokenManager: string,
    hmyTokenAddr: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('removeToken', [tokenManager, hmyTokenAddr], txOptions)
  }

  public async burnToken(
    ethToken: string,
    amount: BigNumberish,
    recipient: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('burnToken', [ethToken, amount, recipient], txOptions)
  }

  public async mintToken(
    ethToken: string,
    amount: BigNumberish,
    recipient: string,
    receiptId: string,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('mintToken', [ethToken, amount, recipient, receiptId], txOptions)
  }
}
