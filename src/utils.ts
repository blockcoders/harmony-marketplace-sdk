import { isArrayish, isHexString } from '@harmony-js/crypto'
import { Messenger, WSProvider, NewHeaders } from '@harmony-js/network'
import { ChainType, hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import { BNish } from './interfaces'

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

export function waitForNewBlock(
  expectedBlockNumber: number,
  rpc: string,
  chainType: ChainType,
  chainId: number,
): Promise<void> {
  const wsMessenger = new Messenger(new WSProvider(rpc), chainType, chainId)
  const newBlockSubscription = new NewHeaders(wsMessenger)

  return new Promise((res) => {
    newBlockSubscription.on('data', (data: any) => {
      const blockNumber = parseInt(hexToNumber(data.params.result.number), 10)

      if (blockNumber <= expectedBlockNumber) {
        console.log(`Currently at block ${blockNumber}, waiting for block ${expectedBlockNumber} to be confirmed`)
      } else {
        res()
      }
    })
  })
}
