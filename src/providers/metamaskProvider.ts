import { HttpProvider, RPCRequestPayload } from '@harmony-js/network'
import { MetaMaskEthereumProvider } from '../interfaces'

export class MetamaskProvider extends HttpProvider {
  private readonly provider: MetaMaskEthereumProvider

  constructor(provider?: MetaMaskEthereumProvider) {
    super('')

    if (!provider) {
      throw new Error('Invalid MetaMask provider!')
    }

    this.provider = provider
  }

  requestFunc({ payload }: { payload: RPCRequestPayload<object> }): Promise<any> {
    return this.provider.request({ method: payload.method, params: payload.params })
  }
}
