import BN from 'bn.js'
import { HRC1155 } from './hrc1155'

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
