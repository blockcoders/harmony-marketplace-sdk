import { Signer } from '@ethersproject/abstract-signer'
import { ContractFactory } from '@ethersproject/contracts'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { Transaction } from '@harmony-js/transaction'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { BaseContract, EthBaseContract } from '../contracts'
import { ContractProviderType } from '../interfaces'
import { E2E_TX_OPTIONS } from './constants'

export interface ContractMetadata {
  abi: any[]
  bytecode: string
}

class DeployedContract extends BaseContract {}

class DeployContract extends BaseContract {
  constructor(abi: any[], wallet: ContractProviderType) {
    super('0x', abi, wallet)
  }

  public deploy(bytecode: string, args: any[] = []): Promise<Transaction> {
    return this.send('contractConstructor', [{ data: bytecode, arguments: args }], E2E_TX_OPTIONS)
  }
}

class DeployedEthContract extends EthBaseContract {}

export enum ContractName {
  BlockcodersHRC20 = 'BlockcodersHRC20',
  BlockcodersHRC721 = 'BlockcodersHRC721',
  BlockcodersHRC1155 = 'BlockcodersHRC1155',
  BridgedHRC20Token = 'BridgedHRC20Token',
  BridgedHRC721Token = 'BridgedHRC721Token',
  BridgedHRC1155Token = 'BridgedHRC1155Token',
  HRC20EthManager = 'HRC20EthManager',
  HRC20HmyManager = 'HRC20HmyManager',
  HRC20TokenManager = 'HRC20TokenManager',
  HRC721EthManager = 'HRC721EthManager',
  HRC721HmyManager = 'HRC721HmyManager',
  HRC721TokenManager = 'HRC721TokenManager',
  HRC1155EthManager = 'HRC1155EthManager',
  HRC1155HmyManager = 'HRC1155HmyManager',
  HRC1155TokenManager = 'HRC1155TokenManager',
}

export async function getContractMetadata(contractName: ContractName): Promise<ContractMetadata> {
  const data = await readFile(
    `${join(__dirname, `./artifacts/src/tests/contracts/${contractName}.sol`)}/${contractName}.json`,
    { encoding: 'utf8' },
  )
  const metadata = JSON.parse(data)

  return { abi: metadata.abi, bytecode: metadata.bytecode }
}

export async function deployContract<T>(
  contractName: ContractName,
  wallet: ContractProviderType,
  args: any[] = [],
): Promise<T> {
  const { abi, bytecode } = await getContractMetadata(contractName)
  const contract = new DeployContract(abi, wallet)

  const tx = await contract.deploy(bytecode, args)
  const contractAddr = tx?.receipt?.contractAddress?.toLowerCase() ?? ''
  const deployed = new DeployedContract(contractAddr, abi, wallet)

  console.info(`${contractName} deployed on address: ${contractAddr}`)

  return deployed as any
}

export async function deployEthContract<T>(contractName: ContractName, wallet: Signer, args: any[] = []): Promise<T> {
  const { abi, bytecode } = await getContractMetadata(contractName)
  const factory = new ContractFactory(abi, bytecode, wallet)
  const fees = await wallet.getFeeData()
  const options = {
    maxFeePerGas: parseUnits(formatUnits(fees.maxFeePerGas ?? 0, 'gwei'), 'gwei'),
    maxPriorityFeePerGas: parseUnits(formatUnits(fees.maxPriorityFeePerGas ?? 0, 'gwei'), 'gwei'),
  }
  const caller = await factory.deploy(...args, options)
  const contract = await caller.deployed()
  const deployed = new DeployedEthContract(contract.address, abi, wallet)

  console.info(`${contractName} deployed on address: ${deployed.address}`)

  return deployed as any
}
