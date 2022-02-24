"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicKey = void 0;
var account_1 = require("@harmony-js/account");
var key_1 = require("./key");
var MnemonicKey = (function (_super) {
    __extends(MnemonicKey, _super);
    function MnemonicKey(url, options, chainId) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, url, chainId) || this;
        var mnemonic = options.mnemonic;
        if (!mnemonic) {
            mnemonic = account_1.Wallet.generateMnemonic();
        }
        _this.addByMnemonic(mnemonic, options.index || 0);
        return _this;
    }
    return MnemonicKey;
}(key_1.Key));
exports.MnemonicKey = MnemonicKey;
//# sourceMappingURL=mnemonic-key.js.map