import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { ethers } from 'ethers'
import { BridgeToken } from 'src/bridge-managers/bridge-token'
import { abi as EthManagerContractABI } from '../bridge-managers/abis/managers/hrc721-eth-manager-abi'
import { abi as HmyManagerContractABI } from '../bridge-managers/abis/managers/hrc721-hmy-manager-abi'
import { abi as TokenManagerABI } from '../bridge-managers/abis/managers/token-manager-abi'
import { abi as HRC721ABI } from '../bridge-managers/abis/tokens/hrc721'
import { HRC721EthManagerContract } from '../bridge-managers/contracts/hrc721/eth-manager'
import { HRC721HmyManagerContract } from '../bridge-managers/contracts/hrc721/hmy-manager'
import { TokenManager } from '../bridge-managers/contracts/token-manager'
import { BNish, ContractProviderType, IBridgeToken721, ITransactionOptions } from '../interfaces'
import { isBNish } from '../utils'
import { BaseToken } from './base-token'
import { ContractError } from './base-token-contract'

const { JsonRpcProvider } = ethers.providers

export class HRC721 extends BaseToken implements IBridgeToken721 {
  constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions) {
    super(address, abi, provider, options)
  }

  public async balanceOf(address: string, txOptions?: ITransactionOptions): Promise<BN> {
    return await this.getBalance(address, undefined, txOptions)
  }

  public async ownerOf(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!isBNish(tokenId)) {
      throw new ContractError('You must provide a tokenId', 'ownerOf')
    }

    const address = await this.call<string>('ownerOf', [tokenId], txOptions)

    return this.sanitizeAddress(address)
  }

  public async safeTransferFrom(
    from: string,
    to: string,
    tokenId: BNish,
    data?: any,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    const args: any[] = [from, to, tokenId]

    if (data) {
      args.push(data)
    }

    return this.send('safeTransferFrom', args, txOptions)
  }

  public async transferFrom(
    from: string,
    to: string,
    tokenId: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('transferFrom', [from, to, tokenId], txOptions)
  }

  public async approve(to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('approve', [to, tokenId], txOptions)
  }

  public async getApproved(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!isBNish(tokenId)) {
      throw new ContractError('You must provide a tokenId', 'getApproved')
    }

    const address = await this.call<string>('getApproved', [tokenId], txOptions)

    return this.sanitizeAddress(address)
  }

  public async totalSupply(txOptions?: ITransactionOptions): Promise<number> {
    return this.call<number>('totalSupply', [], txOptions)
  }

  public async tokenURI(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!isBNish(tokenId)) {
      throw new ContractError('You must provide a tokenId', 'tokenURI')
    }

    return this.call<string>('tokenURI', [tokenId], txOptions)
  }

  public async symbol(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('symbol', [], txOptions)
  }

  public async name(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('name', [], txOptions)
  }

  public async ethToHmy(bridge: BridgeToken, ethAddress: string, oneAddress: string, tokenId: BNish): Promise<void> {
    const { managerContracts, ethProvider, hmyProvider, ethTxOptions, hmyTxOptions } = bridge
    const { hrc721EthManagerContract, hrc721HmyManagerContract, tokenManagerContract } = managerContracts

    // Manager Contracts
    const ethManager = new HRC721EthManagerContract(hrc721EthManagerContract, EthManagerContractABI, ethProvider)
    const hmyManager = new HRC721HmyManagerContract(hrc721HmyManagerContract, HmyManagerContractABI, hmyProvider)
    const hmyTokenManager = new TokenManager(tokenManagerContract, TokenManagerABI, hmyProvider)

    const hmyTokenAddress = await ethManager.mappings(this.address, ethTxOptions)
    console.log('MAPPINGS: ', hmyTokenAddress)

    const ethHRC721Token = new HRC721(hmyTokenAddress, HRC721ABI, bridge.hmyProvider)

    const approveEthManagerTx = await ethHRC721Token.approve(ethManager.address, tokenId, ethTxOptions)
    console.log('APPROVE', approveEthManagerTx.id)

    // Is this.address the harmony token ?
    const burnTokenTx = await ethManager.burnToken(this.address, tokenId, oneAddress, ethTxOptions)
    console.log('BURN', burnTokenTx.id)

    // This should recieve ethToken address?
    const unlockTokenTx = await hmyManager.unlockToken(this.address, tokenId, oneAddress, burnTokenTx.id, hmyTxOptions)
    console.log('UNLOCK', unlockTokenTx.id)

    // This should recieve ethToken address?
    const removeTokenTx = await ethManager.removeToken(hmyTokenManager.address, this.address, ethTxOptions)
    console.log('REMOVE TOKEN', removeTokenTx.txStatus)
  }

  public async hmyToEth(bridge: BridgeToken, ethAddress: string, oneAddress: string, tokenId: BNish): Promise<void> {
    const { managerContracts, ethProvider, hmyProvider, ethTxOptions, hmyTxOptions } = bridge
    const { hrc721EthManagerContract, hrc721HmyManagerContract, tokenManagerContract, hmyUrl, hmyNetwork } =
      managerContracts

    // Manager Contracts
    const ethManager = new HRC721EthManagerContract(hrc721EthManagerContract, EthManagerContractABI, ethProvider)
    const hmyManager = new HRC721HmyManagerContract(hrc721HmyManagerContract, HmyManagerContractABI, hmyProvider)
    const hmyTokenManager = new TokenManager(tokenManagerContract, TokenManagerABI, hmyProvider)
    // Add Token in Hmy
    const symbol = await this.symbol(hmyTxOptions)
    console.log('details')
    const name = await this.name(hmyTxOptions)
    const baseURI = await this.tokenURI(tokenId, hmyTxOptions)
    const addTokenTx = await ethManager.addToken(
      hmyTokenManager.address,
      this.address,
      name,
      symbol,
      baseURI,
      ethTxOptions,
    )
    console.log('ADD TOKEN', addTokenTx.txStatus)
    const ethTokenAddress = await ethManager.mappings(this.address, ethTxOptions)
    console.log('MAPPINGS: ', ethTokenAddress)

    const approveHmyManagerTx = await this.approve(hmyManager.address, tokenId, hmyTxOptions)
    console.log('APPROVE', approveHmyManagerTx)

    const lockTokenTx = await hmyManager.lockNFT721Token(ethTokenAddress, tokenId, ethAddress, hmyTxOptions)
    console.log('LOCK', lockTokenTx)
    const provider = new JsonRpcProvider(hmyUrl, hmyNetwork)
    console.log(provider)
    //await waitForNewBlocks(provider)
    console.log('WAIT COMPLETE')
    const mintTx = await ethManager.mintToken(ethTokenAddress, tokenId, ethAddress, lockTokenTx.id, ethTxOptions)
    console.log(mintTx)
  }
}
