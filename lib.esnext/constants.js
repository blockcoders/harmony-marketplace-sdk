"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HARMONY_SHARDS = exports.HARMONY_RPC_SHARD_3_TESTNET = exports.HARMONY_RPC_SHARD_2_TESTNET = exports.HARMONY_RPC_SHARD_1_TESTNET = exports.HARMONY_RPC_SHARD_0_TESTNET = exports.HARMONY_RPC_SHARD_3 = exports.HARMONY_RPC_SHARD_2 = exports.HARMONY_RPC_SHARD_1 = exports.HARMONY_RPC_SHARD_0 = exports.DEFAULT_GAS_LIMIT = exports.DEFAULT_GAS_PRICE = exports.AddressZero = void 0;
const utils_1 = require("@harmony-js/utils");
const interfaces_1 = require("./interfaces");
exports.AddressZero = '0x0000000000000000000000000000000000000000';
exports.DEFAULT_GAS_PRICE = '1';
exports.DEFAULT_GAS_LIMIT = '21000';
exports.HARMONY_RPC_SHARD_0 = {
    url: 'https://api.harmony.one',
    chainId: utils_1.ChainID.HmyMainnet,
    chainType: utils_1.ChainType.Harmony,
};
exports.HARMONY_RPC_SHARD_1 = {
    url: 'https://s1.api.harmony.one',
    chainId: utils_1.ChainID.HmyMainnet,
    chainType: utils_1.ChainType.Harmony,
};
exports.HARMONY_RPC_SHARD_2 = {
    url: 'https://s2.api.harmony.one',
    chainId: utils_1.ChainID.HmyMainnet,
    chainType: utils_1.ChainType.Harmony,
};
exports.HARMONY_RPC_SHARD_3 = {
    url: 'https://s3.api.harmony.one',
    chainId: utils_1.ChainID.HmyMainnet,
    chainType: utils_1.ChainType.Harmony,
};
exports.HARMONY_RPC_SHARD_0_TESTNET = {
    url: 'https://api.s0.b.hmny.io',
    chainId: utils_1.ChainID.HmyTestnet,
    chainType: utils_1.ChainType.Harmony,
};
exports.HARMONY_RPC_SHARD_1_TESTNET = {
    url: 'https://api.s1.b.hmny.io',
    chainId: utils_1.ChainID.HmyTestnet,
    chainType: utils_1.ChainType.Harmony,
};
exports.HARMONY_RPC_SHARD_2_TESTNET = {
    url: 'https://api.s2.b.hmny.io',
    chainId: utils_1.ChainID.HmyTestnet,
    chainType: utils_1.ChainType.Harmony,
};
exports.HARMONY_RPC_SHARD_3_TESTNET = {
    url: 'https://api.s3.b.hmny.io',
    chainId: utils_1.ChainID.HmyTestnet,
    chainType: utils_1.ChainType.Harmony,
};
exports.HARMONY_SHARDS = {
    [interfaces_1.HarmonyShards.SHARD_0]: exports.HARMONY_RPC_SHARD_0,
    [interfaces_1.HarmonyShards.SHARD_1]: exports.HARMONY_RPC_SHARD_1,
    [interfaces_1.HarmonyShards.SHARD_2]: exports.HARMONY_RPC_SHARD_2,
    [interfaces_1.HarmonyShards.SHARD_3]: exports.HARMONY_RPC_SHARD_3,
    [interfaces_1.HarmonyShards.SHARD_0_TESTNET]: exports.HARMONY_RPC_SHARD_0_TESTNET,
    [interfaces_1.HarmonyShards.SHARD_1_TESTNET]: exports.HARMONY_RPC_SHARD_1_TESTNET,
    [interfaces_1.HarmonyShards.SHARD_2_TESTNET]: exports.HARMONY_RPC_SHARD_2_TESTNET,
    [interfaces_1.HarmonyShards.SHARD_3_TESTNET]: exports.HARMONY_RPC_SHARD_3_TESTNET,
};
//# sourceMappingURL=constants.js.map