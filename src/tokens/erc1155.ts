import { PrivateKey } from '../private-key'
import { BridgeParams, ITransactionOptions } from '../interfaces'
import { BaseToken } from './base-token'

export class ERC1155 extends BaseToken {
  public async bridgeToken(options: BridgeParams, hmyProvider: PrivateKey,txOptions?: ITransactionOptions): Promise<void> {
    throw Error('Not implemented yet')
  }
}
