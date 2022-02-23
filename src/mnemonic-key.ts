import { Wallet } from '@harmony-js/account'
import { ChainID } from '@harmony-js/utils'
import { RpcProviderType } from './interfaces'
import { Key } from './key'

interface MnemonicOptions {
  /**
   * Space-separated list of words for the mnemonic key.
   */
  mnemonic?: string

  /**
   * BIP44 index number
   */
  index?: number
}

/**
 * Implementation of the Wallet that uses a private key.
 */
export class MnemonicKey extends Key {
  constructor(url: RpcProviderType, options: MnemonicOptions = {}, chainId?: ChainID) {
    super(url, chainId)

    let { mnemonic } = options

    if (!mnemonic) {
      mnemonic = Wallet.generateMnemonic()
    }

    this.addByMnemonic(mnemonic, options.index || 0)
  }
}
