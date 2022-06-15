import { Account } from '@harmony-js/account'
import { ChainID } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HARMONY_RPC_SHARD_0_DEVNET } from '../constants'
import { BaseContract } from '../contracts'
import { HarmonyShards } from '../interfaces'
import { MnemonicKey, PrivateKey } from '../wallets'
import { TEST_ADDRESS_2, TEST_PK_1, TX_OPTIONS, TOKEN_GOLD, TEST_SEED } from './constants'
import { ABI } from './contracts/TestToken/abi'

use(chaiAsPromised)

class TestToken extends BaseContract {
  constructor() {
    super('0x', ABI, new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_PK_1, ChainID.HmyPangaea))
  }
}

describe('Base Contract', () => {
  let contract: TestToken

  before(() => {
    contract = new TestToken()
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('setSignerByPrivateKey', () => {
    it('should return an instance of an Account', async () => {
      const account = contract.setSignerByPrivateKey(TEST_PK_1)

      expect(account).to.not.be.null
      expect(account).to.not.be.undefined
      expect(account).to.be.instanceOf(Account)
    })

    it('should throw an error if privateKey is not provided', async () => {
      try {
        contract.setSignerByPrivateKey('')
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })

    it('should throw an error if privateKey is not valid', async () => {
      try {
        contract.setSignerByPrivateKey('This is a test')
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })

    it('should throw an error if type is not valid', async () => {
      try {
        contract.setSignerByPrivateKey(TEST_ADDRESS_2)
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('send', () => {
    it('should throw an error if method is invalid', async () => {
      expect(contract.send('test', [TOKEN_GOLD], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no transaction response', async () => {
      const stub = sinon.stub(BaseContract.prototype, 'send')
      stub.withArgs('safeTransferFrom', [TEST_ADDRESS_2, '', TOKEN_GOLD, 10, '0x'], TX_OPTIONS).onFirstCall().rejects()

      expect(
        contract.send('safeTransferFrom', [TEST_ADDRESS_2, '', TOKEN_GOLD, 10, '0x'], TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no params', async () => {
      const stub = sinon.stub(BaseContract.prototype, 'send')
      stub.withArgs('', []).onFirstCall().rejects()

      expect(contract.send('', [])).to.be.rejectedWith(Error)
    })
  })

  describe('setSignerByMnemonic', () => {
    it('should return an Account instance', async () => {
      const account = contract.setSignerByMnemonic(TEST_SEED)

      expect(account).to.not.be.null
      expect(account).to.not.be.undefined
      expect(account).to.be.instanceOf(Account)
    })

    it('should throw an error if mnemonic is not valid', async () => {
      try {
        contract.setSignerByMnemonic('')
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('setSignerByKey', () => {
    it('should throw an error if key is not valid', async () => {
      try {
        new MnemonicKey(HARMONY_RPC_SHARD_0_DEVNET.url, {}, ChainID.HmyPangaea)
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })
})
