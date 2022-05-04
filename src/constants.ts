import { ChainID, ChainType } from '@harmony-js/utils'
import { HarmonyRpcConfig, HarmonyShards, ITransactionOptions, ManagerContractAddresses } from './interfaces'

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const DEFAULT_GAS_PRICE = '1' // 1 Gwei
export const DEFAULT_GAS_LIMIT = '21000'
export const HARMONY_RPC_SHARD_0_URL = 'https://api.harmony.one'
export const HARMONY_RPC_SHARD_1_URL = 'https://s1.api.harmony.one'
export const HARMONY_RPC_SHARD_2_URL = 'https://s2.api.harmony.one'
export const HARMONY_RPC_SHARD_3_URL = 'https://s3.api.harmony.one'
export const HARMONY_RPC_SHARD_0_TESTNET_URL = 'https://api.s0.b.hmny.io'
export const HARMONY_RPC_SHARD_1_TESTNET_URL = 'https://api.s1.b.hmny.io'
export const HARMONY_RPC_SHARD_2_TESTNET_URL = 'https://api.s2.b.hmny.io'
export const HARMONY_RPC_SHARD_3_TESTNET_URL = 'https://api.s3.b.hmny.io'
export const HARMONY_RPC_WS = 'wss://ws.s0.t.hmny.io'
export const HARMONY_RPC_TESTNET_WS = 'wss://ws.s0.b.hmny.io'
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
export const HARMONY_RPC_SHARD_0_TESTNET: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_0_TESTNET_URL,
  chainId: ChainID.HmyTestnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_1_TESTNET: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_1_TESTNET_URL,
  chainId: ChainID.HmyTestnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_2_TESTNET: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_2_TESTNET_URL,
  chainId: ChainID.HmyTestnet,
  chainType: ChainType.Harmony,
}
export const HARMONY_RPC_SHARD_3_TESTNET: HarmonyRpcConfig = {
  url: HARMONY_RPC_SHARD_3_TESTNET_URL,
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

export const TESTNET_BRIDGE_CONTRACTS: ManagerContractAddresses = {
  erc721EthManagerContract: '0xa44014b0b735dC8C1856f9b41C2112Fe1CfAa948',
  erc721HmyManagerContract: '0x1cEE71f0821fB7d3CCBaCaA221AC7e354bC7E439',
  hrc721EthManagerContract: '',
  hrc721HmyManagerContract: '',
  erc1155EthManagerContract: '',
  erc1155HmyManagerContract: '',
  hrc1155EthManagerContract: '',
  hrc1155HmyManagerContract: '',
  tokenManagerContract: '0xBB64ca9fd17EacC17796bFb2D3b3271501DB5EB4',
  ethUrl: 'https://ropsten.infura.io/v3/7d13ce4d18e5424bbc618b371204cb19',
  ethNetwork: '3',
  hmyUrl: 'https://api.s0.b.hmny.io',
  hmyNetwork: '2',
}

export const MAINNET_BRIDGE_CONTRACTS: ManagerContractAddresses = {
  erc721EthManagerContract: '',
  erc721HmyManagerContract: '',
  hrc721EthManagerContract: '',
  hrc721HmyManagerContract: '',
  erc1155EthManagerContract: '',
  erc1155HmyManagerContract: '',
  hrc1155EthManagerContract: '',
  hrc1155HmyManagerContract: '',
  tokenManagerContract: '',
  ethUrl: '',
  ethNetwork: '',
  hmyUrl: '',
  hmyNetwork: '',
}

export const BLOCKS_TO_WAIT = 14
export const AVG_BLOCK_TIME = 20 * 1000

export const DEFAULT_ETH_TX_OPTIONS: ITransactionOptions = {
  gasLimit: '5000000',
  gasPrice: '100',
}

export const DEFAULT_HMY_TX_OPTIONS: ITransactionOptions = {
  gasPrice: '30000000000',
  gasLimit: '6721900',
}
