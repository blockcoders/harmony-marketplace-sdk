import { TxStatus } from '@harmony-js/transaction'
import BN from 'bn.js'
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

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account', async () => {
      const balance = await contract.balanceOf(TEST_ADDRESS_1, TX_OPTIONS)

      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.an.instanceof(BN)
      expect(balance.gt(new BN(0))).to.be.true
    })

    it('should throw an error if address is not provided', async () => {
      expect(contract.balanceOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('ownerOf', () => {
    it('should return the owner of the tokenId token', async () => {
      const owner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)

      expect(owner).to.not.be.null
      expect(owner).to.not.be.undefined
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should return the owner of the tokenId token with tokenId as a string', async () => {
      const owner = await contract.ownerOf(TOKEN_GOLD.toString(), TX_OPTIONS)

      expect(owner).to.not.be.null
      expect(owner).to.not.be.undefined
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should return the origin address of the tokenId token if the token has no owner', async () => {
      const owner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)

      expect(owner).to.not.be.null
      expect(owner).to.not.be.undefined
      expect(owner).to.be.equals(TEST_ADDRESS_1)
    })

    it('should throw an error if tokenId is a non existent token', async () => {
      expect(contract.ownerOf('6')).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.ownerOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('transferFrom', () => {
    it('should throw an error if there is no signer', () => {
      expect(contract.transferFrom('', TEST_ADDRESS_1, TOKEN_GOLD)).to.be.rejectedWith(Error)
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

  describe.skip('safeTransferFrom', () => {
    it('should throw if there is no signer', () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, '1')).to.be.rejectedWith(Error)
    })

    it('should transfer the ownership of a token from one address to another', async () => {
      const owner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)
      expect(owner).to.be.oneOf([TEST_ADDRESS_2, TEST_ADDRESS_3])

      const ownerAccount = [WALLET_PROVIDER_TEST_2, WALLET_PROVIDER_TEST_3].find(
        (account) => account.accounts[0] === owner,
      )
      const receiverAccount = [WALLET_PROVIDER_TEST_2, WALLET_PROVIDER_TEST_3].find(
        (account) => account.accounts[0] !== owner,
      )
      if (!ownerAccount || !receiverAccount) throw new Error('Account not found')

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
      const approved = await contract.getApproved(TOKEN_GOLD, TX_OPTIONS)

      expect(approved).to.not.be.null
      expect(approved).to.not.be.undefined
      expect(approved).to.be.equals('0x0000000000000000000000000000000000000000')
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.getApproved('')).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should return a boolean value if the operator is allowed to manage all of the assets of owner', async () => {
      const approved = await contract.isApprovedForAll(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, TX_OPTIONS)

      expect(approved).to.not.be.null
      expect(approved).to.not.be.undefined
      expect(approved).to.be.equals(false)
    })

    it('should throw an error if addressOwner is not provided', async () => {
      expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided', async () => {
      expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('setApprovalForAll', () => {
    it('should throw an error if params are not provided', async () => {
      expect(contract.setApprovalForAll('', false)).to.be.rejectedWith(Error)
    })
  })
})
