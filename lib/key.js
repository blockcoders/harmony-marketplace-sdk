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
exports.Key = void 0;
var account_1 = require("@harmony-js/account");
var network_1 = require("@harmony-js/network");
var utils_1 = require("@harmony-js/utils");
var constants_1 = require("./constants");
var interfaces_1 = require("./interfaces");
var Key = (function (_super) {
    __extends(Key, _super);
    function Key(url, chainId) {
        if (chainId === void 0) { chainId = utils_1.ChainID.HmyMainnet; }
        var _this = this;
        var chainType = utils_1.ChainType.Harmony;
        var chain = chainId;
        var provider;
        if (Object.values(interfaces_1.HarmonyShards).includes(url)) {
            var config = constants_1.HARMONY_SHARDS[url];
            provider = new network_1.HttpProvider(config.url);
            chainType = config.chainType;
            chain = config.chainId;
        }
        else if (url instanceof network_1.HttpProvider || url instanceof network_1.WSProvider) {
            provider = url;
        }
        else if (typeof url === 'string') {
            provider = (0, utils_1.isWs)(url) ? new network_1.WSProvider(url) : new network_1.HttpProvider(url);
        }
        else {
            throw new Error('Invalid url param.');
        }
        _this = _super.call(this, new network_1.Messenger(provider, chainType, chain)) || this;
        return _this;
    }
    return Key;
}(account_1.Wallet));
exports.Key = Key;
//# sourceMappingURL=key.js.map