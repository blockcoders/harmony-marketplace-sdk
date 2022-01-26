import { Harmony } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC721 } from './hrc721'
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  TEST_ADDRESS,
  RESULT_TEST_ADDRESS,
  RESULT_ORIGIN_ADDRESS,
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
      const balance = await provider.balanceOf(TEST_ADDRESS)
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(3)
    }).timeout(5000)

    it('should throw an error if address is not provided', async () => {
      expect(provider.balanceOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('ownerOf', () => {
    it('should return the owner of the tokenId token.', async () => {
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
})
