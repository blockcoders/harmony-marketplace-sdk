import {
  DEFAULT_ETH_TX_OPTIONS,
  DEFAULT_HMY_TX_OPTIONS,
  MAINNET_BRIDGE_CONTRACTS,
  TESTNET_BRIDGE_CONTRACTS,
} from '../constants'
import {
  BRIDGE,
  BridgeParams,
  ContractProviderType,
  ITransactionOptions,
  ManagerContractAddresses,
  IBridgeToken721,
  IBridgeToken1155,
} from '../interfaces'
import { isBNish } from '../utils'

export class BridgeToken {
  public readonly ethProvider: ContractProviderType
  public readonly hmyProvider: ContractProviderType
  public readonly ethTxOptions: ITransactionOptions
  public readonly hmyTxOptions: ITransactionOptions
  public readonly managerContracts: ManagerContractAddresses
  public readonly token: IBridgeToken721 | IBridgeToken1155

  constructor(
    token: IBridgeToken721 | IBridgeToken1155,
    ethProvider: ContractProviderType,
    hmyProvider: ContractProviderType,
    isMainnet = false,
    ethTxOptions?: ITransactionOptions,
    hmyTxOptions?: ITransactionOptions,
  ) {
    this.token = token
    this.ethProvider = ethProvider
    this.hmyProvider = hmyProvider
    this.ethTxOptions = ethTxOptions || DEFAULT_ETH_TX_OPTIONS
    this.hmyTxOptions = hmyTxOptions || DEFAULT_HMY_TX_OPTIONS
    this.managerContracts = isMainnet ? MAINNET_BRIDGE_CONTRACTS : TESTNET_BRIDGE_CONTRACTS
  }

  async bridgeToken(options: BridgeParams) {
    const { tokenId, amount, type, ethAddress, oneAddress } = options
    if (amount <= 0) throw new Error('amount must be greater than zero')
    if (!isBNish(tokenId)) {
      throw new Error('You must provide a tokenId')
    }

    if (type === BRIDGE.ETH_TO_HMY) {
      return this.token.ethToHmy(this, ethAddress, oneAddress, tokenId)
    }
    return this.token.hmyToEth(this, ethAddress, oneAddress, tokenId)
  }
}
