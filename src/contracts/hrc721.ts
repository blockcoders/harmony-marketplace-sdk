import { Transaction, TxStatus } from '@harmony-js/transaction'
import { ChainType, hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import { BridgedHRC721Token, HRC721EthManager, HRC721HmyManager, HRC721TokenManager } from '../bridge'
import { AddressZero, NetworkInfo } from '../constants'
import { BNish, BridgeManagers, HRC721Info, IBridgeToken, ITransactionOptions, TokenInfo } from '../interfaces'
import { getChainId, getRpc, isBNish, waitForNewBlock } from '../utils'
import { ContractError } from './baseContract'
import { BaseToken } from './baseToken'

export class HRC721 extends BaseToken implements IBridgeToken {
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

  public async setApprovalForAll(
    addressOperator: string,
    approved: boolean,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    if (!addressOperator) {
      throw new Error('You must provide an addressOperator')
    }
    return this.send('setApprovalForAll', [addressOperator, approved], txOptions)
  }

  public async isApprovedForAll(owner: string, operator: string, txOptions?: ITransactionOptions): Promise<boolean> {
    if (!owner || owner === AddressZero) {
      throw new ContractError('Invalid owner provided', 'isApprovedForAll')
    }

    if (!operator || operator === AddressZero) {
      throw new ContractError('Invalid operator provided', 'isApprovedForAll')
    }

    return this.call('isApprovedForAll', [owner, operator], txOptions)
  }

  public async totalSupply(txOptions?: ITransactionOptions): Promise<BN> {
    return this.call<BN>('totalSupply', [], txOptions)
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

  public async increaseAllowance(spender: string, value: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('increaseAllowance', [spender, value], txOptions)
  }

  public async decreaseAllowance(spender: string, value: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('decreaseAllowance', [spender, value], txOptions)
  }

  public mint(account: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('mint', [account, tokenId], txOptions)
  }

  public safeMint(to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('safeMint', [to, tokenId], txOptions)
  }

  public burn(tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('burn', [tokenId], txOptions)
  }

  public async getBridgedTokenAddress(
    ethManager: HRC721EthManager,
    tokenManager: HRC721TokenManager,
    tokenId: number,
    txOptions: ITransactionOptions,
  ) {
    // Get contract data
    const name = await this.name(txOptions)
    const symbol = await this.symbol(txOptions)
    const tokenURI = await this.tokenURI(tokenId, txOptions)

    const alreadyMapped = await ethManager.mappings(this.address)
    if (alreadyMapped === AddressZero) {
      // Add token manager
      const addTokenTx = await ethManager.addToken(tokenManager.address, this.address, name, symbol, tokenURI)
      console.info('HRC721EthManager addToken tx hash: ', addTokenTx.transactionHash)
    }
    return ethManager.mappings(this.address)
  }

  public async hmyToEth(
    managers: BridgeManagers,
    sender: string,
    recipient: string,
    tokenInfo: TokenInfo,
    network: NetworkInfo,
    txOptions: ITransactionOptions,
  ) {
    let { ethManager, hmyManager, tokenManager, ownerSignedToken: ownerHrc721, ownerSignedHmyManager } = managers || {}
    const ethManagerContract = ethManager as HRC721EthManager
    hmyManager = hmyManager as HRC721HmyManager
    tokenManager = tokenManager as HRC721TokenManager
    ownerHrc721 = ownerHrc721 as HRC721
    ownerSignedHmyManager = ownerSignedHmyManager as HRC721HmyManager

    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC721TokenManager rely tx hash: ', relyTx.transactionHash)

    // Verify parameters and balance
    const { tokenId } = tokenInfo.info as HRC721Info
    if (!tokenId) {
      throw Error('Error in tokenInfo, tokenId cannot be undefined for HRC721')
    }
    const balance = await this.balanceOf(sender, txOptions)
    if (balance < new BN(1)) {
      throw new Error(`Insufficient funds. Balance: ${balance}. TokenId: ${tokenId}`)
    }

    // Get Bridged Token address
    const erc721Addr = await this.getBridgedTokenAddress(ethManagerContract, tokenManager, tokenId, txOptions)
    console.log('ERC721 Bridged Token at address: ', erc721Addr)

    // Approve manager to lock tokens on Harmony network
    const approveTx = await ownerHrc721.approve(hmyManager.address, tokenId, txOptions)
    if (approveTx.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx}`)
    }
    console.log('Approve Harmony Manager to Lock Tokens. Transaction Status: ', approveTx.txStatus)

    // Lock tokens on Harmony Network to mint on Ethereum Network
    const lockTokenTx = await ownerSignedHmyManager.lockNFT721Token(this.address, tokenId, recipient, txOptions)
    if (lockTokenTx.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx}`)
    }
    console.log('Tokens Locked on Harmony Network. Transaction Status: ', lockTokenTx.txStatus)

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx.receipt?.blockNumber ?? ''), 10) + 6
    const RPC = getRpc(network)
    await waitForNewBlock(expectedBlockNumber, RPC, ChainType.Harmony, getChainId(network))

    // Mint tokens on Eth Network
    const mintTokenTx = await ethManagerContract.mintToken(erc721Addr, tokenId, recipient, lockTokenTx.id)
    if (mintTokenTx.status !== 1) {
      throw new Error(`Failed to mint tokens: ${mintTokenTx}`)
    }
    console.log('Minted tokens on the Ethereum Network. Transaction Hash: ', mintTokenTx.transactionHash)
  }

  public async ethToHmy(
    managers: BridgeManagers,
    sender: string,
    recipient: string,
    tokenInfo: TokenInfo,
    txOptions: ITransactionOptions,
  ) {
    let { ethManager, hmyManager, ownerSignedEthManager, bridgedToken } = managers || {}
    ownerSignedEthManager = ownerSignedEthManager as HRC721EthManager
    hmyManager = hmyManager as HRC721HmyManager
    const erc721 = bridgedToken as BridgedHRC721Token
    const erc721Addr = erc721.address
    console.log('ERC721 Bridged Token at address: ', erc721Addr)

    // Verify parameters and balance
    const balance = await erc721.balanceOf(sender)
    if (balance.toNumber() < 1) {
      throw Error('Insufficient funds')
    }
    const { tokenId } = tokenInfo.info as HRC721Info
    if (!tokenId) {
      throw Error('Error in tokenInfo, tokenId cannot be undefined for HRC721')
    }

    // Approve ethManager to burn tokens on the Ethereum Network
    const approveTx = await erc721.approve(ethManager.address, tokenId)
    console.info(
      'HRC721 approve EthManager to burn tokens on the Ethereum Network. Transaction Hash: ',
      approveTx.transactionHash,
    )

    // Burn tokens to unlock on Hamrnoy Network
    const burnTx = await ownerSignedEthManager.burnToken(erc721Addr, tokenId, recipient)
    const burnTokenTxHash = burnTx.transactionHash
    console.info('HRC20EthManager burnToken on the Ethereum Network. Transaction Hash: ', burnTokenTxHash)

    // Unlock tokens after burn
    const unlockTokenTx = await hmyManager.unlockToken(this.address, tokenId, recipient, burnTokenTxHash, txOptions)
    if (unlockTokenTx.txStatus !== TxStatus.CONFIRMED) {
      throw Error(`Failed to unlock tokens. Status: ${unlockTokenTx.txStatus}`)
    }
    console.info('HRC721HmyManager unlockToken on Harmony Network. Transaction Hash: ', unlockTokenTx.id)
  }
}
