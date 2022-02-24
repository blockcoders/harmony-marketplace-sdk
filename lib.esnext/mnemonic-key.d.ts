import { ChainID } from '@harmony-js/utils';
import { RpcProviderType } from './interfaces';
import { Key } from './key';
interface MnemonicOptions {
    mnemonic?: string;
    index?: number;
}
export declare class MnemonicKey extends Key {
    constructor(url: RpcProviderType, options?: MnemonicOptions, chainId?: ChainID);
}
export {};
//# sourceMappingURL=mnemonic-key.d.ts.map