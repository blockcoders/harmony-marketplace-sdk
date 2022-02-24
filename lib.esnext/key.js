"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = void 0;
const account_1 = require("@harmony-js/account");
const network_1 = require("@harmony-js/network");
const utils_1 = require("@harmony-js/utils");
const constants_1 = require("./constants");
const interfaces_1 = require("./interfaces");
class Key extends account_1.Wallet {
    constructor(url, chainId = utils_1.ChainID.HmyMainnet) {
        let chainType = utils_1.ChainType.Harmony;
        let chain = chainId;
        let provider;
        if (Object.values(interfaces_1.HarmonyShards).includes(url)) {
            const config = constants_1.HARMONY_SHARDS[url];
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
        super(new network_1.Messenger(provider, chainType, chain));
    }
}
exports.Key = Key;
//# sourceMappingURL=key.js.map