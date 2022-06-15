import { ChainID } from '@harmony-js/utils'
import { expect } from 'chai'
import { HARMONY_RPC_SHARD_0_DEVNET } from '../constants'
import { TEST_SEED } from '../tests/constants'
import { Key, MnemonicKey } from '../wallets'

describe('Mnemonic Key Class', () => {
  let instance: MnemonicKey

  it('should be an instance of Key', () => {
    instance = new MnemonicKey(HARMONY_RPC_SHARD_0_DEVNET.url, {
      mnemonic: TEST_SEED,
    })

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should get the private key associated', () => {
    instance = new MnemonicKey(
      HARMONY_RPC_SHARD_0_DEVNET.url,
      {
        mnemonic: TEST_SEED,
        index: 0,
      },
      ChainID.HmyPangaea,
    )

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer?.privateKey).to.not.be.null
  })

  it('should return a default mnemonic key if object is empty', () => {
    instance = new MnemonicKey(HARMONY_RPC_SHARD_0_DEVNET.url, {}, ChainID.HmyPangaea)
    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer).to.exist
    expect(instance.signer?.privateKey).to.exist
  })

  it('should throw an error if mnemonic key is not valid', () => {
    try {
      new MnemonicKey(
        HARMONY_RPC_SHARD_0_DEVNET.url,
        {
          mnemonic: 'this is an wrong example of seed',
        },
        ChainID.HmyPangaea,
      )
    } catch (error) {
      expect(error).to.be.exist
      expect(error).to.be.instanceOf(Error)
    }
  })
})
