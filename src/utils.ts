import { isArrayish, isHexString } from '@harmony-js/crypto'
import BN from 'bn.js'
import { BNish } from './interfaces'
import { Messenger, WSProvider, NewHeaders } from '@harmony-js/network'
import { ChainID, ChainType, hexToNumber } from '@harmony-js/utils'
import { HARMONY_RPC_DEVNET_WS, HARMONY_RPC_WS, NetworkInfo } from './constants'

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

export function waitForNewBlock(expectedBlockNumber: number, RPC: string, chainType: ChainType, chainId: number): Promise<void> {
  const wsMessenger = new Messenger(new WSProvider(RPC), chainType, chainId)
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

export const getRpc = (network: NetworkInfo) => {
  switch (network) {
    case NetworkInfo.MAINNET:
      return HARMONY_RPC_WS
    case NetworkInfo.DEVNET:
      return HARMONY_RPC_DEVNET_WS
    default:
      throw Error('Invalid network')
  }
}

export const getChainId = (network: NetworkInfo) => {
  switch (network) {
    case NetworkInfo.MAINNET:
      return ChainID.HmyMainnet
    case NetworkInfo.DEVNET:
      return 4
    default:
      throw Error('Invalid network')
  }
}