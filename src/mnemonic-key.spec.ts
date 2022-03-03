import { ChainID, HDPath } from '@harmony-js/utils'
import { expect } from 'chai'
import { HARMONY_RPC_SHARD_0_TESTNET } from './constants'
import { Key } from './key'
import { MnemonicKey } from './mnemonic-key'
import { TEST_ACCOUNT_4 } from './tests/constants'

describe('Mnemonic Key Class', () => {
  let instance: MnemonicKey

  it('should be an instance of Key', () => {
    instance = new MnemonicKey(HARMONY_RPC_SHARD_0_TESTNET.url, {
      mnemonic: TEST_ACCOUNT_4.mnemonic,
      index: 1,
      derivationPath: "m/44'/30'/0'/0/",
      numberOfAddresses: 3,
    })

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should get the private key associated', () => {
    instance = new MnemonicKey(
      HARMONY_RPC_SHARD_0_TESTNET.url,
      {
        mnemonic: TEST_ACCOUNT_4.mnemonic,
        derivationPath: HDPath,
        numberOfAddresses: 1,
        index: 0,
      },
      ChainID.HmyTestnet,
    )

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer).to.exist
    expect(instance.signer?.privateKey).to.exist
    expect(instance.signer?.privateKey).to.be.equal(TEST_ACCOUNT_4.privateKey)
  })

  it('should return a default mnemonic key if object is empty', () => {
    instance = new MnemonicKey(HARMONY_RPC_SHARD_0_TESTNET.url, {}, ChainID.HmyTestnet)
    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer).to.exist
    expect(instance.signer?.privateKey).to.exist
  })

  it('should throw an error if mnemonic key is not valid', () => {
    try {
      new MnemonicKey(
        HARMONY_RPC_SHARD_0_TESTNET.url,
        {
          mnemonic: 'this is an wrong example of seed',
        },
        ChainID.HmyTestnet,
      )
    } catch (error) {
      expect(error).to.be.exist
      expect(error).to.be.instanceOf(Error)
    }
  })
})
