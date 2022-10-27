import { Wallet } from '@harmony-js/account'
import { Arrayish } from '@harmony-js/crypto'
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { ChainID, ChainType } from '@harmony-js/utils'
import BN from 'bn.js'
import { MetamaskProvider } from './providers'
import { Key, MnemonicKey, PrivateKey } from './wallets'

export type BNish = BN | Arrayish | bigint | number

/**
 * Supported parameter by smart contracts
 * @see {@link https://github.com/harmony-one/sdk/blob/master/packages/harmony-contract/src/methods/method.ts#L169}
 */
export interface ITransactionOptions {
  gasLimit?: BN | number | string
  gasPrice: BN | number | string
  from?: string
  to?: string
  value?: string
  data?: string
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

export type RpcProviderType = string | HttpProvider | WSProvider | MetamaskProvider | HarmonyShards

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
  ws?: string
  waitingFor?: number
}

export interface HRC20Info extends TokenInfo {
  amount: number | string
}

export interface HRC721Info extends TokenInfo {
  tokenId: number | string
}

export interface HRC1155Info extends TokenInfo {
  tokenIds: number[]
  amounts: number[]
}

export interface ContractAddresses {
  ethManagerAddress: string
  hmyManagerAddress: string
  tokenManagerAddress: string
}

export interface BridgeResponse {
  addr: string
  receiptId: string
}

export interface ChainId {
  [key: number]: string
}

interface ProviderRequestArguments {
  readonly method: string
  readonly params?: readonly unknown[] | object
}

export interface MetaMaskEthereumProvider {
  isMetaMask?: boolean
  once(eventName: string | symbol, listener: (...args: any[]) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this
  off(eventName: string | symbol, listener: (...args: any[]) => void): this
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this
  removeAllListeners(event?: string | symbol): this
  request(args: ProviderRequestArguments): Promise<any>
}
