import { Key } from './key';
export class PrivateKey extends Key {
    constructor(url, privateKey, chainId) {
        super(url, chainId);
        this.addByPrivateKey(privateKey);
    }
}
//# sourceMappingURL=private-key.js.map