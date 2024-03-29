import { ChainID, ChainType, Unit } from '@harmony-js/utils'
import { ChainId, ContractAddresses, HarmonyRpcConfig, HarmonyShards, ITransactionOptions } from './interfaces'

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const DEFAULT_GAS_PRICE = '1000000000'
export const DEFAULT_GAS_LIMIT = '3500000'
export const HARMONY_RPC_SHARD_0_URL = 'https://api.harmony.one'
export const HARMONY_RPC_SHARD_1_URL = 'https://s1.api.harmony.one'
export const HARMONY_RPC_SHARD_2_URL = 'https://s2.api.harmony.one'
export const HARMONY_RPC_SHARD_3_URL = 'https://s3.api.harmony.one'
export const HARMONY_RPC_SHARD_0_TESTNET_URL = 'https://api.s0.b.hmny.io'
export const HARMONY_RPC_SHARD_1_TESTNET_URL = 'https://api.s1.b.hmny.io'
export const HARMONY_RPC_SHARD_2_TESTNET_URL = 'https://api.s2.b.hmny.io'
export const HARMONY_RPC_SHARD_3_TESTNET_URL = 'https://api.s3.b.hmny.io'
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

export const CHAINS_ID: ChainId = {
  1666600000: HARMONY_RPC_SHARD_0_URL,
  1666600001: HARMONY_RPC_SHARD_1_URL,
  1666600002: HARMONY_RPC_SHARD_2_URL,
  1666600003: HARMONY_RPC_SHARD_3_URL,
  1666700000: HARMONY_RPC_SHARD_0_TESTNET_URL,
  1666700001: HARMONY_RPC_SHARD_1_TESTNET_URL,
  1666700002: HARMONY_RPC_SHARD_2_TESTNET_URL,
  1666700003: HARMONY_RPC_SHARD_3_TESTNET_URL,
  1666900000: HARMONY_RPC_SHARD_0_DEVNET_URL,
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
  ethManagerAddress: '0xb6bE28Dc813D52A4740c3FA9C0c04e6542cce48d',
  hmyManagerAddress: '0xe494ebf0290833ee655e4edecca95ef82ae60c4e',
  tokenManagerAddress: '0x4a9832Aa2b22417Be739b15391Ec386403461f4b',
}

export const DEVNET_HRC721_CONTRACTS_ADDRESSES: ContractAddresses = {
  ethManagerAddress: '0x5c8a5cC4b46C8cdD2C50b3357984086814956DA7',
  hmyManagerAddress: '0x2150cbd4a66f8922a21eec68c1c9cafdaca5eddc',
  tokenManagerAddress: '0xCda2C033FDD220D987555e9F4934E6E69C5BC4Bd',
}

export const DEVNET_HRC1155_CONTRACTS_ADDRESSES: ContractAddresses = {
  ethManagerAddress: '0x30Ec2A1002D1b099537d243b8A753A328A8f5ff1',
  hmyManagerAddress: '0x7bf2fbfd386e61776085bd4b69821145fb8b059f',
  tokenManagerAddress: '0x61BC4C52cE08A4BF5A3d5CBcF5d1664842c64f53',
}

export const DEFAULT_TX_OPTIONS: ITransactionOptions = {
  gasPrice: new Unit('30').asGwei().toWei(),
  gasLimit: 3500000,
}
