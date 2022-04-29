import { ChainID, ChainType } from '@harmony-js/utils'
import { RpcProviderType } from './interfaces'
import { Key } from './key'

/**
 * Implementation of the Wallet that uses a private key.
 */
export class PrivateKey extends Key {
  constructor(url: RpcProviderType, privateKey: string, chainId?: ChainID, chainType?: ChainType) {
    super(url, chainId, chainType)

    this.addByPrivateKey(privateKey)
  }
}
