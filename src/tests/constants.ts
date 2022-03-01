import { ITransactionOptions } from 'src/interfaces'

export const HARMONY_TESTNET = 'https://api.s0.b.hmny.io/'
export const TEST_ADDRESS_1 = '0x7c61c8f282aeaae3e0476d0533d21dc42c5aa146'.toLowerCase()
export const TEST_ADDRESS_2 = '0xc57DE96E7ADd6D0fc6BdF51758Fd90b111f89b79'.toLowerCase()
export const TEST_ADDRESS_3 = '0x264F47C0E2fb1B587F6fa270862F3CBc68460B75'.toLowerCase()
export const TEST_ADDRESS_4 = '0xe8f887475466f6a232f428f038b9ada36dc3582d'.toLowerCase()

export const TEST_ACCOUNT_1 = {
  address: TEST_ADDRESS_1,
  privateKey: 'dc0ab9fc02cb694853c939037c986a792bdd779fe481c0767d7551ad45d45b39'.toLowerCase(),
}
export const TEST_ACCOUNT_2 = {
  address: TEST_ADDRESS_2,
  privateKey: '4fafe94f8482895d335b2c1534e3c3332db16dc5a65a554c7e26b92d5179ca76'.toLowerCase(),
}
export const TEST_ACCOUNT_3 = {
  address: TEST_ADDRESS_3,
  privateKey: '621b40f892817b902ed5c9bef2e0bae9ba9dbc3868a8bb361493be08f1eca70f'.toLowerCase(),
}
export const TEST_ACCOUNT_4 = {
  address: TEST_ADDRESS_4,
  privateKey: '0x8a91aa24d25d221a9c213a0ac40fc88c0771fac5f6faa117688e6230a2e7d1d8'.toLowerCase(),
  mnemonic: 'build surprise shadow win over science walk income mosquito armed key own',
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
