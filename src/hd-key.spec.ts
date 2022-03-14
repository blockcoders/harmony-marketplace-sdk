import { Account } from '@harmony-js/account'
import { Messenger } from '@harmony-js/network'
import { HttpProvider } from '@harmony-js/network'
import { Transaction } from '@harmony-js/transaction'
import { ChainID } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HARMONY_RPC_SHARD_0_TESTNET_URL } from './constants'
import { HDKey } from './hd-key'
import { Key } from './key'
import { options, FAKE_TX_HRC721, TEST_ADDRESS_1, TEST_PK_1, TEST_ADDRESS_2 } from './tests/constants'

describe('HD Key Class', () => {
  use(chaiAsPromised)

  let instance: HDKey

  before(() => {
    instance = new HDKey(HARMONY_RPC_SHARD_0_TESTNET_URL, options, ChainID.HmyTestnet)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(instance).to.not.be.undefined
  })

  it('should be an instance of Key', () => {
    instance = new HDKey(HARMONY_RPC_SHARD_0_TESTNET_URL, options)

    expect(instance).to.not.be.null
    expect(instance).to.not.be.undefined
    expect(instance).to.be.instanceOf(Key)
  })

  describe('signTransaction', () => {
    it('should return a signed transaction', async () => {
      const txTest = new Transaction()
      const stub = sinon.stub(instance, 'signTransaction').withArgs(txTest)
      stub.resolves().returns(Promise.resolve(FAKE_TX_HRC721))

      const tx = await instance.signTransaction(txTest)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(tx).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if transaction is not valid', () => {
      expect(instance.signTransaction(new Transaction())).to.be.rejectedWith(Error)
    })
  })

  describe('setSigner', () => {
    it('should set  a signer', () => {
      const stub = sinon.stub(instance, 'setSigner').withArgs(TEST_ADDRESS_1)
      stub.resolves()

      instance.setSigner(TEST_ADDRESS_1)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if address is an empty string', () => {
      try {
        instance.setSigner('')
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })

    it('should throw an error if address is not valid', () => {
      try {
        instance.setSigner('This is an invalid address')
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('addByPrivateKey', () => {
    it('should return an account', () => {
      const stub = sinon.stub(instance, 'addByPrivateKey').withArgs(TEST_PK_1)
      stub.resolves().returns(new Account())

      const account = instance.addByPrivateKey(TEST_PK_1)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(account).to.be.equals(stub.returnValues[0])
      expect(account).to.be.instanceOf(Account)
    })

    it('should throw an error if privateKey is an empty string', () => {
      try {
        instance.addByPrivateKey('')
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })

    it('should throw an error if privateKey is not valid', () => {
      try {
        instance.addByPrivateKey('##This is an invalid private key##')
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('getAccount', () => {
    it('should return a specific account', () => {
      const stub = sinon.stub(instance, 'getAccount').withArgs(TEST_ADDRESS_1)
      stub.resolves().returns(new Account())

      const account = instance.getAccount(TEST_ADDRESS_1)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(account).to.be.equals(stub.returnValues[0])
    })

    it('should throw an error if address is an empty string', () => {
      try {
        instance.getAccount('')
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })

    it('should throw an error if address is not valid', () => {
      try {
        instance.getAccount('##This is an invalid address##')
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('setMessenger', () => {
    it('should set a messeger', () => {
      const http = new HttpProvider(HARMONY_RPC_SHARD_0_TESTNET_URL)
      const messenger = new Messenger(http)
      const stub = sinon.stub(instance, 'setMessenger').withArgs(messenger)

      instance.setMessenger(messenger)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if messenger is seted with a wrong HttpProvider', () => {
      const wrongProvider = new HttpProvider('test')
      try {
        instance.setMessenger(new Messenger(wrongProvider))
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('getAddress', () => {
    it('should return an address using its id', () => {
      const stub = sinon.stub(instance, 'getAddress').withArgs(1)
      stub.returns(TEST_ADDRESS_1)

      const address = instance.getAddress(1)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(address).to.be.equals(stub.returnValues[0])
    })

    it('should throw an error if id is not associated with an address', () => {
      try {
        instance.getAddress(1000)
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('getAddresses', () => {
    it('should return an array of addresses', () => {
      const stub = sinon.stub(instance, 'getAddresses').returns([TEST_ADDRESS_1, TEST_ADDRESS_2])

      const addresses = instance.getAddresses()

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(addresses).to.be.equals(stub.returnValues[0])
    })

    it('should throw an error if something went wrong', () => {
      try {
        instance.getAddresses()
      } catch (error) {
        expect(error).to.not.be.null
        expect(error).to.not.be.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })
})
