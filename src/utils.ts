import { Networkish } from '@ethersproject/networks'
import { isArrayish, isHexString } from '@harmony-js/crypto'
import BN from 'bn.js'
import { ethers } from 'ethers'
import { BLOCKS_TO_WAIT } from './constants'
import { BNish } from './interfaces'
const { JsonRpcProvider } = ethers.providers

export function isBNish(value: any): value is BNish {
  return (
    value != null &&
    (BN.isBN(value) ||
      (typeof value === 'number' && value % 1 === 0) ||
      (typeof value === 'string' && !!value.match(/^-?[0-9]+$/)) ||
      isHexString(value) ||
      typeof value === 'bigint' ||
      isArrayish(value))
  )
}

export async function waitForNewBlocks(url: string, network: Networkish): Promise<void> {
  const provider = new JsonRpcProvider(url, network)
  const blockNumber = await provider.getBlockNumber()
  new Promise<void>((resolve, reject) => {
    try {
      provider.on('block', async () => {
        const currentBlock = await provider.getBlockNumber()
        if (currentBlock >= blockNumber + BLOCKS_TO_WAIT) resolve()
      })
    } catch (error) {
      reject(error)
    }
  })
}
