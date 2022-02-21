import { Logger } from '@ethersproject/logger'
import { Contract } from '@harmony-js/contract'
import { Harmony } from '@harmony-js/core'
import { HRC1155 } from './hrc1155'
import { logger } from './logger'

export class GameItems extends HRC1155 {
  private gameContract: Contract
  constructor(address: string, abi: any, private harmony: Harmony) {
    super(address, abi, harmony)
    this.gameContract = this.harmony.contracts.createContract(abi, address)
  }

  async getGold(): Promise<number> {
    try {
      const gold = await this.gameContract.methods.GOLD().call()
      return gold.toNumber()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'getGold',
        error,
      })
    }
  }

  async getSilver(): Promise<number> {
    try {
      const silver = await this.gameContract.methods.SILVER().call()
      return silver.toNumber()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'getGold',
        error,
      })
    }
  }

  async getThorsHammer(): Promise<number> {
    try {
      const thors = await this.gameContract.methods.THORS_HAMMER().call()
      return thors.toNumber()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'getGold',
        error,
      })
    }
  }

  async getSword(): Promise<number> {
    try {
      const sword = await this.gameContract.methods.SWORD().call()
      return sword.toNumber()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'getGold',
        error,
      })
    }
  }

  async getShield(): Promise<number> {
    try {
      const shield = await this.gameContract.methods.SHIELD().call()
      return shield.toNumber()
    } catch (error) {
      return logger.throwError('bad result from backend', Logger.errors.SERVER_ERROR, {
        method: 'getGold',
        error,
      })
    }
  }
}
