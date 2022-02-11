import { Harmony } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC1155 } from './hrc1155'
import { HRC1155_CONTRACT_ABI, HRC1155_CONTRACT_ADDRESS, TEST_ADDRESS_1, HARMONY_TESTNET } from './tests/constants'

describe('HRC1155 Provider', () => {
  const client = new Harmony(HARMONY_TESTNET, {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  })
  let provider: HRC1155
  use(chaiAsPromised)

  beforeEach(async () => {
    provider = new HRC1155(HRC1155_CONTRACT_ADDRESS, HRC1155_CONTRACT_ABI, client)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account with id as a number', async () => {
      const balance = await provider.balanceOf(TEST_ADDRESS_1, 1)
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(100000100)
    })

    it('should get the number of tokens in the specified account with id as a string', async () => {
      const balance = await provider.balanceOf(TEST_ADDRESS_1, '1')
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(100000100)
    })

    it('should get the number of tokens in the specified account with id as a byte', async () => {
      const balance = await provider.balanceOf(TEST_ADDRESS_1, '00000001')
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(100000100)
    })

    it('should throw an error if address is not provided', async () => {
      expect(provider.balanceOf('', 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if id is not provided', async () => {
      expect(provider.balanceOf(TEST_ADDRESS_1, 0)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(provider.balanceOf('', 0)).to.be.rejectedWith(Error)
    })
  })
})
