import { Wallet } from '@harmony-js/account'
import { Arrayish } from '@harmony-js/crypto'
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { ChainID, ChainType } from '@harmony-js/utils'
import BN from 'bn.js'
import { Key } from './key'
import { MnemonicKey } from './mnemonic-key'
import { PrivateKey } from './private-key'

export type BNish = BN | Arrayish | bigint | number

export interface ITransactionOptions {
  gasLimit?: number | string
  gasPrice: number | string
}

export interface HarmonyRpcConfig {
  url: string
  chainId: ChainID
  chainType: ChainType
}

export enum HarmonyShards {
  SHARD_0 = 'SHARD_0',
  SHARD_1 = 'SHARD_1',
  SHARD_2 = 'SHARD_2',
  SHARD_3 = 'SHARD_3',
  SHARD_0_TESTNET = 'SHARD_0_TESTNET',
  SHARD_1_TESTNET = 'SHARD_1_TESTNET',
  SHARD_2_TESTNET = 'SHARD_2_TESTNET',
  SHARD_3_TESTNET = 'SHARD_3_TESTNET',
}

export type RpcProviderType = string | HttpProvider | WSProvider | HarmonyShards

export type ContractProviderType = Wallet | Key | PrivateKey | MnemonicKey
