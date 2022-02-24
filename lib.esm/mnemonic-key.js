import { Wallet } from '@harmony-js/account';
import { Key } from './key';
export class MnemonicKey extends Key {
    constructor(url, options = {}, chainId) {
        super(url, chainId);
        let { mnemonic } = options;
        if (!mnemonic) {
            mnemonic = Wallet.generateMnemonic();
        }
        this.addByMnemonic(mnemonic, options.index || 0);
    }
}
//# sourceMappingURL=mnemonic-key.js.map