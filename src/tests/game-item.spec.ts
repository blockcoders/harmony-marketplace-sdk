import { ChainID } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC1155 } from '../contracts'
import { HarmonyShards } from '../interfaces'
import { Key } from '../wallets'
import {
  HRC1155_CONTRACT_ADDRESS,
  TOKEN_GOLD,
  TOKEN_SILVER,
  TOKEN_THORS_HAMMER,
  TOKEN_SWORD,
  TOKEN_SHIELD,
} from './constants'
import { ABI } from './contracts/GameItems/abi'

use(chaiAsPromised)

export class GameItems extends HRC1155 {
  async getGold(): Promise<number> {
    const gold = await this.call<BN>('GOLD')
    return gold.toNumber()
  }

  async getSilver(): Promise<number> {
    const silver = await this.call<BN>('SILVER')
    return silver.toNumber()
  }

  async getThorsHammer(): Promise<number> {
    const thors = await this.call<BN>('THORS_HAMMER')
    return thors.toNumber()
  }

  async getSword(): Promise<number> {
    const sword = await this.call<BN>('SWORD')
    return sword.toNumber()
  }

  async getShield(): Promise<number> {
    const shield = await this.call<BN>('SHIELD')
    return shield.toNumber()
  }
}

describe('Game Item Contract Extension', () => {
  let contract: GameItems
  let provider: Key

  before(() => {
    provider = new Key(HarmonyShards.SHARD_0_TESTNET, ChainID.HmyTestnet)
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
      expect(gold).to.be.equals(TOKEN_GOLD)
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
      expect(silver).to.be.equals(TOKEN_SILVER)
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
      expect(thors).to.be.equals(TOKEN_THORS_HAMMER)
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
      expect(sword).to.be.equals(TOKEN_SWORD)
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
      expect(shield).to.be.equals(TOKEN_SHIELD)
    })

    it('should throw an error if something went wrong', async () => {
      expect(contract.getShield()).to.be.rejectedWith(Error)
    })
  })
})
