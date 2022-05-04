import { Networkish } from '@ethersproject/networks'
import { Wallet } from '@harmony-js/account'
import { Arrayish } from '@harmony-js/crypto'
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { ChainID, ChainType } from '@harmony-js/utils'
import BN from 'bn.js'
import { BridgeToken } from './bridge-managers/bridge-token'
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

export enum BRIDGE {
  ETH_TO_HMY,
  HMY_TO_ETH,
}

export enum BRIDGE_TOKENS {
  ERC721,
  HRC721,
  ERC1155,
  HRC1155,
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

export interface BridgeParams {
  amount: number
  oneAddress: string
  ethAddress: string
  type: BRIDGE
  token: BRIDGE_TOKENS
  tokenId?: BNish
  tokenIds?: BNish[]
}

export interface ManagerContractAddresses {
  erc721EthManagerContract: string
  erc721HmyManagerContract: string
  hrc721EthManagerContract: string
  hrc721HmyManagerContract: string
  erc1155EthManagerContract: string
  erc1155HmyManagerContract: string
  hrc1155EthManagerContract: string
  hrc1155HmyManagerContract: string
  tokenManagerContract: string
  ethUrl: string
  ethNetwork: Networkish
  hmyUrl: string
  hmyNetwork: Networkish
}

export interface IBridgeToken721 {
  ethToHmy(bridge: BridgeToken, ethAddress: string, oneAddress: string, tokenId: BNish): Promise<void>
  hmyToEth(bridge: BridgeToken, ethAddress: string, oneAddress: string, tokenId: BNish): Promise<void>
}

export interface IBridgeToken1155 {
  ethToHmy(bridge: BridgeToken, ethAddress: string, oneAddress: string, tokenIds: BNish): Promise<void>
  hmyToEth(bridge: BridgeToken, ethAddress: string, oneAddress: string, tokenIds: BNish): Promise<void>
}
