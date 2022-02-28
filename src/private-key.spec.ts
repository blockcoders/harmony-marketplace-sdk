import { ChainID } from '@harmony-js/utils'
import { expect } from 'chai'
import { HARMONY_RPC_SHARD_0_TESTNET } from './constants'
import { Key } from './key'
import { PrivateKey } from './private-key'
import { TEST_ACCOUNT_1 } from './tests/constants'

describe('Private Key Class', () => {
  let instance: PrivateKey

  it('should be an instance of Key', async () => {
    instance = new PrivateKey(HARMONY_RPC_SHARD_0_TESTNET.url, TEST_ACCOUNT_1.privateKey)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should get the signer associated', async () => {
    instance = new PrivateKey(HARMONY_RPC_SHARD_0_TESTNET.url, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer).to.exist
    expect(instance.signer?.address).to.exist
    expect(instance.signer?.address).to.be.equal(TEST_ACCOUNT_1.address)
  })

  it('should get the private key associated', async () => {
    instance = new PrivateKey(HARMONY_RPC_SHARD_0_TESTNET.url, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer).to.exist
    expect(instance.signer?.privateKey).to.exist
    expect(instance.signer?.privateKey).to.be.equal(`0x${TEST_ACCOUNT_1.privateKey}`)
  })
})
