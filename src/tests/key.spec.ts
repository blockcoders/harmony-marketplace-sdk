import { Wallet } from '@harmony-js/account'
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { ChainID } from '@harmony-js/utils'
import { expect } from 'chai'
import { HARMONY_RPC_SHARD_0_DEVNET, HARMONY_RPC_DEVNET_WS } from '../constants'
import { HarmonyShards } from '../interfaces'
import { Key } from '../wallets'

describe('Key Class', () => {
  let instance: Key

  it('should be an instance of Wallet', async () => {
    instance = new Key(HARMONY_RPC_SHARD_0_DEVNET.url)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Wallet)
  })

  it('should instance correctly the key class using url as a string with chain id', async () => {
    instance = new Key(HARMONY_RPC_SHARD_0_DEVNET.url, ChainID.HmyPangaea)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should instance correctly the key class using url as a string', async () => {
    instance = new Key(HARMONY_RPC_SHARD_0_DEVNET.url)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should instance correctly the key class using url as a HttpProvider', async () => {
    const http = new HttpProvider(HARMONY_RPC_SHARD_0_DEVNET.url)
    instance = new Key(http, ChainID.HmyPangaea)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should instance correctly the key class using url as a WSProvider', async () => {
    const http = new WSProvider(HARMONY_RPC_DEVNET_WS)
    instance = new Key(http, ChainID.HmyPangaea)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should instance correctly the key class using url as a HarmonyShards', async () => {
    instance = new Key(HarmonyShards.SHARD_0_TESTNET, ChainID.HmyPangaea)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should throw an error if url is not provided', async () => {
    try {
      new Key('')
    } catch (error) {
      expect(error).to.be.exist
      expect(error).to.be.instanceOf(Error)
    }
  })
})
