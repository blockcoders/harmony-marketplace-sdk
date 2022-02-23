import { ChainID } from '@harmony-js/utils'
import { RpcProviderType } from './interfaces'
import { Key } from './key'

/**
 * Implementation of the Wallet that uses a private key.
 */
export class PrivateKey extends Key {
  constructor(url: RpcProviderType, privateKey: string, chainId?: ChainID) {
    super(url, chainId)

    this.addByPrivateKey(privateKey)
  }
}
