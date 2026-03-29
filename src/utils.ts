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

/**
 * Validates if a string is a valid Harmony ONE address (starts with 'one1' and is 42 chars).
 * @param address - The address to validate
 * @returns True if the address is valid
 */
export function isValidHarmonyAddress(address: string): boolean {
  return typeof address === 'string' && /^one1[a-z0-9]{39}$/i.test(address)
}

/**
 * Shortens a Harmony address for display purposes.
 * @param address - The full address to shorten
 * @param prefixLength - Number of characters to show at the start (default: 6)
 * @param suffixLength - Number of characters to show at the end (default: 4)
 * @returns The shortened address string
 * @example shortenAddress('one1qgh5reujgdjv4gkzu5h3sy0e9r6j5h3tyy3fgsu') // 'one1qgh...3fgsu'
 */
export function shortenAddress(address: string, prefixLength = 6, suffixLength = 4): string {
  if (!address || address.length <= prefixLength + suffixLength) {
    return address
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`
}

/**
 * Parses a human-readable token amount to the smallest unit (wei for ONE, etc.)
 * @param amount - The amount as a string or number (e.g., '1.5' or 1.5)
 * @param decimals - Number of decimal places (default: 18 for HRC20 tokens)
 * @returns The amount in the smallest unit as a BN
 */
export function parseTokenAmount(amount: string | number, decimals = 18): BN {
  const str = typeof amount === 'number' ? amount.toString() : amount
  const [whole, fraction = ''] = str.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  return new BN(whole + paddedFraction, 10)
}

/**
 * Formats a token amount from the smallest unit to a human-readable string.
 * @param amount - The amount as BN, bigint, string, or number
 * @param decimals - Number of decimal places (default: 18)
 * @param displayDecimals - Number of decimal places to show in output (default: 4)
 * @returns A human-readable string representation of the amount
 * @example formatTokenAmount('1500000000000000000', 18, 2) // '1.50'
 */
export function formatTokenAmount(amount: BNish, decimals = 18, displayDecimals = 4): string {
  const bn = BN.isBN(amount) ? amount : new BN(String(amount), 10)
  const divisor = new BN(10).pow(new BN(decimals))
  const whole = bn.div(divisor)
  const fraction = bn.mod(divisor)
  const fractionStr = fraction.toString(10).padStart(decimals, '0').slice(0, displayDecimals)
  const trimmedFraction = fractionStr.replace(/0+$/, '')
  return trimmedFraction ? `${whole.toString()}.${trimmedFraction}` : whole.toString()
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
