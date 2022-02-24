"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBNish = void 0;
const crypto_1 = require("@harmony-js/crypto");
const bn_js_1 = __importDefault(require("bn.js"));
function isBNish(value) {
    return (value != null &&
        (bn_js_1.default.isBN(value) ||
            (typeof value === 'number' && value % 1 === 0) ||
            (typeof value === 'string' && !!value.match(/^-?[0-9]+$/)) ||
            (0, crypto_1.isHexString)(value) ||
            typeof value === 'bigint' ||
            (0, crypto_1.isArrayish)(value)));
}
exports.isBNish = isBNish;
//# sourceMappingURL=utils.js.map