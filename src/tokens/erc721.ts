import { Networkish } from '@ethersproject/networks'
import { Transaction } from '@harmony-js/transaction'
import { ethers } from 'ethers'
import { isBNish } from '../utils'
import { abi as EthManagerContractABI } from '../bridge-managers/abis/managers/erc721-eth-manager-abi'
import { abi as HmyManagerContractABI } from '../bridge-managers/abis/managers/erc721-hmy-manager-abi'
import { abi as TokenManagerABI } from '../bridge-managers/abis/managers/token-manager-abi'
import { ERC721EthManagerContract } from '../bridge-managers/contracts/erc721/eth-manager'
import { ERC721HmyManagerContract } from '../bridge-managers/contracts/erc721/hmy-manager'
import { TokenManager } from '../bridge-managers/contracts/token-manager'
import { BLOCKS_TO_WAIT, MAINNET_BRIDGE_CONTRACTS, TESTNET_BRIDGE_CONTRACTS } from '../constants'
import { BridgeParams, ITransactionOptions, BRIDGE, ManagerContractAddresses, BNish } from '../interfaces'
import { BaseToken } from './base-token'
import { ContractError } from './base-token-contract'
import { PrivateKey } from '../private-key'
const { JsonRpcProvider } = ethers.providers

const waitForNewBlocks = async (url: string, network: Networkish) => {
  const provider = new JsonRpcProvider(url, network)
  const blockNumber = await provider.getBlockNumber()
  new Promise<void>((resolve, _reject) => {
    provider.on('block', async () => {
      const currentBlock = await provider.getBlockNumber()
      if (currentBlock >= blockNumber + BLOCKS_TO_WAIT) resolve()
    })
  })
}

export class ERC721 extends BaseToken {

  public async symbol(txOptions?: ITransactionOptions): Promise<string> {
    try {
      return this.call<string>('symbol', [], txOptions)
    } catch (error) {
      console.error(error)
      throw Error(`ERROR: ${error}`)
    }
  }

  public async name(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('name', [], txOptions)
  }

  public async tokenURI(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!isBNish(tokenId)) {
      throw new ContractError('You must provide a tokenId', 'tokenURI')
    }

    return this.call<string>('tokenURI', [tokenId], txOptions)
  }

  public async bridgeToken(options: BridgeParams, hmyProvider: PrivateKey, txOptions?: ITransactionOptions): Promise<void> {
    const { tokenId, amount, isMainnet = false, type, ethAddress, oneAddress } = options
    if (amount <= 0) throw new Error('amount must be greater than zero')
    if (!tokenId) throw Error('TokenId mut be provided')

    const managersAddresses = isMainnet ? MAINNET_BRIDGE_CONTRACTS : TESTNET_BRIDGE_CONTRACTS

    if (type === BRIDGE.ETH_TO_HMY) {
      return this.ethToHmy(managersAddresses, tokenId, ethAddress, oneAddress, hmyProvider, txOptions)
    }
    //return this.hmyToEth(managersAddresses, tokenId, ethAddress, oneAddress, txOptions)
  }

  public async approve(to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('approve', [to, tokenId], txOptions)
  }

  private async ethToHmy(
    managerContractAddresses: ManagerContractAddresses,
    tokenId: number,
    sender: string,
    recipient: string,
    hmyProvider: PrivateKey,
    txOptions?: ITransactionOptions,
  ) {
    const { erc721EthManagerContract, erc721HmyManagerContract, tokenManagerContract, ethUrl, ethNetwork } =
      managerContractAddresses
    console.log("ENTRE")
     
    const ethManager = new ERC721EthManagerContract(erc721EthManagerContract, EthManagerContractABI, this._provider)
    const hmyManager = new ERC721HmyManagerContract(erc721HmyManagerContract, HmyManagerContractABI, hmyProvider)
    const hmyTokenManager = new TokenManager(tokenManagerContract, TokenManagerABI, hmyProvider)
    console.log("Tengo los contratos")

    const symbol = await this.symbol(txOptions)
    console.log("symbol: ", symbol)
    const name = await this.name(txOptions)
    console.log("Name: ", name)
    const baseURI = await this.tokenURI(tokenId, txOptions)

    const addTokenTx = await hmyManager.addToken(hmyTokenManager.address, this.address, name, symbol, baseURI)
    console.log("ADD TOKEN", addTokenTx)

    const hmyTokenAddress = await hmyManager.mappings(this.address)
    console.log("MAPPINGS: ",hmyTokenAddress)
    const approveEthManagerTx = await this.approve(ethManager.address, tokenId, txOptions)
    console.log("APPROVE",approveEthManagerTx)

    const lockTokenForTx = await ethManager.lockTokenFor(this.address, sender, tokenId, recipient)
    console.log("LOCK",lockTokenForTx)

    await waitForNewBlocks(ethUrl, ethNetwork)
    console.log("WAIT COMPLETE")
    const mintTx = await hmyManager.mintToken(hmyTokenAddress, tokenId, recipient, lockTokenForTx.id)
    console.log(mintTx)
  }

  /*public async hmyToEth(
    managerContractAddresses: ManagerContractAddresses,
    tokenId: number,
    sender: string,
    recipient: string,
    txOptions?: ITransactionOptions,
  ) {
    const { erc721EthManagerContract, erc721HmyManagerContract, tokenManagerContract } = managerContractAddresses
    const ethManager = new ERC721EthManagerContract(erc721EthManagerContract, EthManagerContractABI, this._provider)
    const hmyManager = new ERC721HmyManagerContract(erc721HmyManagerContract, HmyManagerContractABI, this._provider)
    const ethTokenManager = new TokenManager(tokenManagerContract, TokenManagerABI, this._provider)
  }*/
}
