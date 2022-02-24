import { HttpProvider } from '@harmony-js/network' // WSProvider
import { ChainID } from '@harmony-js/utils'
import { expect } from 'chai' // , use
import { HARMONY_RPC_SHARD_0_TESTNET, HARMONY_RPC_SHARD_1_TESTNET } from './constants'
import { Key } from './key'

describe('Key Class', () => {
  let instance: Key

  describe('key', () => {
    it('should instance correctly the key class using url as a string with chain id', async () => {
      instance = new Key(HARMONY_RPC_SHARD_0_TESTNET.url, ChainID.HmyTestnet)

      expect(instance).to.be.exist
      expect(instance).to.not.be.null
      expect(instance).to.not.be.undefined
    })

    it('should instance correctly the key class using url as a string', async () => {
      instance = new Key(HARMONY_RPC_SHARD_1_TESTNET.url)

      expect(instance).to.be.exist
      expect(instance).to.not.be.null
      expect(instance).to.not.be.undefined
    })

    it('should instance correctly the key class using url as a HttpProvider', async () => {
      const http = new HttpProvider(HARMONY_RPC_SHARD_0_TESTNET.url)
      instance = new Key(http, ChainID.HmyTestnet)
      console.log(instance)
      expect(instance).to.be.exist
      expect(instance).to.not.be.null
      expect(instance).to.not.be.undefined
    })
  })
})
