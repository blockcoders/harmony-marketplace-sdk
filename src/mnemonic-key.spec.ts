import { ChainID } from '@harmony-js/utils'
import { expect } from 'chai'
import { HARMONY_RPC_SHARD_0_TESTNET } from './constants'
import { Key } from './key'
import { MnemonicKey } from './mnemonic-key'
import { TEST_ACCOUNT_4 } from './tests/constants'

describe('Mnemonic Key Class', () => {
  let instance: MnemonicKey

  it('should be an instance of Key', async () => {
    instance = new MnemonicKey(HARMONY_RPC_SHARD_0_TESTNET.url, {
      mnemonic: TEST_ACCOUNT_4.mnemonic,
    })

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  it('should get the private key associated', async () => {
    instance = new MnemonicKey(
      HARMONY_RPC_SHARD_0_TESTNET.url,
      {
        mnemonic: TEST_ACCOUNT_4.mnemonic,
      },
      ChainID.HmyTestnet,
    )

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance.signer).to.exist
    expect(instance.signer?.privateKey).to.exist
    expect(instance.signer?.privateKey).to.be.equal(TEST_ACCOUNT_4.privateKey)
  })
})
