import { ChainID } from '@harmony-js/utils';
import { RpcProviderType } from './interfaces';
import { Key } from './key';
export declare class PrivateKey extends Key {
    constructor(url: RpcProviderType, privateKey: string, chainId?: ChainID);
}
//# sourceMappingURL=private-key.d.ts.map