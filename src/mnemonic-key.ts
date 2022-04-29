import { Wallet } from '@harmony-js/account'
import { ChainID, ChainType } from '@harmony-js/utils'
import { MnemonicOptions, RpcProviderType } from './interfaces'
import { Key } from './key'

/**
 * Implementation of the Wallet that uses a list of words for the mnemonic key.
 */
export class MnemonicKey extends Key {
  constructor(url: RpcProviderType, options: MnemonicOptions, chainId?: ChainID, chainType?: ChainType) {
    super(url, chainId, chainType)

    const { mnemonic = Wallet.generateMnemonic(), index = 0 } = options

    this.addByMnemonic(mnemonic, index)
  }
}
