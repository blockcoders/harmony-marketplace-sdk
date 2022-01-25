import { Network, Networkish } from '@ethersproject/networks'
import { logger } from './logger'

export interface NetworkWithUrl extends Network {
  url: string
}

export const HARMONY_NETWORK = 'https://api.harmony.one'

export const HARMONY_TESTNET_NETWORK = 'https://api.s0.b.hmny.io'

const networks: { [name: string]: Networkish } = {
  harmony: HARMONY_NETWORK,
  harmonytestnet: HARMONY_TESTNET_NETWORK,
}

export function getNetwork(_network?: Networkish): Networkish | undefined {
  if (!_network) {
    return undefined
  }

  if (typeof _network === 'number') {
    return {
      name: 'unknown',
      chainId: _network,
    }
  }

  if (typeof _network === 'string') {
    const network = networks[_network]

    if (!network) {
      return undefined
    }

    return network
  }

  const network = networks[_network.name]

  if (!network) {
    logger.throwArgumentError('Invalid harmony network.', 'network', network)
  }

  return network
}
