import { Signer, VoidSigner } from '@ethersproject/abstract-signer'
import { Provider } from '@ethersproject/providers'
import { Wallet } from '@harmony-js/account'
import {
  BridgeType,
  DEFAULT_TX_OPTIONS,
  DEVNET_MULTISIG_WALLET,
  HARMONY_RPC_SHARD_0_DEVNET_URL,
  HARMONY_RPC_SHARD_0_URL,
  MAINNET_MULTISIG_WALLET,
  NetworkInfo,
} from '../constants'
import { HRC1155, HRC20, HRC721 } from '../contracts'
import { ITransactionOptions, HRC20Info, HRC1155Info, HRC721Info, BridgeResponse } from '../interfaces'
import { Key } from '../wallets'

export abstract class BridgeToken {
  protected readonly ethMasterWallet: Signer
  protected readonly hmyMasterWallet: Wallet
  protected readonly ethOwnerWallet: Signer
  protected readonly hmyOwnerWallet: Wallet
  protected readonly network: NetworkInfo

  constructor(
    hmyOwnerWallet: Wallet,
    ethOwnerWallet: Signer,
    ethProvider: Provider,
    network: NetworkInfo = NetworkInfo.MAINNET,
  ) {
    this.network = network

    if (this.isMainnet) {
      this.ethMasterWallet = new VoidSigner(MAINNET_MULTISIG_WALLET)
      this.hmyMasterWallet = new Key(HARMONY_RPC_SHARD_0_URL)
    } else {
      this.ethMasterWallet = new VoidSigner(DEVNET_MULTISIG_WALLET)
      this.hmyMasterWallet = new Key(HARMONY_RPC_SHARD_0_DEVNET_URL)
    }

    this.ethMasterWallet = this.ethMasterWallet.connect(ethProvider)
    this.hmyMasterWallet.setSigner(MAINNET_MULTISIG_WALLET)

    this.hmyOwnerWallet = hmyOwnerWallet
    this.ethOwnerWallet = ethOwnerWallet
  }

  public get isMainnet(): boolean {
    return this.network === NetworkInfo.MAINNET
  }

  public abstract ethToHmy(
    sender: string,
    recipient: string,
    token: HRC20 | HRC721 | HRC1155,
    tokenInfo: HRC20Info | HRC721Info | HRC1155Info,
  ): Promise<BridgeResponse>

  public abstract hmyToEth(
    sender: string,
    recipient: string,
    token: HRC20 | HRC721 | HRC1155,
    tokenInfo: HRC20Info | HRC721Info | HRC1155Info,
    txOptions: ITransactionOptions,
  ): Promise<BridgeResponse>

  public async sendToken(
    type: BridgeType,
    sender: string,
    recipient: string,
    token: HRC20 | HRC721 | HRC1155,
    tokenInfo: HRC20Info | HRC721Info | HRC1155Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<BridgeResponse> {
    if (type === BridgeType.ETH_TO_HMY) {
      return this.ethToHmy(sender, recipient, token, tokenInfo)
    } else {
      return this.hmyToEth(sender, recipient, token, tokenInfo, txOptions)
    }
  }
}
