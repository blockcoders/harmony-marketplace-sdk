import { Network, Networkish } from '@ethersproject/networks'
import { logger } from './logger'

export interface NetworkWithUrl extends Network {
  url: string
}

export const HARMONY_NETWORK: Network = {
  name: 'harmony',
  chainId: parseInt(Buffer.from('mainnet').toString('hex'), 16),
}

export const HARMONY_TESTNET_NETWORK: Network = {
  name: 'harmonytestnet',
  chainId: parseInt(Buffer.from('testnet').toString('hex'), 16),
}

const networks: { [name: string]: Network } = {
  harmony: HARMONY_NETWORK,
  harmonytestnet: HARMONY_TESTNET_NETWORK,
}

export function getNetwork(_network?: Networkish): Network | undefined {
  if (!_network) {
    return undefined
  }

  if (typeof _network === 'number') {
    for (const name in networks) {
      const network = networks[name]
      if (network.chainId === _network) {
        return network
      }
    }

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
