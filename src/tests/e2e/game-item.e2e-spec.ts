import { ChainID } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { HRC1155 } from '../../contracts'
import { HarmonyShards } from '../../interfaces'
import { Key } from '../../wallets'
import {
  ContractName,
  WALLET_HMY_MASTER,
  E2E_TX_OPTIONS,
  TOKEN_GOLD,
  TOKEN_SHIELD,
  TOKEN_SILVER,
  TOKEN_SWORD,
  TOKEN_THORS_HAMMER,
} from '../constants'
import { deployContract } from '../helpers'

use(chaiAsPromised)

export class GameItems extends HRC1155 {
  async getGold(): Promise<number> {
    const gold = await this.call<BN>('GOLD', [], E2E_TX_OPTIONS)
    return gold.toNumber()
  }

  async getSilver(): Promise<number> {
    const silver = await this.call<BN>('SILVER', [], E2E_TX_OPTIONS)
    return silver.toNumber()
  }

  async getThorsHammer(): Promise<number> {
    const thors = await this.call<BN>('THORS_HAMMER', [], E2E_TX_OPTIONS)
    return thors.toNumber()
  }

  async getSword(): Promise<number> {
    const sword = await this.call<BN>('SWORD', [], E2E_TX_OPTIONS)
    return sword.toNumber()
  }

  async getShield(): Promise<number> {
    const shield = await this.call<BN>('SHIELD', [], E2E_TX_OPTIONS)
    return shield.toNumber()
  }
}

describe('Game Item Contract Extension', () => {
  let contract: GameItems
  let provider: Key

  before(async () => {
    const { addr, abi } = await deployContract(ContractName.GameItems, WALLET_HMY_MASTER)

    provider = new Key(HarmonyShards.SHARD_0_DEVNET, ChainID.HmyPangaea)
    contract = new GameItems(addr, abi, provider)
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
  })

  describe('getSilver', () => {
    it('should get the id of silver item', async () => {
      const silver = await contract.getSilver()
      expect(silver).to.exist
      expect(silver).to.not.be.null
      expect(silver).to.not.undefined
      expect(silver).to.be.equals(TOKEN_SILVER)
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
  })

  describe('getSword', () => {
    it('should get the id of sword item', async () => {
      const sword = await contract.getSword()
      expect(sword).to.exist
      expect(sword).to.not.be.null
      expect(sword).to.not.undefined
      expect(sword).to.be.equals(TOKEN_SWORD)
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
  })
})
