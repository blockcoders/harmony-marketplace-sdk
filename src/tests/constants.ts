import { Transaction } from '@harmony-js/transaction'
import { ChainID, ChainType } from '@harmony-js/utils'
import 'dotenv/config'
import { ITransactionOptions, HDOptions } from 'src/interfaces'
import { HarmonyShards } from '../interfaces'
import { MnemonicKey } from '../mnemonic-key'
import { PrivateKey } from '../private-key'

export const HARMONY_TESTNET = 'https://api.s0.b.hmny.io/'

export const TEST_PK_1 = process.env.TEST_PK_1 ?? ''
export const TEST_PK_2 = process.env.TEST_PK_2 ?? ''
export const ETH_TEST_PK = process.env.ETH_TEST_PK ?? ''
export const TEST_SEED =
  process.env.TEST_SEED ?? 'pablo diego jose francisco de paula juan nepomuceno maria ruiz y picasso'

if (!TEST_PK_1) {
  throw new Error('TEST_PK_1 must be defined')
}

if (!TEST_PK_2) {
  throw new Error('TEST_PK_2 must be defined')
}

export const WALLET_PROVIDER_TEST_1: PrivateKey = new PrivateKey(
  HarmonyShards.SHARD_0_TESTNET,
  TEST_PK_1.toLowerCase(),
  ChainID.HmyTestnet,
)

export const WALLET_ETH_PROVIDER_TEST_1: PrivateKey = new PrivateKey(
  'https://ropsten.infura.io/v3/7d13ce4d18e5424bbc618b371204cb19',
  ETH_TEST_PK.toLowerCase(),
  ChainID.Ropsten,
  ChainType.Ethereum,
)

export const WALLET_PROVIDER_TEST_2: PrivateKey = new PrivateKey(
  HarmonyShards.SHARD_0_TESTNET,
  TEST_PK_2.toLowerCase(),
  ChainID.HmyTestnet,
)

export const WALLET_PROVIDER_TEST_3: PrivateKey = new MnemonicKey(
  HarmonyShards.SHARD_0_TESTNET,
  { mnemonic: TEST_SEED },
  ChainID.HmyTestnet,
)

export const TEST_ADDRESS_1 = WALLET_PROVIDER_TEST_1.accounts[0].toLowerCase()
export const TEST_ADDRESS_2 = WALLET_PROVIDER_TEST_2.accounts[0].toLowerCase()
export const TEST_ADDRESS_3 = WALLET_PROVIDER_TEST_3.accounts[0].toLowerCase()

export const EMPTY_TEST_ADDRESS = '0x36f41b8a79eca329610d6158f3ea9676bec281b9'.toLowerCase()
export const ERC721_CONTRACT_ADDRESS = '0x8CAd7e9cAE97f359F4aEFA5FE1615a56319D50eB'.toLowerCase()
export const HRC721_CONTRACT_ADDRESS = '0x7284afe00b49F9eE6446c279057F2135c28a03A5'.toLowerCase()
export const ERC1155_CONTRACT_ADDRESS = ''.toLowerCase()
export const HRC1155_CONTRACT_ADDRESS = '0xD59AF020E36F710e8fB1e42e05cE48CF6b86D4B4'.toLowerCase()
export const TOKEN_GOLD = 0
export const TOKEN_SILVER = 1
export const TOKEN_THORS_HAMMER = 2
export const TOKEN_SWORD = 3
export const TOKEN_SHIELD = 4
export const TX_OPTIONS: ITransactionOptions = {
  gasLimit: '5000000',
  gasPrice: '100',
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

export const FAKE_BALANCE_HRC1155 = '999999999999999999999889'

export const options: HDOptions = {
  numberOfAddresses: 1,
  gasPrice: '100',
  gasLimit: '5000000',
}
