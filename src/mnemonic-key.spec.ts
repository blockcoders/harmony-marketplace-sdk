import { ChainID } from '@harmony-js/utils'
import { expect } from 'chai'
import { HARMONY_RPC_SHARD_0_TESTNET } from './constants'
import { Key } from './key'
import { MnemonicKey } from './mnemonic-key'
import { TEST_SEED, TEST_PK_1 } from './tests/constants'

describe('Mnemonic Key Class', () => {
  let instance: MnemonicKey

  it('should be an instance of Key', () => {
    instance = new MnemonicKey(HARMONY_RPC_SHARD_0_TESTNET.url, {
      mnemonic: TEST_SEED,
    })

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should get the private key associated', () => {
    instance = new MnemonicKey(
      HARMONY_RPC_SHARD_0_TESTNET.url,
      {
        mnemonic: TEST_SEED,
      },
      ChainID.HmyTestnet,
    )

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer).to.exist
    expect(instance.signer?.privateKey).to.exist
    expect(instance.signer?.privateKey).to.be.equal(`0x${TEST_PK_1}`)
  })

  it('should return a default mnemonic key if object is empty', () => {
    instance = new MnemonicKey(HARMONY_RPC_SHARD_0_TESTNET.url, {}, ChainID.HmyTestnet)
    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer).to.exist
    expect(instance.signer?.privateKey).to.exist
  })
})
