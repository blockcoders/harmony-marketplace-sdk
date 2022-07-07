import { Signer } from '@ethersproject/abstract-signer'
import { BigNumberish, BigNumber } from '@ethersproject/bignumber'
import { CallOverrides } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { EthBaseContract } from '../../contracts'
import ABI from './abi'

export class BridgedHRC20Token extends EthBaseContract {
  constructor(address: string, signer: Signer) {
    super(address, ABI, signer)
  }

  public async totalSupply(): Promise<BigNumber> {
    return this.read<BigNumber>('totalSupply')
  }

  public async balanceOf(address: string): Promise<BigNumber> {
    return this.read<BigNumber>('balanceOf', [address])
  }

  public async transfer(to: string, amount: BigNumberish, txOptions?: CallOverrides): Promise<TransactionReceipt> {
    return this.write('transfer', [to, amount], txOptions)
  }

  public async allowance(owner: string, spender: string): Promise<BigNumber> {
    return this.read<BigNumber>('allowance', [owner, spender])
  }

  public async approve(spender: string, amount: BigNumberish, txOptions?: CallOverrides): Promise<TransactionReceipt> {
    return this.write('approve', [spender, amount], txOptions)
  }

  public async transferFrom(
    from: string,
    to: string,
    amount: BigNumberish,
    txOptions?: CallOverrides,
  ): Promise<TransactionReceipt> {
    return this.write('transferFrom', [from, to, amount], txOptions)
  }

  public async symbol(): Promise<string> {
    return this.read<string>('symbol')
  }

  public async name(): Promise<string> {
    return this.read<string>('name')
  }

  public async decimals(): Promise<number> {
    return this.read<number>('decimals')
  }
}
