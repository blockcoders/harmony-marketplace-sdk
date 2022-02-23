import { ChainID } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { GameItems } from './game-item'
import { HarmonyShards } from './interfaces'
import { PrivateKey } from './private-key'
import { HRC1155_CONTRACT_ADDRESS, TEST_ACCOUNT_1 } from './tests/constants'
import { ABI } from './tests/contracts/GameItems/abi'

describe('Game Item Provider', () => {
  use(chaiAsPromised)

  let contract: GameItems
  let provider: PrivateKey

  before(() => {
    provider = new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)
    contract = new GameItems(HRC1155_CONTRACT_ADDRESS, ABI, provider)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('getGold', () => {
    it('should get the id of gold item', async () => {
      const gold = await contract.getGold()
      expect(gold).to.exist
      expect(gold).to.not.be.null
      expect(gold).to.not.undefined
      expect(gold).to.be.equals(0)
    })

    it('should throw an error if something went wrong', async () => {
      expect(contract.getGold()).to.be.rejectedWith(Error)
    })
  })

  describe('getSilver', () => {
    it('should get the id of silver item', async () => {
      const silver = await contract.getSilver()
      expect(silver).to.exist
      expect(silver).to.not.be.null
      expect(silver).to.not.undefined
      expect(silver).to.be.equals(1)
    })

    it('should throw an error if something went wrong', async () => {
      expect(contract.getSilver()).to.be.rejectedWith(Error)
    })
  })

  describe('getThorsHammer', () => {
    it('should get the id of thors hammer item', async () => {
      const thors = await contract.getThorsHammer()
      expect(thors).to.exist
      expect(thors).to.not.be.null
      expect(thors).to.not.undefined
      expect(thors).to.be.equals(2)
    })

    it('should throw an error if something went wrong', async () => {
      expect(contract.getThorsHammer()).to.be.rejectedWith(Error)
    })
  })

  describe('getSword', () => {
    it('should get the id of sword item', async () => {
      const sword = await contract.getSword()
      expect(sword).to.exist
      expect(sword).to.not.be.null
      expect(sword).to.not.undefined
      expect(sword).to.be.equals(3)
    })

    it('should throw an error if something went wrong', async () => {
      expect(contract.getSword()).to.be.rejectedWith(Error)
    })
  })

  describe('getShield', () => {
    it('should get the id of shield item', async () => {
      const shield = await contract.getShield()
      expect(shield).to.exist
      expect(shield).to.not.be.null
      expect(shield).to.not.undefined
      expect(shield).to.be.equals(4)
    })

    it('should throw an error if something went wrong', async () => {
      expect(contract.getShield()).to.be.rejectedWith(Error)
    })
  })
})
