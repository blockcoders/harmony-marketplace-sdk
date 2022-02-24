"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivateKey = void 0;
const key_1 = require("./key");
class PrivateKey extends key_1.Key {
    constructor(url, privateKey, chainId) {
        super(url, chainId);
        this.addByPrivateKey(privateKey);
    }
}
exports.PrivateKey = PrivateKey;
//# sourceMappingURL=private-key.js.map