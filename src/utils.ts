import { isArrayish, isHexString } from '@harmony-js/crypto'
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
