import { TransactionReceipt } from '@ethersproject/providers'
import { Wallet } from '@harmony-js/account'
import { Arrayish } from '@harmony-js/crypto'
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { Transaction } from '@harmony-js/transaction'
import { ChainID, ChainType } from '@harmony-js/utils'
import BN from 'bn.js'
import { BridgedHRC1155Token, BridgedHRC20Token, BridgedHRC721Token } from './bridge'
import { HRC1155EthManager } from './bridge/hrc1155EthManager'
import { HRC1155HmyManager } from './bridge/hrc1155HmyManager'
import { HRC1155TokenManager } from './bridge/hrc1155TokenManager'
import { HRC20EthManager } from './bridge/hrc20EthManager'
import { HRC20HmyManager } from './bridge/hrc20HmyManager'
import { HRC20TokenManager } from './bridge/hrc20TokenManager'
import { HRC721EthManager } from './bridge/hrc721EthManager'
import { HRC721HmyManager } from './bridge/hrc721HmyManager'
import { HRC721TokenManager } from './bridge/hrc721TokenManager'
import { TokenType } from './constants'
import { HRC1155, HRC20, HRC721 } from './contracts'
import { Key, MnemonicKey, PrivateKey } from './wallets'

export type BNish = BN | Arrayish | bigint | number

export interface ITransactionOptions {
  gasLimit?: BN | number | string
  gasPrice: BN | number | string
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
  SHARD_0_DEVNET = 'SHARD_0_DEVNET',
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

export interface HRC20Info {
  amount: number
}

export interface HRC721Info {
  tokenId: number
}

export interface HRC1155Info {
  tokenIds: number[]
  amounts: number[]
}

export interface TokenInfo {
  tokenAddress: string
  type: TokenType
  info: HRC20Info | HRC721Info | HRC1155Info
}

export interface ContractAddresses {
  ethManagerAddress: string
  hmyManagerAddress: string
  tokenManagerAddress: string
}

export interface BridgeManagers {
  ethManager: HRC20EthManager | HRC721EthManager | HRC1155EthManager
  ownerSignedEthManager: HRC20EthManager | HRC721EthManager | HRC1155EthManager
  hmyManager: HRC20HmyManager | HRC721HmyManager | HRC1155HmyManager
  ownerSignedHmyManager: HRC20HmyManager | HRC721HmyManager | HRC1155HmyManager
  tokenManager: HRC20TokenManager | HRC721TokenManager | HRC1155TokenManager
  ownerSignedToken: HRC20 | HRC721 | HRC1155
  token: HRC20 | HRC721 | HRC1155
  bridgedToken: BridgedHRC20Token | BridgedHRC721Token | BridgedHRC1155Token
}

export interface IBridgeToken {
  ethToHmy(
    sender: string,
    recipient: string,
    token: HRC20 | HRC721 | HRC1155,
    tokenInfo: HRC20Info | HRC721Info | HRC1155Info,
    txOptions: ITransactionOptions,
  ): Promise<Transaction>
  hmyToEth(
    sender: string,
    recipient: string,
    token: HRC20 | HRC721 | HRC1155,
    tokenInfo: HRC20Info | HRC721Info | HRC1155Info,
    txOptions: ITransactionOptions,
  ): Promise<TransactionReceipt>
}
