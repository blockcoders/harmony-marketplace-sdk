import { Wallet } from '@harmony-js/account'
import { Messenger, HttpProvider, WSProvider } from '@harmony-js/network'
import { ChainID, ChainType, isWs } from '@harmony-js/utils'
import { HARMONY_SHARDS, CHAINS_ID } from '../constants'
import { HarmonyRpcConfig, HarmonyShards, RpcProviderType } from '../interfaces'

/**
 * Implementation of the Wallet that does not use any pk or mnemonic.
 */
export class Key extends Wallet {
  constructor(url: RpcProviderType, chainId = ChainID.HmyMainnet, chainType = ChainType.Harmony) {
    let chain: ChainID = chainId
    let provider: HttpProvider | WSProvider

    if (Object.values(HarmonyShards).includes(url as HarmonyShards)) {
      const config = HARMONY_SHARDS[url as HarmonyShards] as HarmonyRpcConfig
      provider = new HttpProvider(config.url)
      chainType = config.chainType
      chain = config.chainId
    } else if (url instanceof HttpProvider || url instanceof WSProvider) {
      provider = url
    } else if (typeof url === 'string') {
      provider = isWs(url) ? new WSProvider(url) : new HttpProvider(url)
    } else if (url['isMetaMask']) {
      const _chain = Number(url['networkVersion'])
      const rpc_url = CHAINS_ID[_chain]

      if (!rpc_url) throw new Error('Invalid metamask harmony chain.')

      provider = new HttpProvider(rpc_url)
      chain = _chain
    } else {
      throw new Error('Invalid url param.')
    }

    super(new Messenger(provider, chainType, chain))
  }
}
