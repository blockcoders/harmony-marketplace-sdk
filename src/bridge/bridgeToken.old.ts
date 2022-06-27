import { Signer } from '@ethersproject/abstract-signer'
import {
  BridgedHRC1155Token,
  BridgedHRC20Token,
  BridgedHRC721Token,
  HRC1155EthManager,
  HRC1155HmyManager,
  HRC1155TokenManager,
  HRC20EthManager,
  HRC20HmyManager,
  HRC20TokenManager,
  HRC721EthManager,
  HRC721HmyManager,
  HRC721TokenManager,
} from '../bridge'
import {
  BridgeType,
  DEVNET_CONTRACTS_ADDRESSES,
  MAINNET_CONTRACTS_ADDRESSES,
  NetworkInfo,
  TokenType,
} from '../constants'
import { HRC1155, HRC20, HRC721 } from '../contracts'
import { BridgeManagers, ContractsAddresses, ITransactionOptions, TokenInfo } from '../interfaces'
import { Key } from '../wallets'
import HRC1155ABI from './hrc1155/abi'
import HRC20ABI from './hrc20/abi'
import HRC721ABI from './hrc721/abi'

export class BridgeToken {
  public ethOwnerWallet: Signer
  public ethMasterWallet: Signer
  public hmyOwnerWallet: Key
  public hmyMasterWallet: Key

  constructor(ethOwnerWallet: Signer, ethMasterWallet: Signer, hmyOwnerWallet: Key, hmyMasterWallet: Key) {
    this.ethOwnerWallet = ethOwnerWallet
    this.ethMasterWallet = ethMasterWallet
    this.hmyOwnerWallet = hmyOwnerWallet
    this.hmyMasterWallet = hmyMasterWallet
  }

  public async execute(
    sender: string,
    recipient: string,
    tokenInfo: TokenInfo,
    bridgeType: BridgeType,
    networkInfo: NetworkInfo,
    txOptions: ITransactionOptions,
  ) {
    const contractsAddresses = this.getContractAddresses(networkInfo)
    const managers: BridgeManagers = await this.getContracts(tokenInfo, contractsAddresses)
    const { token } = managers
    if (bridgeType === BridgeType.ETH_TO_HMY) {
      await token.ethToHmy(managers, sender, recipient, tokenInfo, txOptions)
    } else if (bridgeType === BridgeType.HMY_TO_ETH) {
      await token.hmyToEth(managers, sender, recipient, tokenInfo, networkInfo, txOptions)
    }
  }

  private getContractAddresses(network: NetworkInfo): ContractsAddresses {
    switch (network) {
      case NetworkInfo.MAINNET:
        return MAINNET_CONTRACTS_ADDRESSES
      case NetworkInfo.DEVNET:
        return DEVNET_CONTRACTS_ADDRESSES
      default:
        throw Error('Invalid network')
    }
  }

  private async getContracts(tokenInfo: TokenInfo, contractsAddresses: ContractsAddresses): Promise<BridgeManagers> {
    let token
    let ownerSignedToken
    let ethManager
    let ownerSignedEthManager
    let hmyManager
    let ownerSignedHmyManager
    let tokenManager
    let bridgedToken
    let ethManagerAddress
    let hmyManagerAddress
    let tokenManagerAddress

    const { tokenAddress } = tokenInfo || {}
    switch (tokenInfo.type) {
      case TokenType.HRC20:
        ethManagerAddress = contractsAddresses.HRC20.ethManagerAddress
        hmyManagerAddress = contractsAddresses.HRC20.hmyManagerAddress
        tokenManagerAddress = contractsAddresses.HRC20.tokenManagerAddress
        token = new HRC20(tokenAddress, HRC20ABI, this.hmyMasterWallet)
        ownerSignedToken = new HRC20(tokenAddress, HRC20ABI, this.hmyOwnerWallet)
        hmyManager = new HRC20HmyManager(hmyManagerAddress, this.hmyMasterWallet)
        ownerSignedHmyManager = new HRC20HmyManager(hmyManagerAddress, this.hmyOwnerWallet)
        ethManager = new HRC20EthManager(ethManagerAddress, this.ethMasterWallet)
        ownerSignedEthManager = new HRC20EthManager(ethManagerAddress, this.ethOwnerWallet)
        tokenManager = new HRC20TokenManager(tokenManagerAddress, this.ethMasterWallet)
        const erc20Address = await ethManager.mappings(token.address)
        bridgedToken = new BridgedHRC20Token(erc20Address, this.ethOwnerWallet)
        break
      case TokenType.HRC721:
        ethManagerAddress = contractsAddresses.HRC721.ethManagerAddress
        hmyManagerAddress = contractsAddresses.HRC721.hmyManagerAddress
        tokenManagerAddress = contractsAddresses.HRC721.tokenManagerAddress
        token = new HRC721(tokenAddress, HRC721ABI, this.hmyMasterWallet)
        ownerSignedToken = new HRC721(tokenAddress, HRC721ABI, this.hmyOwnerWallet)
        hmyManager = new HRC721HmyManager(hmyManagerAddress, this.hmyMasterWallet)
        ownerSignedHmyManager = new HRC721HmyManager(hmyManagerAddress, this.hmyOwnerWallet)
        ethManager = new HRC721EthManager(ethManagerAddress, this.ethMasterWallet)
        ownerSignedEthManager = new HRC721EthManager(ethManagerAddress, this.ethOwnerWallet)
        tokenManager = new HRC721TokenManager(tokenManagerAddress, this.ethMasterWallet)
        const erc721Address = await ethManager.mappings(token.address)
        bridgedToken = new BridgedHRC721Token(erc721Address, this.ethOwnerWallet)
        break
      case TokenType.HRC1155:
        ethManagerAddress = contractsAddresses.HRC1155.ethManagerAddress
        hmyManagerAddress = contractsAddresses.HRC1155.hmyManagerAddress
        tokenManagerAddress = contractsAddresses.HRC1155.tokenManagerAddress
        token = new HRC1155(tokenAddress, HRC1155ABI, this.hmyMasterWallet)
        ownerSignedToken = new HRC1155(tokenAddress, HRC1155ABI, this.hmyOwnerWallet)
        hmyManager = new HRC1155HmyManager(hmyManagerAddress, this.hmyMasterWallet)
        ownerSignedHmyManager = new HRC1155HmyManager(hmyManagerAddress, this.hmyOwnerWallet)
        ethManager = new HRC1155EthManager(ethManagerAddress, this.ethMasterWallet)
        ownerSignedEthManager = new HRC1155EthManager(ethManagerAddress, this.ethOwnerWallet)
        tokenManager = new HRC1155TokenManager(tokenManagerAddress, this.ethMasterWallet)
        const erc1155Address = await ethManager.mappings(token.address)
        bridgedToken = new BridgedHRC1155Token(erc1155Address, this.ethOwnerWallet)
        break
      default:
        throw Error('This token bridge is not implemented yet')
    }
    return {
      token,
      ownerSignedToken,
      ethManager,
      ownerSignedEthManager,
      hmyManager,
      ownerSignedHmyManager,
      tokenManager,
      bridgedToken,
    }
  }
}
