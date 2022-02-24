import { Wallet } from '@harmony-js/account'
import { ChainID } from '@harmony-js/utils'
import { MnemonicOptions, RpcProviderType } from './interfaces'
import { Key } from './key'

/**
 * Implementation of the Wallet that uses a list of words for the mnemonic key.
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
