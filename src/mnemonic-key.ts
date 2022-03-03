import { Wallet, HDNode } from '@harmony-js/account'
import { bip39, hdkey } from '@harmony-js/crypto'
import { ChainID, HDPath } from '@harmony-js/utils'
import { MnemonicOptions, RpcProviderType } from './interfaces'
import { Key } from './key'

/**
 * Implementation of the Wallet that uses a list of words for the mnemonic key.
 */
export class MnemonicKey extends Key {
  constructor(url: RpcProviderType, options: MnemonicOptions, chainId?: ChainID) {
    super(url, chainId)

    let { mnemonic } = options

    if (!mnemonic) {
      mnemonic = Wallet.generateMnemonic()
    }

    this._addByMnemonic(mnemonic, options)
  }

  private _addByMnemonic(
    phrase: string,
    { index = 0, derivationPath = HDPath, numberOfAddresses = 1 }: MnemonicOptions,
  ) {
    if (!HDNode.isValidMnemonic(phrase)) {
      throw new Error(`Invalid mnemonic phrase: ${phrase}`)
    }

    const seed = bip39.mnemonicToSeed(phrase)
    const hdKey = hdkey.fromMasterSeed(seed)

    for (let i = 0; i < numberOfAddresses; i++) {
      const childKey = hdKey.derive(`${derivationPath}${index + i}`)
      const privateKey = childKey.privateKey.toString('hex')
      this.addByPrivateKey(privateKey)
    }
  }
}
