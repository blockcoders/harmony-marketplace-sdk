import { Wallet } from '@harmony-js/account';
import { Messenger, HttpProvider, WSProvider } from '@harmony-js/network';
import { ChainID, ChainType, isWs } from '@harmony-js/utils';
import { HARMONY_SHARDS } from './constants';
import { HarmonyShards } from './interfaces';
export class Key extends Wallet {
    constructor(url, chainId = ChainID.HmyMainnet) {
        let chainType = ChainType.Harmony;
        let chain = chainId;
        let provider;
        if (Object.values(HarmonyShards).includes(url)) {
            const config = HARMONY_SHARDS[url];
            provider = new HttpProvider(config.url);
            chainType = config.chainType;
            chain = config.chainId;
        }
        else if (url instanceof HttpProvider || url instanceof WSProvider) {
            provider = url;
        }
        else if (typeof url === 'string') {
            provider = isWs(url) ? new WSProvider(url) : new HttpProvider(url);
        }
        else {
            throw new Error('Invalid url param.');
        }
        super(new Messenger(provider, chainType, chain));
    }
}
//# sourceMappingURL=key.js.map