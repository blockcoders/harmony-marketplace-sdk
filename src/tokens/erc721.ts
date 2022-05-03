import { Transaction } from '@harmony-js/transaction'
import { abi as EthManagerContractABI } from '../bridge-managers/abis/managers/erc721-eth-manager-abi'
import { abi as HmyManagerContractABI } from '../bridge-managers/abis/managers/erc721-hmy-manager-abi'
import { abi as TokenManagerABI } from '../bridge-managers/abis/managers/token-manager-abi'
import { abi as ERC721ABI } from '../bridge-managers/abis/tokens/erc721'
import { BridgeToken } from '../bridge-managers/bridge-token'
import { ERC721EthManagerContract } from '../bridge-managers/contracts/erc721/eth-manager'
import { ERC721HmyManagerContract } from '../bridge-managers/contracts/erc721/hmy-manager'
import { TokenManager } from '../bridge-managers/contracts/token-manager'
import { ITransactionOptions, BNish, IBridgeToken721 } from '../interfaces'
import { isBNish, waitForNewBlocks } from '../utils'
import { BaseToken } from './base-token'
import { ContractError } from './base-token-contract'

export class ERC721 extends BaseToken implements IBridgeToken721 {
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
    console.log(tokenId)
    return this.call<string>('tokenURI', [tokenId], txOptions)
  }

  public async approve(to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('approve', [to, tokenId], txOptions)
  }

  public async ethToHmy(bridge: BridgeToken, ethAddress: string, oneAddress: string, tokenId: BNish): Promise<void> {
    const { managerContracts, ethProvider, hmyProvider, ethTxOptions, hmyTxOptions } = bridge
    const { erc721EthManagerContract, erc721HmyManagerContract, tokenManagerContract, ethUrl, ethNetwork } =
      managerContracts

    // Manager Contracts
    const ethManager = new ERC721EthManagerContract(erc721EthManagerContract, EthManagerContractABI, ethProvider)
    const hmyManager = new ERC721HmyManagerContract(erc721HmyManagerContract, HmyManagerContractABI, hmyProvider)
    const hmyTokenManager = new TokenManager(tokenManagerContract, TokenManagerABI, hmyProvider)

    // Add Token in Hmy
    const symbol = await this.symbol(ethTxOptions)
    const name = await this.name(ethTxOptions)
    const baseURI = await this.tokenURI(tokenId, ethTxOptions)
    const addTokenTx = await hmyManager.addToken(
      hmyTokenManager.address,
      this.address,
      name,
      symbol,
      baseURI,
      hmyTxOptions,
    )
    console.log('ADD TOKEN', addTokenTx.txStatus)
    const hmyTokenAddress = await hmyManager.mappings(this.address, hmyTxOptions)
    console.log('MAPPINGS: ', hmyTokenAddress)

    const approveEthManagerTx = await this.approve(ethManager.address, tokenId, ethTxOptions)
    console.log('APPROVE', approveEthManagerTx)

    const lockTokenForTx = await ethManager.lockTokenFor(this.address, ethAddress, tokenId, oneAddress, ethTxOptions)
    console.log('LOCK', lockTokenForTx)

    await waitForNewBlocks(ethUrl, ethNetwork)
    console.log('WAIT COMPLETE')
    const mintTx = await hmyManager.mintToken(hmyTokenAddress, tokenId, oneAddress, lockTokenForTx.id, hmyTxOptions)
    console.log(mintTx)
  }

  public async hmyToEth(bridge: BridgeToken, ethAddress: string, oneAddress: string, tokenId: BNish): Promise<void> {
    const { managerContracts, ethProvider, hmyProvider, ethTxOptions, hmyTxOptions } = bridge
    const { erc721EthManagerContract, erc721HmyManagerContract, tokenManagerContract } = managerContracts

    // Manager Contracts
    const ethManager = new ERC721EthManagerContract(erc721EthManagerContract, EthManagerContractABI, ethProvider)
    const hmyManager = new ERC721HmyManagerContract(erc721HmyManagerContract, HmyManagerContractABI, hmyProvider)
    const hmyTokenManager = new TokenManager(tokenManagerContract, TokenManagerABI, hmyProvider)

    const hmyTokenAddress = await hmyManager.mappings(this.address, hmyTxOptions)
    console.log('MAPPINGS: ', hmyTokenAddress)

    const hmyERC721Token = new ERC721(hmyTokenAddress, ERC721ABI, bridge.hmyProvider)

    const approveHmyManagerTx = await hmyERC721Token.approve(hmyManager.address, tokenId, hmyTxOptions)
    console.log('APPROVE', approveHmyManagerTx.id)

    const burnTokenTx = await hmyManager.burnToken(hmyTokenAddress, tokenId, ethAddress, hmyTxOptions)
    console.log('BURN', burnTokenTx.id)

    const unlockTokenTx = await ethManager.unlockToken(this.address, tokenId, ethAddress, burnTokenTx.id, ethTxOptions)
    console.log('UNLOCK', unlockTokenTx.id)

    // Remove Token in Hmy
    const removeTokenTx = await hmyManager.removeToken(hmyTokenManager.address, this.address, hmyTxOptions)
    console.log('REMOVE TOKEN', removeTokenTx.txStatus)
  }
}
