import { Signer } from '@ethersproject/abstract-signer'
import { ContractFactory } from '@ethersproject/contracts'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { Messenger, WSProvider, NewHeaders } from '@harmony-js/network'
import { Transaction } from '@harmony-js/transaction'
import { ChainType, hexToNumber } from '@harmony-js/utils'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { HARMONY_RPC_DEVNET_WS } from '../constants'
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
  const data = await readFile(
    `${join(__dirname, `./artifacts/src/tests/contracts/${contractName}.sol`)}/${contractName}.json`,
    { encoding: 'utf8' },
  )
  const metadata = JSON.parse(data)

  return { abi: metadata.abi, bytecode: metadata.bytecode }
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

export function waitForNewBlock(expectedBlockNumber: number): Promise<void> {
  const wsMessenger = new Messenger(new WSProvider(HARMONY_RPC_DEVNET_WS), ChainType.Harmony, 4)
  const newBlockSubscription = new NewHeaders(wsMessenger)

  return new Promise((res) => {
    newBlockSubscription.on('data', (data: any) => {
      const blockNumber = parseInt(hexToNumber(data.params.result.number), 10)

      if (blockNumber <= expectedBlockNumber) {
        console.log(`Currently at block ${blockNumber}, waiting for block ${expectedBlockNumber} to be confirmed`)
      } else {
        res()
      }
    })
  })
}
