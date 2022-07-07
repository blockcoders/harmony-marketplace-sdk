import { Signer } from '@ethersproject/abstract-signer'
import { ContractFactory } from '@ethersproject/contracts'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { Transaction } from '@harmony-js/transaction'
import { readFile } from 'fs'
import { join } from 'path'
import { BaseContract } from '../contracts'
import { ContractProviderType } from '../interfaces'
import { ContractName, E2E_TX_OPTIONS } from './constants'

export interface ContractMetadata {
  abi: any[]
  bytecode: string
}

class DeployContract extends BaseContract {
  constructor(abi: any[], wallet: ContractProviderType) {
    super('0x', abi, wallet)
  }

  public deploy(bytecode: string, args: any[] = []): Promise<Transaction> {
    return this.send('contractConstructor', [{ data: bytecode, arguments: args }], E2E_TX_OPTIONS)
  }
}

export async function getContractMetadata(contractName: ContractName): Promise<ContractMetadata> {
  return new Promise((res, rej) => {
    readFile(
      `${join(__dirname, `./artifacts/src/tests/contracts/${contractName}.sol`)}/${contractName}.json`,
      'utf8',
      (err, data) => {
        if (err) rej(err)

        const metadata = JSON.parse(data)

        res({ abi: metadata.abi, bytecode: metadata.bytecode })
      },
    )
  })
}

export async function deployContract(
  contractName: ContractName,
  wallet: ContractProviderType,
  args: any[] = [],
): Promise<{ addr: string; abi: any[] }> {
  const { abi, bytecode } = await getContractMetadata(contractName)
  const contract = new DeployContract(abi, wallet)

  const tx = await contract.deploy(bytecode, args)
  const addr = tx?.receipt?.contractAddress?.toLowerCase() ?? ''

  console.info(`${contractName} deployed on address: ${addr}`)

  return { addr, abi }
}

export async function deployEthContract(
  contractName: ContractName,
  wallet: Signer,
  args: any[] = [],
): Promise<{ addr: string; abi: any[] }> {
  const { abi, bytecode } = await getContractMetadata(contractName)
  const factory = new ContractFactory(abi, bytecode, wallet)
  const fees = await wallet.getFeeData()
  const options = {
    maxFeePerGas: parseUnits(formatUnits(fees.maxFeePerGas ?? 0, 'gwei'), 'gwei'),
    maxPriorityFeePerGas: parseUnits(formatUnits(fees.maxPriorityFeePerGas ?? 0, 'gwei'), 'gwei'),
  }
  const caller = await factory.deploy(...args, options)
  const contract = await caller.deployed()

  console.info(`${contractName} deployed on address: ${contract.address}`)

  return { addr: contract.address, abi }
}
