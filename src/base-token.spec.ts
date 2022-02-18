import { AddressZero } from '@ethersproject/constants'
import { Harmony } from '@harmony-js/core'
// import { ChainID, ChainType } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BaseToken } from './base-token'
import { TEST_ADDRESS_1, TESTING_ABI, EMPTY_TEST_ADDRESS, TEST_ACCOUNT_2 } from './tests/constants'
// HARMONY_TESTNET

class TestToken extends BaseToken {}

describe('Base Token Provider', () => {
  // const client = new Harmony(HARMONY_TESTNET, {
  //   chainType: ChainType.Harmony,
  //   chainId: ChainID.HmyTestnet,
  // })
  let provider: TestToken
  use(chaiAsPromised)

  beforeEach(async () => {
    const client = sinon.createStubInstance(Harmony, {
      createContract: sinon.stub().returns()
    })
    // client.contracts.createContract(TESTING_ABI)
    provider = new TestToken('', TESTING_ABI, client)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('_getBalance', () => {
    it('should get the number of tokens in the specified account in base provider', async () => {
      const stub = sinon.stub(BaseToken.prototype, '_getBalance')
      stub.withArgs(TEST_ADDRESS_1, 1).resolves()

      expect(provider._getBalance(TEST_ADDRESS_1, 1)).to.eventually.to.exist
      stub.restore()
    })

    it('should throw an error if address is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, '_getBalance')
      stub.withArgs('', 1).onCall(0).rejects()

      expect(provider._getBalance('', 1)).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if provided address is zero-address', async () => {
      const stub = sinon.stub(BaseToken.prototype, '_getBalance')
      stub.withArgs(AddressZero, 1).onCall(0).rejects()

      expect(provider._getBalance(AddressZero, 1)).to.be.rejectedWith(Error)
      stub.restore()
    })
  })

  describe('setApprovalForAll', () => {
    it('should grants or revokes permission to addressOperator to transfer the callers tokens, according to approved', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'setApprovalForAll')
      stub.withArgs(TEST_ADDRESS_1, true).resolves()

      expect(provider.setApprovalForAll(TEST_ADDRESS_1, true)).to.eventually.to.exist
      stub.restore()
    })

    it('should throw an error if addressOperator is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'setApprovalForAll')
      stub.withArgs('', true).onCall(0).rejects()

      expect(provider.setApprovalForAll('', true)).to.be.rejectedWith(Error)
      stub.restore()
    })
  })

  describe('isApprovedForAll', () => {
    it('should return true if operator is approved to transfer accounts tokens', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'isApprovedForAll')
      stub.withArgs(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS).resolves()

      expect(provider.isApprovedForAll(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS)).to.eventually.to.exist
      stub.restore()
    })

    it('should throw an error if addressOwner is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'isApprovedForAll')
      stub.withArgs('', EMPTY_TEST_ADDRESS).onCall(0).rejects()

      expect(provider.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if addressOperator is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'isApprovedForAll')
      stub.withArgs(TEST_ADDRESS_1, '').onCall(0).rejects()

      expect(provider.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if params are not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'isApprovedForAll')
      stub.withArgs('', '').onCall(0).rejects()

      expect(provider.isApprovedForAll('', '')).to.be.rejectedWith(Error)
      stub.restore()
    })
  })

  describe('setSignerByPrivateKey', () => {
    it('should throw an error if privateKey is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey')
      stub.withArgs('', 'Test').onCall(0).rejects()

      expect(provider.setSignerByPrivateKey('', 'Test')).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if privateKey is not valid', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey')
      stub.withArgs('This is a test', 'Test').onCall(0).rejects()

      expect(provider.setSignerByPrivateKey('This is a test', 'Test')).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if type is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey')
      stub.withArgs(TEST_ACCOUNT_2.privateKey, '').onCall(0).rejects()

      expect(provider.setSignerByPrivateKey(TEST_ACCOUNT_2.privateKey, '')).to.be.rejectedWith(Error)
      stub.restore()
    })
  })

  describe('checkForSigner', () => {
    it('should throw an error if privateKey is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'checkForSigner')
      stub.withArgs('').onCall(0).rejects()

      expect(provider.checkForSigner('')).to.be.rejectedWith(Error)
      stub.restore()
    })
  })

  describe('checkNotBeZeroAddress', () => {
    it('should throw an error if firstAddress is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'checkNotBeZeroAddress')
      stub.withArgs('').onCall(0).rejects()

      expect(provider.checkNotBeZeroAddress('')).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if firstAddress is zero address', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'checkNotBeZeroAddress')
      stub.withArgs(AddressZero).onCall(0).rejects()

      expect(provider.checkNotBeZeroAddress(AddressZero)).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if secondAddress is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'checkNotBeZeroAddress')
      stub.withArgs(TEST_ADDRESS_1, '').onCall(0).rejects()

      expect(provider.checkNotBeZeroAddress(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if secondAddress is zero address', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'checkNotBeZeroAddress')
      stub.withArgs(TEST_ADDRESS_1, AddressZero).onCall(0).rejects()

      expect(provider.checkNotBeZeroAddress(TEST_ADDRESS_1, AddressZero)).to.be.rejectedWith(Error)
      stub.restore()
    })

    it('should throw an error if firstAddress and secondAddress are zero address', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'checkNotBeZeroAddress')
      stub.withArgs(AddressZero, AddressZero).onCall(0).rejects()

      expect(provider.checkNotBeZeroAddress(AddressZero, AddressZero)).to.be.rejectedWith(Error)
      stub.restore()
    })
  })
})
