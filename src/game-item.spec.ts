import { Harmony } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { GameItems } from './game-item'
import { HRC1155_CONTRACT_ABI, HRC1155_CONTRACT_ADDRESS, HARMONY_TESTNET } from './tests/constants'

describe('Game Item Provider', () => {
  const client = new Harmony(HARMONY_TESTNET, {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  })
  let provider: GameItems
  use(chaiAsPromised)

  beforeEach(async () => {
    provider = new GameItems(HRC1155_CONTRACT_ADDRESS, HRC1155_CONTRACT_ABI, client)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('getGold', () => {
    it('should get the id of gold item', async () => {
      const gold = await provider.getGold()
      expect(gold).to.exist
      expect(gold).to.not.be.null
      expect(gold).to.not.undefined
      expect(gold).to.be.equals(0)
    })

    it('should throw an error if somethings went wrong', async () => {
      expect(provider.getGold()).to.be.rejectedWith(Error)
    })
  })

  describe('getSilver', () => {
    it('should get the id of silver item', async () => {
      const silver = await provider.getSilver()
      expect(silver).to.exist
      expect(silver).to.not.be.null
      expect(silver).to.not.undefined
      expect(silver).to.be.equals(1)
    })

    it('should throw an error if somethings went wrong', async () => {
      expect(provider.getSilver()).to.be.rejectedWith(Error)
    })
  })

  describe('getThorsHammer', () => {
    it('should get the id of thors hammer item', async () => {
      const thors = await provider.getThorsHammer()
      expect(thors).to.exist
      expect(thors).to.not.be.null
      expect(thors).to.not.undefined
      expect(thors).to.be.equals(2)
    })

    it('should throw an error if somethings went wrong', async () => {
      expect(provider.getThorsHammer()).to.be.rejectedWith(Error)
    })
  })

  describe('getSword', () => {
    it('should get the id of sword item', async () => {
      const sword = await provider.getSword()
      expect(sword).to.exist
      expect(sword).to.not.be.null
      expect(sword).to.not.undefined
      expect(sword).to.be.equals(3)
    })

    it('should throw an error if somethings went wrong', async () => {
      expect(provider.getSword()).to.be.rejectedWith(Error)
    })
  })

  describe('getShield', () => {
    it('should get the id of shield item', async () => {
      const shield = await provider.getShield()
      expect(shield).to.exist
      expect(shield).to.not.be.null
      expect(shield).to.not.undefined
      expect(shield).to.be.equals(4)
    })

    it('should throw an error if somethings went wrong', async () => {
      expect(provider.getShield()).to.be.rejectedWith(Error)
    })
  })
})
