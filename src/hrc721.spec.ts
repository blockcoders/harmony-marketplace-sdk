import { TxStatus } from '@harmony-js/transaction'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC721 } from './hrc721'
import {
  HRC721_CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  TEST_ADDRESS_2,
  TEST_ADDRESS_3,
  EMPTY_TEST_ADDRESS,
  TOKEN_GOLD,
  TX_OPTIONS,
  FAKE_BALANCE_HRC721,
  FAKE_OWNER_HRC721,
  FAKE_APPROVED_HRC721,
  FAKE_IS_APPROVED_HRC721,
  FAKE_TX_HRC721,
  WALLET_PROVIDER_TEST_1,
  WALLET_PROVIDER_TEST_2,
  WALLET_PROVIDER_TEST_3,
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

  describe.skip('balanceOf', () => {
    it('should get the number of tokens in the specified account', async () => {
      const mockedBalance = await FAKE_BALANCE_HRC721
      const stub = sinon.stub(contract, 'balanceOf').withArgs(TEST_ADDRESS_1, TX_OPTIONS)
      stub.resolves().returns(FAKE_BALANCE_HRC721)
      const balance = await contract.balanceOf(TEST_ADDRESS_1, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(balance).to.be.equals(mockedBalance)
    })

    it('should throw an error if address is not provided', async () => {
      const stub = sinon.stub(contract, 'balanceOf')
      stub.withArgs('').onCall(0).rejects()

      expect(contract.balanceOf('')).to.be.rejectedWith(Error)
    })
  })

  describe.skip('ownerOf', () => {
    it('should return the owner of the tokenId token', async () => {
      const stub = sinon.stub(contract, 'ownerOf').withArgs(TOKEN_GOLD, TX_OPTIONS)
      stub.resolves().returns(FAKE_OWNER_HRC721)
      const owner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should return the owner of the tokenId token with tokenId as a string', async () => {
      const stub = sinon.stub(contract, 'ownerOf').withArgs(TOKEN_GOLD.toString(), TX_OPTIONS)
      stub.resolves().returns(FAKE_OWNER_HRC721)
      const owner = await contract.ownerOf(TOKEN_GOLD.toString(), TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should return the origin address of the tokenId token if the token has no owner', async () => {
      const stub = sinon.stub(contract, 'ownerOf').withArgs(TOKEN_GOLD, TX_OPTIONS)
      stub.resolves().returns(FAKE_OWNER_HRC721)
      const owner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should throw an error if tokenId is a non existent token', async () => {
      const stub = sinon.stub(contract, 'ownerOf')
      stub.withArgs('6').onCall(0).rejects()

      expect(contract.ownerOf('6')).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      const stub = sinon.stub(contract, 'ownerOf')
      stub.withArgs('').onCall(0).rejects()

      expect(contract.ownerOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('transferFrom', () => {
    it('should throw an error if there is no signer', () => {
      const stub = sinon.stub(contract, 'transferFrom')
      stub.withArgs('', TEST_ADDRESS_2, TOKEN_GOLD).onCall(0).rejects()

      expect(contract.transferFrom('', TEST_ADDRESS_2, TOKEN_GOLD)).to.be.rejectedWith(Error)
    })

    it.skip('should transfer the ownership of a token from one address to another', async () => {
      const owner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)

      expect(owner).to.equal(TEST_ADDRESS_1)
      expect(owner).to.not.equal(TEST_ADDRESS_2)

      const result = await contract.transferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD, TX_OPTIONS)

      expect(result.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result.receipt?.blockHash).to.be.string

      const newOwner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)

      expect(newOwner).to.equal(TEST_ADDRESS_2)
      expect(newOwner).to.not.equal(TEST_ADDRESS_1)

      // change the caller to the new owner
      contract.setSignerByPrivateKey(TEST_ADDRESS_2)

      // return the token
      const result2 = await contract.transferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)

      expect(result2.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result2.receipt?.blockHash).to.be.string

      const oldOwner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)

      expect(oldOwner).to.equal(TEST_ADDRESS_1)
      expect(oldOwner).to.not.equal(TEST_ADDRESS_2)
    })
  })

  describe('safeTransferFrom', () => {
    it('should throw if there is no signer', () => {
      const stub = sinon.stub(contract, 'safeTransferFrom')
      stub.withArgs(TEST_ADDRESS_1, TEST_ADDRESS_2, '1').onCall(0).rejects()

      expect(contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, '1')).to.be.rejectedWith(Error)
    })

    it.skip('should transfer the ownership of a token from one address to another', async () => {
      // const stubOwner = sinon.stub(contract, 'ownerOf').withArgs(TOKEN_GOLD, TX_OPTIONS)
      // stubOwner.resolves().returns(FAKE_OWNER_HRC721)

      const owner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)
      expect(owner).to.be.oneOf([TEST_ADDRESS_2, TEST_ADDRESS_3])
      console.log('1')
      const ownerAccount = [WALLET_PROVIDER_TEST_2, WALLET_PROVIDER_TEST_3].find(
        (account) => account.accounts[0] === owner,
      )
      const receiverAccount = [WALLET_PROVIDER_TEST_2, WALLET_PROVIDER_TEST_3].find(
        (account) => account.accounts[0] !== owner,
      )
      if (!ownerAccount || !receiverAccount) throw new Error('Account not found')
      console.log('2')
      // const stubSigner = sinon.stub(contract, 'setSignerByPrivateKey').withArgs(ownerAccount.privateKey)
      // stubSigner.resolves().returns()

      const ownerPk = ownerAccount.signer?.privateKey || ''
      contract.setSignerByPrivateKey(ownerPk)
      const result = await contract.safeTransferFrom(ownerAccount.accounts[0], receiverAccount.accounts[0], '5')

      expect(result.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result.receipt?.blockHash).to.be.string
    })
  })

  // TODO: add more tests when the approve function works
  describe('getApproved', () => {
    it('should return the account approved for tokenId token', async () => {
      const stub = sinon.stub(contract, 'getApproved').withArgs(TOKEN_GOLD, TX_OPTIONS)
      stub.resolves().returns(FAKE_APPROVED_HRC721)
      const mockedResponse = await FAKE_APPROVED_HRC721
      const approved = await contract.getApproved(TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(approved).to.be.equals(mockedResponse)
    })

    it('should throw an error if tokenId is not provided', async () => {
      const stub = sinon.stub(contract, 'getApproved')
      stub.withArgs('').onCall(0).rejects()

      expect(contract.getApproved('')).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should return a boolean value if the operator is allowed to manage all of the assets of owner', async () => {
      const stub = sinon.stub(contract, 'isApprovedForAll').withArgs(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, TX_OPTIONS)
      stub.resolves().returns(FAKE_IS_APPROVED_HRC721)
      const mockedResponse = await FAKE_IS_APPROVED_HRC721

      const approved = await contract.isApprovedForAll(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(approved).to.be.equals(mockedResponse)
    })

    it('should throw an error if addressOwner is not provided', async () => {
      const stub = sinon.stub(contract, 'isApprovedForAll')
      stub.withArgs('', EMPTY_TEST_ADDRESS).onCall(0).rejects()

      expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided', async () => {
      const stub = sinon.stub(contract, 'isApprovedForAll')
      stub.withArgs(TEST_ADDRESS_1, '').onCall(0).rejects()

      expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      const stub = sinon.stub(contract, 'isApprovedForAll')
      stub.withArgs('', '').onCall(0).rejects()

      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('setApprovalForAll', () => {
    it.skip('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'setApprovalForAll').withArgs(TEST_ADDRESS_2, true).onFirstCall()
      stub.resolves().returns(FAKE_TX_HRC721)
      const mockedResponse = await FAKE_TX_HRC721

      const approval = await contract.setApprovalForAll(TEST_ADDRESS_2, true)
      expect(stub.calledOnce).to.be.true
      expect(approval.txParams.from).to.be.equals(mockedResponse.txParams.from)
    })

    it('should throw an error if params are not provided', async () => {
      const stub = sinon.stub(contract, 'setApprovalForAll')
      stub.withArgs('', false).onCall(0).rejects()

      expect(contract.setApprovalForAll('', false)).to.be.rejectedWith(Error)
    })
  })
})
