import 'dotenv/config'

import { ChainID } from '@harmony-js/utils'
import { ITransactionOptions } from 'src/interfaces'
import { HarmonyShards } from '../interfaces'
import { MnemonicKey } from '../mnemonic-key'
import { PrivateKey } from '../private-key'

export const HARMONY_TESTNET = 'https://api.s0.b.hmny.io/'

export const TEST_PK_1 = process.env.TEST_PK_1 ?? ''
export const TEST_PK_2 = process.env.TEST_PK_2 ?? ''
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

console.log(TEST_ADDRESS_1, TEST_ADDRESS_2, TEST_ADDRESS_3)

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
