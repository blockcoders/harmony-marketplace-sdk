import { ChainID } from '@harmony-js/utils'
import { ITransactionOptions } from 'src/interfaces'
import { HarmonyShards } from '../interfaces'
import { PrivateKey } from '../private-key'
import 'dotenv/config'

export const HARMONY_TESTNET = 'https://api.s0.b.hmny.io/'

const TEST_PK_1 = process.env.TEST_PK_1 ?? ''

if (!TEST_PK_1) {
  throw new Error('TEST_PK_1 must have a value')
}

const TEST_SEED_1 = process.env.TEST_SEED_1 ?? ''

if (!TEST_SEED_1) {
  throw new Error('TEST_SEED_1 must have a value')
}

export const PROVIDER_TEST_1: PrivateKey = new PrivateKey(
  HarmonyShards.SHARD_0_TESTNET,
  TEST_PK_1.toLowerCase(),
  ChainID.HmyTestnet,
)

export const TEST_ACCOUNT_1 = {
  address: PROVIDER_TEST_1.accounts[0].toLowerCase(),
  privateKey: TEST_PK_1.toLowerCase(),
  mnemonic: TEST_SEED_1.toLowerCase(),
}

const TEST_PK_2 = process.env.TEST_PK_2 ?? ''

if (!TEST_PK_2) {
  throw new Error('TEST_PK_2 must have a value')
}

export const PROVIDER_TEST_2: PrivateKey = new PrivateKey(
  HarmonyShards.SHARD_0_TESTNET,
  TEST_PK_2.toLowerCase(),
  ChainID.HmyTestnet,
)

export const TEST_ACCOUNT_2 = {
  address: PROVIDER_TEST_2.accounts[0].toLowerCase(),
  privateKey: TEST_PK_2.toLowerCase(),
}

const TEST_PK_3 = process.env.TEST_PK_3 ?? ''

if (!TEST_PK_3) {
  throw new Error('TEST_PK_3 must have a value')
}

const PROVIDER_TEST_3: PrivateKey = new PrivateKey(
  HarmonyShards.SHARD_0_TESTNET,
  TEST_PK_3.toLowerCase(),
  ChainID.HmyTestnet,
)

export const TEST_ACCOUNT_3 = {
  address: PROVIDER_TEST_3.accounts[0].toLowerCase(),
  privateKey: TEST_PK_3.toLowerCase(),
}

export const EMPTY_TEST_ADDRESS = '0x36f41b8a79eca329610d6158f3ea9676bec281b9'.toLowerCase()
export const HRC721_CONTRACT_ADDRESS = '0xF00373c538cca8ac7f2290ffFA425c32459ef10b'.toLowerCase()
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
