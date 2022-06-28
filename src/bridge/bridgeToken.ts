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
} from '../constants'
import { HRC1155, HRC20, HRC721 } from '../contracts'
import { ITransactionOptions, HRC20Info, HRC1155Info, HRC721Info } from '../interfaces'
import { Key } from '../wallets'

export abstract class BridgeToken {
  protected readonly ethMasterWallet: Signer
  protected readonly hmyMasterWallet: Wallet
  protected readonly ethOwnerWallet: Signer
  protected readonly hmyOwnerWallet: Wallet
  protected readonly isMainnet: boolean

  constructor(hmyOwnerWallet: Wallet, ethOwnerWallet: Signer, ethProvider: Provider, isMainnet = true) {
    this.isMainnet = isMainnet

    if (this.isMainnet) {
      this.ethMasterWallet = new VoidSigner(MAINNET_MULTISIG_WALLET)
      this.hmyMasterWallet = new Key(HARMONY_RPC_SHARD_0_URL)
    } else {
      this.ethMasterWallet = new VoidSigner(DEVNET_MULTISIG_WALLET)
      this.hmyMasterWallet = new Key(HARMONY_RPC_SHARD_0_DEVNET_URL)
    }

    this.ethMasterWallet.connect(ethProvider)
    this.hmyMasterWallet.setSigner(MAINNET_MULTISIG_WALLET)

    this.hmyOwnerWallet = hmyOwnerWallet
    this.ethOwnerWallet = ethOwnerWallet
  }

  public async ethToHmy(
    sender: string,
    recipient: string,
    token: HRC20 | HRC721 | HRC1155,
    tokenInfo: HRC20Info | HRC721Info | HRC1155Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ) {
    throw Error('Error on BridgeToken ethToHmy needs to be implemented in child class.')
  }

  public async hmyToEth(
    sender: string,
    recipient: string,
    token: HRC20 | HRC721 | HRC1155,
    tokenInfo: HRC20Info | HRC721Info | HRC1155Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ) {
    throw Error('Error on BridgeToken hmyToEth needs to be implemented in child class.')
  }

  public async sendToken(
    type: BridgeType,
    sender: string,
    recipient: string,
    token: HRC20 | HRC721 | HRC1155,
    tokenInfo: HRC20Info | HRC721Info | HRC1155Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ) {
    if (type === BridgeType.ETH_TO_HMY) {
      return this.ethToHmy(sender, recipient, token, tokenInfo, txOptions)
    } else {
      return this.hmyToEth(sender, recipient, token, tokenInfo, txOptions)
    }
  }
}
