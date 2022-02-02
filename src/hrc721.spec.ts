import { Harmony } from '@harmony-js/core'
import { TxStatus } from '@harmony-js/transaction'
import { ChainID, ChainType } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC721 } from './hrc721'
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  RESULT_TEST_ADDRESS,
  RESULT_ORIGIN_ADDRESS,
  TEST_ACCOUNT_2,
  TEST_ACCOUNT_3,
  EMPTY_TEST_ADDRESS,
} from './tests/constants'

describe('HarmonyProvider', () => {
  const client = new Harmony('https://api.s0.b.hmny.io/', {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  })
  let provider: HRC721
  use(chaiAsPromised)

  beforeEach(async () => {
    provider = new HRC721(CONTRACT_ADDRESS, CONTRACT_ABI, client)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account', async () => {
      const balance = await provider.balanceOf(TEST_ADDRESS_1)
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(4)
    }).timeout(5000)

    it('should throw an error if address is not provided', async () => {
      expect(provider.balanceOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('ownerOf', () => {
    it('should return the owner of the tokenId token', async () => {
      const owner = await provider.ownerOf('1')
      expect(owner).to.exist
      expect(owner).to.not.be.null
      expect(owner).to.not.be.undefined
      expect(owner).to.be.equals(RESULT_TEST_ADDRESS)
    }).timeout(5000)

    it('should return the origin address of the tokenId token if the token has no owner', async () => {
      const owner = await provider.ownerOf('0')
      expect(owner).to.exist
      expect(owner).to.not.be.null
      expect(owner).to.not.be.undefined
      expect(owner).to.be.equals(RESULT_ORIGIN_ADDRESS)
    }).timeout(5000)

    it('should throw an error if tokenId is a non existent token', async () => {
      expect(provider.ownerOf('6')).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(provider.ownerOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('transferFrom', () => {
    it('should throw if there is no signer', () => {
      expect(provider.transferFrom(TEST_ADDRESS_1, RESULT_TEST_ADDRESS, '1')).to.be.rejectedWith(Error)
    })

    it('should transfer the ownership of a token from one address to another', async () => {
      const owner = await provider.ownerOf('5')

      const ownerAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address === owner)
      const receiverAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address !== owner)
      if (!ownerAccount || !receiverAccount) throw new Error('Owner or receiver not found')

      provider.setSignerByPrivateKey(ownerAccount.privateKey)
      const result = await provider.transferFrom(ownerAccount.address, receiverAccount.address, '5')

      expect(result.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result.receipt).to.exist
      expect(result.receipt?.blockHash).to.be.string
    })
  })

  describe.skip('safeTransferFrom', () => {
    it('should throw if there is no signer', () => {
      expect(provider.safeTransferFrom(TEST_ADDRESS_1, RESULT_TEST_ADDRESS, '1')).to.be.rejectedWith(Error)
    })

    it('should transfer the ownership of a token from one address to another', async () => {
      const owner = await provider.ownerOf('5')
      expect(owner).to.be.oneOf([TEST_ACCOUNT_2.address, TEST_ACCOUNT_3.address])

      const ownerAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address === owner)
      const receiverAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address !== owner)
      if (!ownerAccount || !receiverAccount) throw new Error('Account not found')

      provider.setSignerByPrivateKey(ownerAccount.privateKey)
      const result = await provider.safeTransferFrom(ownerAccount.address, receiverAccount.address, '5')

      expect(result.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result.receipt).to.exist
      expect(result.receipt?.blockHash).to.be.string
    })
  })

  // TODO: add more tests when the approve function works
  describe('getApproved', () => {
    it('should return the account approved for tokenId token', async () => {
      const approved = await provider.getApproved('1')
      expect(approved).to.exist
      expect(approved).to.not.be.null
      expect(approved).to.not.be.undefined
      expect(approved).to.be.equals('0x0000000000000000000000000000000000000000')
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(provider.getApproved('')).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should return a boolean value if the operator is allowed to manage all of the assets of owner', async () => {
      const approved = await provider.isApprovedForAll(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS)
      expect(approved).to.exist
      expect(approved).to.not.be.null
      expect(approved).to.not.be.undefined
      expect(approved).to.be.equals(false)
    }).timeout(5000)

    it('should throw an error if addressOwner is not provided', async () => {
      expect(provider.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided', async () => {
      expect(provider.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(provider.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('setApprovalForAll', () => {
    it('should throw an error if params are not provided', async () => {
      expect(provider.setApprovalForAll('', false)).to.be.rejectedWith(Error)
    })
  })
})
