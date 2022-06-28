import { ChainID, ChainType, Unit } from '@harmony-js/utils'
import { ContractAddresses, HarmonyRpcConfig, HarmonyShards, ITransactionOptions } from './interfaces'

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const DEFAULT_GAS_PRICE = '1000000000'
export const DEFAULT_GAS_LIMIT = '3500000'
export const HARMONY_RPC_SHARD_0_URL = 'https://api.harmony.one'
export const HARMONY_RPC_SHARD_1_URL = 'https://s1.api.harmony.one'
export const HARMONY_RPC_SHARD_2_URL = 'https://s2.api.harmony.one'
export const HARMONY_RPC_SHARD_3_URL = 'https://s3.api.harmony.one'
export const HARMONY_RPC_SHARD_0_DEVNET_URL = 'https://api.s0.ps.hmny.io'
export const HARMONY_RPC_WS = 'wss://ws.s0.t.hmny.io'
export const HARMONY_RPC_DEVNET_WS = 'wss://ws.s0.ps.hmny.io'
export const HARMONY_RPC_SHARD_0: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_0_URL,
  chainId: ChainID.HmyMainnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_1: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_1_URL,
  chainId: ChainID.HmyMainnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_2: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_2_URL,
  chainId: ChainID.HmyMainnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_3: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_3_URL,
  chainId: ChainID.HmyMainnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_0_DEVNET: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_0_DEVNET_URL,
  chainId: 4,
  chainType: ChainType.Harmony,
}

export const HARMONY_SHARDS = {
  [HarmonyShards.SHARD_0]: HARMONY_RPC_SHARD_0,
  [HarmonyShards.SHARD_1]: HARMONY_RPC_SHARD_1,
  [HarmonyShards.SHARD_2]: HARMONY_RPC_SHARD_2,
  [HarmonyShards.SHARD_3]: HARMONY_RPC_SHARD_3,
  [HarmonyShards.SHARD_0_DEVNET]: HARMONY_RPC_SHARD_0_DEVNET,
}

export enum NetworkInfo {
  MAINNET,
  DEVNET,
}

export enum TokenType {
  HRC20,
  HRC721,
  HRC1155,
}

export enum BridgeType {
  HMY_TO_ETH,
  ETH_TO_HMY,
}

// Harmony owner of the manager contracts
export const MAINNET_MULTISIG_WALLET = '0x715CdDa5e9Ad30A0cEd14940F9997EE611496De6'

export const MAINNET_HRC20_CONTRACTS_ADDRESSES: ContractAddresses = {
  ethManagerAddress: '0x2912885736Ce25E437c0113200254140a709a58d',
  hmyManagerAddress: '0xe0c1267f1c63e83472d2b3e25d970740940d752b',
  tokenManagerAddress: '0x92591545c6462ad0751c890D15DF5F47846fF4Bf',
}

export const MAINNET_HRC721_CONTRACTS_ADDRESSES: ContractAddresses = {
  ethManagerAddress: '0x426A61A2127fDD1318Ec0EdCe02474f382FdAd30',
  hmyManagerAddress: '0xbaf4d51738a42b976c3558b5f983cf4721451499',
  tokenManagerAddress: '0xF837fe0Eba85bE14446E546115ef20891E357D2B',
}

export const MAINNET_HRC1155_CONTRACTS_ADDRESSES: ContractAddresses = {
  ethManagerAddress: '0x478279c5A0beb8401De1b4EaCB4863a243a8e3A3',
  hmyManagerAddress: '0x4f9b3defb4f61227a7574f2a7adfe2841e1ae20e',
  tokenManagerAddress: '0x94da065b27f4a61d6595c2ebb541bb7bd11b6266',
}

export const DEVNET_MULTISIG_WALLET = '0xC12208C19f895df6BD589fD4F574CCf53992B9F5'

export const DEVNET_HRC20_CONTRACTS_ADDRESSES: ContractAddresses = {
  ethManagerAddress: '0x2912885736Ce25E437c0113200254140a709a58d',
  hmyManagerAddress: '0xe0c1267f1c63e83472d2b3e25d970740940d752b',
  tokenManagerAddress: '0x92591545c6462ad0751c890D15DF5F47846fF4Bf',
}

export const DEVNET_HRC721_CONTRACTS_ADDRESSES: ContractAddresses = {
  ethManagerAddress: '0xCb4C1fdB075Ab6De7c28670cab7C33C5318e7a3e',
  hmyManagerAddress: '0xe7e9b2b777f1d76a3065932b4f10dd919385827a',
  tokenManagerAddress: '0x591Ba8eC8F739DE393b19A6b074C100107901CB0',
}

export const DEVNET_HRC1155_CONTRACTS_ADDRESSES: ContractAddresses = {
  ethManagerAddress: '0xec78b27F983eD13d2a134E7d0078D8Bf61Df8966',
  hmyManagerAddress: '0xb857764aacfa4113335bd560da0a08d8aff13a5c',
  tokenManagerAddress: '0xEAfBeeD7aA4609F44A4BEd4A33B59D042d735e3a',
}

export const DEFAULT_TX_OPTIONS: ITransactionOptions = {
  gasPrice: new Unit('30').asGwei().toWei(),
  gasLimit: 3500000,
}
