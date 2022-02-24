"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicKey = void 0;
const account_1 = require("@harmony-js/account");
const key_1 = require("./key");
class MnemonicKey extends key_1.Key {
    constructor(url, options = {}, chainId) {
        super(url, chainId);
        let { mnemonic } = options;
        if (!mnemonic) {
            mnemonic = account_1.Wallet.generateMnemonic();
        }
        this.addByMnemonic(mnemonic, options.index || 0);
    }
}
exports.MnemonicKey = MnemonicKey;
//# sourceMappingURL=mnemonic-key.js.map