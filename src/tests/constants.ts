import 'dotenv/config'
import { BigNumber } from '@ethersproject/bignumber'
import { EtherscanProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { Transaction } from '@harmony-js/transaction'
import { ChainID, Unit } from '@harmony-js/utils'
import BN from 'bn.js'
import { ITransactionOptions, HDOptions } from '../interfaces'
import { HarmonyShards } from '../interfaces'
import { PrivateKey } from '../wallets'

export const TEST_PK_1 = process.env.TEST_PK_1 ?? ''
export const TEST_PK_2 = process.env.TEST_PK_2 ?? ''
export const TEST_SEED = process.env.TEST_SEED ?? ''
export const MASTER_PRIVATE_KEY = process.env.MASTER_PRIVATE_KEY ?? ''
export const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY ?? ''
export const API_KEY = process.env.API_KEY ?? ''

if (!TEST_PK_1) {
  throw new Error('TEST_PK_1 must be defined')
}

if (!TEST_PK_2) {
  throw new Error('TEST_PK_2 must be defined')
}

if (!MASTER_PRIVATE_KEY) {
  throw new Error('MASTER_PRIVATE_KEY must be defined')
}

if (!OWNER_PRIVATE_KEY) {
  throw new Error('OWNER_PRIVATE_KEY must be defined')
}

export const WALLET_PROVIDER_TEST_1: PrivateKey = new PrivateKey(
  HarmonyShards.SHARD_0_DEVNET,
  TEST_PK_1.toLowerCase(),
  ChainID.HmyPangaea,
)

export const WALLET_PROVIDER_TEST_2: PrivateKey = new PrivateKey(
  HarmonyShards.SHARD_0_DEVNET,
  TEST_PK_2.toLowerCase(),
  ChainID.HmyPangaea,
)

export const WALLET_HMY_MASTER = new PrivateKey(HarmonyShards.SHARD_0_DEVNET, MASTER_PRIVATE_KEY.toLowerCase(), 4)
export const WALLET_HMY_OWNER = new PrivateKey(HarmonyShards.SHARD_0_DEVNET, OWNER_PRIVATE_KEY.toLowerCase(), 4)

const ethProvider = new EtherscanProvider(
  {
    chainId: 4,
    name: 'rinkeby',
  },
  API_KEY,
)
export const WALLET_ETH_MASTER = new Wallet(MASTER_PRIVATE_KEY.toLowerCase(), ethProvider)
export const WALLET_ETH_OWNER = new Wallet(OWNER_PRIVATE_KEY.toLowerCase(), ethProvider)

export const TEST_ADDRESS_1 = WALLET_PROVIDER_TEST_1.accounts[0].toLowerCase()
export const TEST_ADDRESS_2 = WALLET_PROVIDER_TEST_2.accounts[0].toLowerCase()

export const HMY_OWNER_ADDRESS = WALLET_HMY_OWNER.accounts[0].toLowerCase()
export const HMY_MASTER_ADDRESS = WALLET_HMY_MASTER.accounts[0].toLowerCase()
export const ETH_OWNER_ADDRESS = WALLET_ETH_OWNER.address.toLowerCase()
export const ETH_MASTER_ADDRESS = WALLET_ETH_MASTER.address.toLowerCase()

export const EMPTY_TEST_ADDRESS = '0x36f41b8a79eca329610d6158f3ea9676bec281b9'.toLowerCase()
export const TOKEN_GOLD = 0
export const TOKEN_GOLD_URI = 'fake token gold URI'
export const TOKEN_SILVER = 1
export const TOKEN_THORS_HAMMER = 2
export const TOKEN_SWORD = 3
export const TOKEN_SHIELD = 4
export const TX_OPTIONS: ITransactionOptions = {
  gasLimit: '5000000',
  gasPrice: '0',
}

export const FAKE_TX_HRC721 = new Transaction({
  shardID: 0,
  from: 'one103su3u5z464w8cz8d5zn85sacsk94g2x2nty0a',
  to: '0xa25006B0aF77c1d248685205771bdC848Cda53d1',
  gasPrice: '100000000000',
  gasLimit: '5000000',
  toShardID: 0,
  nonce: 165,
  chainId: 2,
})

export const FAKE_TX = new Transaction({
  shardID: 0,
  from: 'one103su3u5z464w8cz8d5zn85sacsk94g2x2nty0a',
  to: '0xa25006B0aF77c1d248685205771bdC848Cda53d1',
  gasPrice: '100000000000',
  gasLimit: '5000000',
  toShardID: 0,
  nonce: 165,
  chainId: 2,
})

export const FAKE_TX_RECEIPT = {
  transactionHash: 'fake',
  transactionIndex: 'fake',
  blockHash: 'fake',
  blockNumber: '0x10',
  from: 'fake',
  to: 'fake',
  gasUsed: 'fake',
  cumulativeGasUsed: 'fake',
  logs: [],
  logsBloom: 'fake',
  v: 'fake',
  r: 'fake',
  s: 'fake',
}

export const FAKE_ETH_TX_RECEIPT = {
  to: '',
  from: '',
  contractAddress: '',
  transactionIndex: 0,
  root: '',
  gasUsed: BigNumber.from(0),
  logsBloom: '',
  blockHash: '',
  transactionHash: '0xfakeHash',
  logs: [],
  blockNumber: 0,
  confirmations: 0,
  cumulativeGasUsed: BigNumber.from(0),
  effectiveGasPrice: BigNumber.from(0),
  byzantium: true,
  type: 0,
  status: 1,
}

export const FAKE_BALANCE_HRC1155 = '999999999999999999999889'

export const FAKE_SUPPLY: BN = new BN(100)

export const HD_KEY_OPTIONS: HDOptions = {
  numberOfAddresses: 1,
  gasPrice: '100',
  gasLimit: '5000000',
}

export const E2E_TX_OPTIONS: ITransactionOptions = {
  gasPrice: new Unit('30').asGwei().toWei(),
  gasLimit: 3500000,
}

export enum ContractName {
  BlockcodersHRC20 = 'BlockcodersHRC20',
  BlockcodersHRC721 = 'BlockcodersHRC721',
  BlockcodersHRC1155 = 'BlockcodersHRC1155',
  BridgedHRC20Token = 'BridgedHRC20Token',
  BridgedHRC721Token = 'BridgedHRC721Token',
  BridgedHRC1155Token = 'BridgedHRC1155Token',
  HRC20EthManager = 'HRC20EthManager',
  HRC20HmyManager = 'HRC20HmyManager',
  HRC20TokenManager = 'HRC20TokenManager',
  HRC721EthManager = 'HRC721EthManager',
  HRC721HmyManager = 'HRC721HmyManager',
  HRC721TokenManager = 'HRC721TokenManager',
  HRC1155EthManager = 'HRC1155EthManager',
  HRC1155HmyManager = 'HRC1155HmyManager',
  HRC1155TokenManager = 'HRC1155TokenManager',
  GameItems = 'GameItems',
}
