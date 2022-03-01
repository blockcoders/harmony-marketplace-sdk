import { ITransactionOptions } from 'src/interfaces'
import 'dotenv/config'

export const HARMONY_TESTNET = 'https://api.s0.b.hmny.io/'
export const TEST_ADDRESS_1 = '0x7c61c8f282aeaae3e0476d0533d21dc42c5aa146'.toLowerCase()
export const TEST_ADDRESS_2 = '0xc57DE96E7ADd6D0fc6BdF51758Fd90b111f89b79'.toLowerCase()
export const TEST_ADDRESS_3 = '0x264F47C0E2fb1B587F6fa270862F3CBc68460B75'.toLowerCase()
export const TEST_ADDRESS_4 = '0xe8f887475466f6a232f428f038b9ada36dc3582d'.toLowerCase()

const TEST_PK_1 = process.env.TEST_PK_1 ?? ''

if (!TEST_PK_1) {
  throw new Error('TEST_PK_1 must have a value')
}

export const TEST_ACCOUNT_1 = {
  address: TEST_ADDRESS_1,
  privateKey: TEST_PK_1.toLowerCase(),
}

const TEST_PK_2 = process.env.TEST_PK_2 ?? ''

if (!TEST_PK_2) {
  throw new Error('TEST_PK_2 must have a value')
}

export const TEST_ACCOUNT_2 = {
  address: TEST_ADDRESS_2,
  privateKey: TEST_PK_2.toLowerCase(),
}

const TEST_PK_3 = process.env.TEST_PK_3 ?? ''

if (!TEST_PK_3) {
  throw new Error('TEST_PK_3 must have a value')
}

export const TEST_ACCOUNT_3 = {
  address: TEST_ADDRESS_3,
  privateKey: TEST_PK_3.toLowerCase(),
}

const TEST_PK_4 = process.env.TEST_PK_4 ?? ''
const TEST_SEED_4 = process.env.TEST_SEED_4 ?? ''

if (!TEST_PK_4) {
  throw new Error('TEST_PK_4 must have a value')
}

if (!TEST_SEED_4) {
  throw new Error('TEST_SEED_4 must have a value')
}

export const TEST_ACCOUNT_4 = {
  address: TEST_ADDRESS_4,
  privateKey: TEST_PK_4.toLowerCase(),
  mnemonic: TEST_SEED_4.toLowerCase(),
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
