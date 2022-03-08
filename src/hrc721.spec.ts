import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { AddressZero } from './constants'
import { HRC721 } from './hrc721'
import {
  HRC721_CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  TEST_ADDRESS_2,
  EMPTY_TEST_ADDRESS,
  TOKEN_GOLD,
  TX_OPTIONS,
  FAKE_BALANCE_HRC721,
  FAKE_OWNER_HRC721,
  FAKE_APPROVED_HRC721,
  FAKE_IS_APPROVED_HRC721,
  FAKE_TX_HRC721,
  WALLET_PROVIDER_TEST_1,
  TOKEN_SWORD,
} from './tests/constants'
import { ABI } from './tests/contracts/HRC721/abi'

describe('HRC721 Contract Interface', () => {
  use(chaiAsPromised)

  let contract: HRC721

  before(() => {
    contract = new HRC721(HRC721_CONTRACT_ADDRESS, ABI, WALLET_PROVIDER_TEST_1)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(WALLET_PROVIDER_TEST_1).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account', async () => {
      const mockedBalance = await FAKE_BALANCE_HRC721
      const stub = sinon.stub(contract, 'call').withArgs('balanceOf', [TEST_ADDRESS_1], TX_OPTIONS)
      stub.resolves().returns(FAKE_BALANCE_HRC721)

      const call = await contract.call<BN>('balanceOf', [TEST_ADDRESS_1], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(call).to.be.equals(mockedBalance)
    })

    it('should throw an error if address is not provided', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('balanceOf', [], TX_OPTIONS).onFirstCall().rejects()

      expect(contract.call<BN>('balanceOf', [], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if txOptions is not provided', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('balanceOf', [TEST_ADDRESS_1]).onFirstCall().rejects()

      expect(contract.call<BN>('balanceOf', [TEST_ADDRESS_1])).to.be.rejectedWith(Error)
    })
  })

  describe('ownerOf', () => {
    it('should return the owner of the tokenId token', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf', [TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(FAKE_OWNER_HRC721)
      const owner = await contract.call<string>('ownerOf', [TOKEN_GOLD], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should return the owner of the tokenId token with tokenId as a string', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf', [TOKEN_GOLD.toString()], TX_OPTIONS)
      stub.resolves().returns(FAKE_OWNER_HRC721)
      const owner = await contract.call<string>('ownerOf', [TOKEN_GOLD.toString()], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should return the origin address of the tokenId token if the token has no owner', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf', [TOKEN_SWORD], TX_OPTIONS)
      stub.resolves().returns(FAKE_OWNER_HRC721)
      const owner = await contract.call<string>('ownerOf', [TOKEN_SWORD], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should throw an error if tokenId is a non existent token', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf', [6], TX_OPTIONS)
      stub.rejects()

      expect(contract.call<string>('ownerOf', [6], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf')
      stub.rejects()

      expect(contract.call<string>('ownerOf')).to.be.rejectedWith(Error)
    })

    it('should throw an error if txOptions is not provided', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf', [TOKEN_GOLD])
      stub.rejects()

      expect(contract.call<string>('ownerOf', [TOKEN_GOLD])).to.be.rejectedWith(Error)
    })
  })

  describe('transferFrom', () => {
    it('should transfer the ownership of a token from one address to another', async () => {
      const stub = sinon.stub(contract, 'send')
      stub
        .withArgs('transferFrom', [TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
        .onFirstCall()
        .resolves()
        .returns(FAKE_TX_HRC721)

      await contract.send('transferFrom', [TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if there is no signer', () => {
      const stub = sinon.stub(contract, 'send').withArgs('transferFrom', ['', TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
      stub.rejects()

      expect(contract.send('transferFrom', ['', TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no receiver', () => {
      const stub = sinon.stub(contract, 'send').withArgs('transferFrom', [TEST_ADDRESS_2, '', TOKEN_GOLD], TX_OPTIONS)
      stub.rejects()

      expect(contract.send('transferFrom', [TEST_ADDRESS_2, '', TOKEN_GOLD], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no tokenId', () => {
      const stub = sinon.stub(contract, 'send').withArgs('transferFrom', [TEST_ADDRESS_2, TEST_ADDRESS_1], TX_OPTIONS)
      stub.rejects()

      expect(contract.send('transferFrom', [TEST_ADDRESS_2, TEST_ADDRESS_1], TX_OPTIONS)).to.be.rejectedWith(Error)
    })
  })

  describe('safeTransferFrom', () => {
    it('should transfer the ownership of a token from one address to another with data', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs('safeTransferFrom', [TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD, '0x'], TX_OPTIONS)
      stub.resolves()

      await contract.send('safeTransferFrom', [TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD, '0x'], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should transfer the ownership of a token from one address to another without data', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs('safeTransferFrom', [TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves()

      await contract.send('safeTransferFrom', [TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw if there is no signer', () => {
      const stub = sinon.stub(contract, 'send')
      stub.withArgs('safeTransferFrom', ['', TEST_ADDRESS_2, TOKEN_GOLD, '0x'], TX_OPTIONS).onFirstCall().rejects()

      expect(contract.send('safeTransferFrom', ['', TEST_ADDRESS_2, TOKEN_GOLD, '0x'], TX_OPTIONS)).to.be.rejectedWith(
        Error,
      )
    })

    it('should throw if there is no receiver', () => {
      const stub = sinon.stub(contract, 'send')
      stub.withArgs('safeTransferFrom', [TEST_ADDRESS_1, '', TOKEN_GOLD, '0x'], TX_OPTIONS).onFirstCall().rejects()

      expect(contract.send('safeTransferFrom', [TEST_ADDRESS_1, '', TOKEN_GOLD, '0x'], TX_OPTIONS)).to.be.rejectedWith(
        Error,
      )
    })

    it('should throw if there is no tokenId', () => {
      const stub = sinon.stub(contract, 'send')
      stub.withArgs('safeTransferFrom', [TEST_ADDRESS_1, TEST_ADDRESS_2], TX_OPTIONS).onFirstCall().rejects()

      expect(contract.send('safeTransferFrom', [TEST_ADDRESS_1, TEST_ADDRESS_2], TX_OPTIONS)).to.be.rejectedWith(Error)
    })
  })

  describe('getApproved', () => {
    it('should return the account approved for tokenId token with txOptions', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('getApproved', [TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(FAKE_APPROVED_HRC721)
      const mockedResponse = await FAKE_APPROVED_HRC721

      const approved = await contract.call<string>('getApproved', [TOKEN_GOLD], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(approved).to.be.equals(mockedResponse)
    })

    it('should return the account approved for tokenId token without txOptions', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('getApproved', [TOKEN_GOLD])
      stub.resolves().returns(FAKE_APPROVED_HRC721)
      const mockedResponse = await FAKE_APPROVED_HRC721

      const approved = await contract.call<string>('getApproved', [TOKEN_GOLD])

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(approved).to.be.equals(mockedResponse)
    })

    it('should throw an error if tokenId is not provided', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('getApproved', [], TX_OPTIONS).onFirstCall().rejects()

      expect(contract.call<string>('getApproved', [], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is invalid', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('getApproved', [6], TX_OPTIONS).onFirstCall().rejects()

      expect(contract.call<string>('getApproved', [6], TX_OPTIONS)).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should return a boolean value if the operator is allowed to manage all of the assets of owner with txOptions', async () => {
      const stub = sinon
        .stub(contract, 'call')
        .withArgs('isApprovedForAll', [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], TX_OPTIONS)
      stub.resolves().returns(FAKE_IS_APPROVED_HRC721)
      const mockedResponse = await FAKE_IS_APPROVED_HRC721

      const approved = await contract.call('isApprovedForAll', [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(approved).to.be.equals(mockedResponse)
    })

    it('should return a boolean value if the operator is allowed to manage all of the assets of owner without txOptions', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('isApprovedForAll', [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS])
      stub.resolves().returns(FAKE_IS_APPROVED_HRC721)
      const mockedResponse = await FAKE_IS_APPROVED_HRC721

      const approved = await contract.call('isApprovedForAll', [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS])

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(approved).to.be.equals(mockedResponse)
    })

    it('should throw an error if addressOwner is not provided', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('isApprovedForAll', ['', EMPTY_TEST_ADDRESS], TX_OPTIONS).onFirstCall().rejects()

      expect(contract.call('isApprovedForAll', ['', EMPTY_TEST_ADDRESS], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('isApprovedForAll', [TEST_ADDRESS_1, ''], TX_OPTIONS).onFirstCall().rejects()

      expect(contract.call('isApprovedForAll', [TEST_ADDRESS_1, ''], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOwner is zero-address', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('isApprovedForAll', [AddressZero, EMPTY_TEST_ADDRESS]).onFirstCall().rejects()

      expect(contract.call('isApprovedForAll', [AddressZero, EMPTY_TEST_ADDRESS])).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is zero-address', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('isApprovedForAll', [TEST_ADDRESS_1, AddressZero]).onFirstCall().rejects()

      expect(contract.call('isApprovedForAll', [TEST_ADDRESS_1, AddressZero])).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      const stub = sinon.stub(contract, 'call')
      stub.withArgs('isApprovedForAll', ['', '']).onFirstCall().rejects()

      expect(contract.call('isApprovedForAll', ['', ''])).to.be.rejectedWith(Error)
    })
  })

  describe('setApprovalForAll', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('setApprovalForAll', [TEST_ADDRESS_1, true], TX_OPTIONS)
      stub.resolves()

      await contract.send('setApprovalForAll', [TEST_ADDRESS_1, true], TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if addressOperator is not provided', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('setApprovalForAll', ['', true], TX_OPTIONS)
      stub.rejects()

      expect(contract.send('setApprovalForAll', ['', true], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if approved is not provided', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('setApprovalForAll', [TEST_ADDRESS_1], TX_OPTIONS)
      stub.rejects()

      expect(contract.send('setApprovalForAll', [TEST_ADDRESS_1], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if txOptions are not provided', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('setApprovalForAll', [TEST_ADDRESS_1, true])
      stub.rejects()

      expect(contract.send('setApprovalForAll', [TEST_ADDRESS_1, true])).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('setApprovalForAll', [])
      stub.rejects()

      expect(contract.send('setApprovalForAll', [])).to.be.rejectedWith(Error)
    })
  })
})
