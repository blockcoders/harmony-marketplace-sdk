import { Wallet } from '@harmony-js/account'
import { Arrayish } from '@harmony-js/crypto'
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { ChainID, ChainType } from '@harmony-js/utils'
import BN from 'bn.js'
import { NETWORK_TYPE, EXCHANGE_MODE, TOKEN } from 'bridge-sdk'
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

export interface MnemonicOptions {
  /**
   * Space-separated list of words for the mnemonic key.
   */
  mnemonic?: string

  /**
   * BIP44 index number
   */
  index?: number
}

export interface HDOptions extends MnemonicOptions {
  /**
   * Number of addresses
   */
  numberOfAddresses?: number
  shardId?: number
  gasLimit?: string
  gasPrice?: string
}

export interface TokenInfo {
  tokenAddress: string
  tokenId?: string
}
export interface BridgeParams {
  oneAddress: string
  ethAddress: string
  network: NETWORK_TYPE
  type: EXCHANGE_MODE
  token: TOKEN
  amount: number
  isMainnet?: boolean
  tokenInfo?: TokenInfo
  maxWaitingTime?: number
}

export interface BridgeTokenInfo {
  erc20Address?: string
  hrc20Address?: string
  erc1155Address?: string
  erc1155TokenId?: any
  hrc721Address?: string
  hrc1155Address?: string
  hrc1155TokenId?: any
}
