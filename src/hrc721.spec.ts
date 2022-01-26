import { Harmony } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC721, BaseError } from './hrc721'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './tests/constants'

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
      const balance = await provider.balanceOf('0x36f41b8a79eca329610d6158f3ea9676bec281b9')
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(0)
    }).timeout(5000)

    it('should throw an error if address is not provided', async () => {
      expect(provider.balanceOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('ownerOf', () => {
    it('should returns the owner of the tokenId token.', async () => {
      const owner = await provider.ownerOf('1')
      expect(owner).to.exist
      expect(owner).to.not.be.null
      expect(owner).to.not.be.undefined
      expect(owner).to.be.equals('0x7C61c8F282Aeaae3E0476d0533D21dC42C5Aa146')
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(provider.ownerOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('BaseError', () => {
    it('should be an instance of Error', () => {
      const type = 'METHOD_NOT_FOUND'
      const code = 32601
      const data = 'invalid method'
      const error = new BaseError('Method not found', type, code, data)

      expect(error).to.be.an.instanceof(Error)
      expect(error.name).to.be.eq(BaseError.name)
      expect(error.type).to.be.eq(type)
      expect(error.code).to.be.eq(code)
      expect(error.data).to.be.eq(data)
    })
  })
})
