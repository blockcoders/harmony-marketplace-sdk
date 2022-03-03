import { Wallet, HDNode } from '@harmony-js/account'
import { bip39, hdkey } from '@harmony-js/crypto'
import { ChainID, HDPath, ChainType } from '@harmony-js/utils'
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

    this._addByMnemonic(mnemonic, options.index || 0, options.defaultPath, options.addresses)
  }

  private _addByMnemonic(phrase: string, index = 0, defaultPath = '1023', addresses = 1) {
    if (!HDNode.isValidMnemonic(phrase)) {
      throw new Error(`Invalid mnemonic phrase: ${phrase}`)
    }
    const privateKeys: string[] = []

    const seed = bip39.mnemonicToSeed(phrase)
    const hdKey = hdkey.fromMasterSeed(seed)
    const path = this.messenger.chainType === ChainType.Harmony ? '1023' : defaultPath

    for (let i = 0; i < addresses; i++) {
      const childKey =
        path !== '1023' || index !== 0
          ? hdKey.derive(`m/44'/${path}'/0'/0/${index + i}`)
          : hdKey.derive(`${HDPath}${index}`)
      const privateKey = `0x${childKey.privateKey.toString('hex')}`
      privateKeys.push(privateKey)
    }

    return this.addByPrivateKey(privateKeys[0])
  }
}
