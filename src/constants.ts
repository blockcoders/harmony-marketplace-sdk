import { ChainID, ChainType } from '@harmony-js/utils'
import { HarmonyRpcConfig, HarmonyShards } from './interfaces'

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const DEFAULT_GAS_PRICE = '1' // 1 Gwei
export const DEFAULT_GAS_LIMIT = '21000'
export const HARMONY_RPC_SHARD_0: HarmonyRpcConfig = {
  url: 'https://api.harmony.one',
  chainId: ChainID.HmyMainnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_1: HarmonyRpcConfig = {
  url: 'https://s1.api.harmony.one',
  chainId: ChainID.HmyMainnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_2: HarmonyRpcConfig = {
  url: 'https://s2.api.harmony.one',
  chainId: ChainID.HmyMainnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_3: HarmonyRpcConfig = {
  url: 'https://s3.api.harmony.one',
  chainId: ChainID.HmyMainnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_0_TESTNET: HarmonyRpcConfig = {
  url: 'https://api.s0.b.hmny.io',
  chainId: ChainID.HmyTestnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_1_TESTNET: HarmonyRpcConfig = {
  url: 'https://api.s1.b.hmny.io',
  chainId: ChainID.HmyTestnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_2_TESTNET: HarmonyRpcConfig = {
  url: 'https://api.s2.b.hmny.io',
  chainId: ChainID.HmyTestnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_3_TESTNET: HarmonyRpcConfig = {
  url: 'https://api.s3.b.hmny.io',
  chainId: ChainID.HmyTestnet,
  chainType: ChainType.Harmony,
}

export const HARMONY_SHARDS = {
  [HarmonyShards.SHARD_0]: HARMONY_RPC_SHARD_0,
  [HarmonyShards.SHARD_1]: HARMONY_RPC_SHARD_1,
  [HarmonyShards.SHARD_2]: HARMONY_RPC_SHARD_2,
  [HarmonyShards.SHARD_3]: HARMONY_RPC_SHARD_3,
  [HarmonyShards.SHARD_0_TESTNET]: HARMONY_RPC_SHARD_0_TESTNET,
  [HarmonyShards.SHARD_1_TESTNET]: HARMONY_RPC_SHARD_1_TESTNET,
  [HarmonyShards.SHARD_2_TESTNET]: HARMONY_RPC_SHARD_2_TESTNET,
  [HarmonyShards.SHARD_3_TESTNET]: HARMONY_RPC_SHARD_3_TESTNET,
}
