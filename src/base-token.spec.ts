import { AddressZero } from '@ethersproject/constants'
import { ContractFactory } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BaseToken } from './base-token'
import { HRC1155 } from './hrc1155'
import { HRC721 } from './hrc721'
import { TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, TESTING_ABI, TEST_ACCOUNT_2 } from './tests/constants'

class TestToken extends BaseToken {}
class TestHRC721 extends HRC721 {}
class TestHRC1155 extends HRC1155 {}

describe('Base Token Provider', () => {
  let provider: TestToken
  let hrc721Provider: TestHRC721
  let hrc1155Provider: TestHRC1155
  use(chaiAsPromised)

  beforeEach(async () => {
    const client = sinon.createStubInstance(Harmony)
    client.contracts = sinon.createStubInstance(ContractFactory)
    provider = new TestToken('', TESTING_ABI, client)
    hrc721Provider = new TestHRC721('', '', client)
    hrc1155Provider = new TestHRC1155('', '', client)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should throw an error if address is not provided in HRC1155', async () => {
      expect(hrc1155Provider.balanceOf('', 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if address is not provided in HRC721', async () => {
      expect(hrc721Provider.balanceOf('')).to.be.rejectedWith(Error)
    })

    it('should throw an error if provided address is zero-address in HRC1155', async () => {
      expect(hrc1155Provider.balanceOf(AddressZero, 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if provided address is zero-address in HRC721', async () => {
      expect(hrc721Provider.balanceOf(AddressZero)).to.be.rejectedWith(Error)
    })
  })

  describe('setApprovalForAll', () => {
    it('should throw an error if addressOperator is not provided in HRC1155', async () => {
      expect(hrc1155Provider.setApprovalForAll('', true)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC721', async () => {
      expect(hrc721Provider.setApprovalForAll('', true)).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should throw an error if addressOwner is not provided in HRC1155', async () => {
      expect(hrc1155Provider.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOwner is not provided in HRC721', async () => {
      expect(hrc721Provider.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC1155', async () => {
      expect(hrc1155Provider.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC721', async () => {
      expect(hrc721Provider.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided in HRC1155', async () => {
      expect(hrc1155Provider.isApprovedForAll('', '')).to.be.rejectedWith(Error)
      expect(hrc721Provider.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided in HRC721', async () => {
      expect(hrc721Provider.isApprovedForAll('', '')).to.be.rejectedWith(Error)
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
