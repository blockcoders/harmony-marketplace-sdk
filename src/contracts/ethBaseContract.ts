import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import { CallOverrides, Contract, ContractInterface } from '@ethersproject/contracts'
import { Provider, TransactionReceipt } from '@ethersproject/providers'
import { parseUnits, formatUnits } from '@ethersproject/units'

export class EthBaseContract {
  public readonly _contract: Contract

  constructor(address: string, abi: ContractInterface, signerOrProvider: Signer | Provider) {
    this._contract = new Contract(address, abi, signerOrProvider)
  }

  public get address(): string {
    return this._contract.address
  }

  private async getGasLimit(methodName: string, args: any[]): Promise<BigNumber> {
    let gasEstimate: BigNumber

    try {
      gasEstimate = await this._contract.estimateGas[methodName](...args)
    } catch (gasError) {
      try {
        const errorResult = await this._contract.callStatic[methodName](...args)

        console.debug('Unexpected successful call after failed estimate gas', gasError, errorResult)
      } catch (callStaticError) {
        console.error(callStaticError)
      }

      throw new Error('Unexpected issue with estimating the gas. Please try again.')
    }

    return gasEstimate.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
  }

  protected async getCallOptions(methodName: string, args: any[]): Promise<CallOverrides> {
    const gasLimit = this.getGasLimit(methodName, args)
    const fees = await this._contract.provider.getFeeData()
    return {
      gasLimit,
      maxFeePerGas: parseUnits(formatUnits(fees.maxFeePerGas ?? 0, 'gwei'), 'gwei'),
      maxPriorityFeePerGas: parseUnits(formatUnits(fees.maxPriorityFeePerGas ?? 0, 'gwei'), 'gwei'),
    }
  }

  public async read<T>(methodName: string, args: any[] = []): Promise<T> {
    return this._contract.methods[methodName](...args)
  }

  public async write(methodName: string, args: any[] = [], txOptions?: CallOverrides): Promise<TransactionReceipt> {
    let options = txOptions

    if (!options) {
      options = await this.getCallOptions(methodName, args)
    }

    const tx = await this._contract[methodName](...args, txOptions)

    return tx.wait()
  }
}
