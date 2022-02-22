import { TxStatus } from '@harmony-js/transaction'
import { ChainID } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC721 } from './hrc721'
import { HarmonyShards } from './interfaces'
import { PrivateKey } from './private-key'
import {
  HRC721_CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  TEST_ACCOUNT_1,
  RESULT_ORIGIN_ADDRESS,
  TEST_ACCOUNT_2,
  TEST_ACCOUNT_3,
  EMPTY_TEST_ADDRESS,
  HRC721_TOKEN_GOLD,
} from './tests/constants'
import { ABI } from './tests/contracts/HR721/abi'

describe.only('HRC721 Contract Interface', () => {
  use(chaiAsPromised)

  let contract: HRC721
  let provider: PrivateKey

  before(() => {
    provider = new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)
    contract = new HRC721(HRC721_CONTRACT_ADDRESS, ABI, provider)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account', async () => {
      const balance = await contract.balanceOf(TEST_ADDRESS_1)

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
      const owner = await contract.ownerOf('1')

      expect(owner).to.not.be.null
      expect(owner).to.not.be.undefined
      expect(owner.toLowerCase()).to.be.equals(TEST_ADDRESS_1.toLowerCase())
    })

    it('should return the origin address of the tokenId token if the token has no owner', async () => {
      const owner = await contract.ownerOf('0')

      expect(owner).to.not.be.null
      expect(owner).to.not.be.undefined
      expect(owner).to.be.equals(RESULT_ORIGIN_ADDRESS)
    })

    it('should throw an error if tokenId is a non existent token', async () => {
      expect(contract.ownerOf('6')).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.ownerOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('transferFrom', () => {
    it('should throw if there is no signer', () => {
      expect(contract.transferFrom(TEST_ADDRESS_1, TEST_ADDRESS_1, '1')).to.be.rejectedWith(Error)
    })

    it.only('should transfer the ownership of a token from one address to another', async () => {
      const owner = await contract.ownerOf(HRC721_TOKEN_GOLD)

      const ownerAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address === owner)
      const receiverAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address !== owner)
      if (!ownerAccount || !receiverAccount) throw new Error('Owner or receiver not found')

      contract.setSignerByPrivateKey(ownerAccount.privateKey)
      const result = await contract.transferFrom(ownerAccount.address, receiverAccount.address, '5')

      expect(result.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result.receipt?.blockHash).to.be.string
    })
  })

  describe.skip('safeTransferFrom', () => {
    it('should throw if there is no signer', () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_1, '1')).to.be.rejectedWith(Error)
    })

    it('should transfer the ownership of a token from one address to another', async () => {
      const owner = await contract.ownerOf('5')
      expect(owner).to.be.oneOf([TEST_ACCOUNT_2.address, TEST_ACCOUNT_3.address])

      const ownerAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address === owner)
      const receiverAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address !== owner)
      if (!ownerAccount || !receiverAccount) throw new Error('Account not found')

      contract.setSignerByPrivateKey(ownerAccount.privateKey)
      const result = await contract.safeTransferFrom(ownerAccount.address, receiverAccount.address, '5')

      expect(result.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result.receipt?.blockHash).to.be.string
    })
  })

  // TODO: add more tests when the approve function works
  describe('getApproved', () => {
    it('should return the account approved for tokenId token', async () => {
      const approved = await contract.getApproved('1')

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
      const approved = await contract.isApprovedForAll(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS)

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
