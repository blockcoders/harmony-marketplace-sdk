import { Wallet } from '@harmony-js/account'
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { ChainID } from '@harmony-js/utils'
import { expect } from 'chai'
import { HARMONY_RPC_SHARD_0_TESTNET, HARMONY_RPC_SHARD_1_TESTNET, HARMONY_RPC_TESTNET_WS } from './constants'
import { HarmonyShards } from './interfaces'
// import { Key } from './key'
import { PrivateKey } from './private-key'
import { TEST_ACCOUNT_1 } from './tests/constants'

describe('Private Key Class', () => {
  let instance: PrivateKey

  it('should be an instance of Wallet', async () => {
    instance = new PrivateKey(HARMONY_RPC_SHARD_0_TESTNET.url, TEST_ACCOUNT_1.privateKey)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Wallet)
  })

  it('should instance correctly the private key class using url as a string with chain id', async () => {
    instance = new PrivateKey(HARMONY_RPC_SHARD_0_TESTNET.url, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(PrivateKey)
  })

  it('should instance correctly the private key class using url as a string', async () => {
    instance = new PrivateKey(HARMONY_RPC_SHARD_1_TESTNET.url, TEST_ACCOUNT_1.privateKey)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(PrivateKey)
  })

  it('should instance correctly the private key class using url as a HttpProvider', async () => {
    const http = new HttpProvider(HARMONY_RPC_SHARD_0_TESTNET.url)
    instance = new PrivateKey(http, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(PrivateKey)
  })

  it('should instance correctly the private key class using url as a WSProvider', async () => {
    const http = new WSProvider(HARMONY_RPC_TESTNET_WS)
    instance = new PrivateKey(http, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(PrivateKey)
  })

  it('should instance correctly the private key class using url as a HarmonyShards', async () => {
    instance = new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(PrivateKey)
  })

  it('should throw an error if url is not provided', async () => {
    try {
      new PrivateKey('', TEST_ACCOUNT_1.privateKey)
    } catch (error) {
      expect(error).to.be.exist
      expect(error).to.be.instanceOf(Error)
    }
  })

  it('should throw an error if privateKey is not provided', async () => {
    try {
      new PrivateKey(HarmonyShards.SHARD_0_TESTNET, '')
    } catch (error) {
      expect(error).to.be.exist
      expect(error).to.be.instanceOf(Error)
    }
  })
})
