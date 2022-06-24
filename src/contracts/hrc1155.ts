import { Transaction, TxStatus } from '@harmony-js/transaction'
import BN from 'bn.js'
import * as Utils from '../utils'
import { BridgedHRC1155Token, HRC1155EthManager, HRC1155HmyManager, HRC1155TokenManager } from '../bridge'
import { AddressZero, NetworkInfo } from '../constants'
import { BNish, BridgeManagers, HRC1155Info, IBridgeToken, ITransactionOptions, TokenInfo } from '../interfaces'
import { ContractError } from './baseContract'
import { BaseToken } from './baseToken'
import { hexToNumber, ChainType } from '@harmony-js/utils'

export class HRC1155 extends BaseToken implements IBridgeToken {
  public async balanceOf(address: string, id: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    return this.getBalance(address, id, txOptions)
  }

  public async balanceOfBatch(accounts: string[], ids: BNish[], txOptions?: ITransactionOptions): Promise<BN[]> {
    if (accounts.length !== ids.length) {
      throw new ContractError('Accounts and ids must have the same length', 'balanceOfBatch')
    }

    return this.call<BN[]>('balanceOfBatch', [accounts, ids], txOptions)
  }

  public async safeTransferFrom(
    from: string,
    to: string,
    id: BNish,
    amount: BNish,
    data: any,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    if (to === AddressZero) {
      throw new ContractError(`The to cannot be the ${AddressZero}`, 'safeTransferFrom')
    }

    return this.send('safeTransferFrom', [from, to, id, amount, data], txOptions)
  }

  public async safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BNish[],
    amounts: BNish[],
    data: any,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    if (amounts.length !== ids.length) {
      throw new ContractError('amounts and ids must have the same length', 'safeBatchTransferFrom')
    }

    return this.send('safeBatchTransferFrom', [from, to, ids, amounts, data], txOptions)
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

  public async owner(txOptions?: ITransactionOptions): Promise<string> {
    const address = await this.call<string>('owner', [], txOptions)

    return this.sanitizeAddress(address)
  }

  public async tokenURIPrefix(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('tokenURIPrefix', [], txOptions)
  }

  public async contractURI(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('contractURI', [], txOptions)
  }

  public async totalSupply(id: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    return this.call<BN>('totalSupply', [id], txOptions)
  }

  public async tokenURI(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string> {
    if (!Utils.isBNish(tokenId)) {
      throw new ContractError('You must provide a tokenId', 'uri')
    }

    return this.call<string>('uri', [tokenId], txOptions)
  }

  public async symbol(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('symbol', [], txOptions)
  }

  public async name(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('name', [], txOptions)
  }

  public mint(account: string, tokenId: BNish, amount: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('mint', [account, tokenId, amount, []], txOptions)
  }

  public async getBridgedTokenAddress(
    ethManager: HRC1155EthManager,
    tokenManager: HRC1155TokenManager,
    tokenId: BNish,
    txOptions: ITransactionOptions,
  ): Promise<string> {
    // Get contract data
    const name = await this.name(txOptions)
    const symbol = await this.symbol(txOptions)
    const tokenURI = await this.tokenURI(tokenId, txOptions)
    const alreadyMapped = await ethManager.mappings(this.address)
    if (alreadyMapped === AddressZero) {
      // Add token manager
      const addTokenTx = await ethManager.addToken(tokenManager.address, this.address, name, symbol, tokenURI)
      console.info('HRC1155EthManager addToken tx hash: ', addTokenTx?.transactionHash)
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
    let { ethManager, hmyManager, tokenManager, ownerSignedToken: ownerHrc1155, ownerSignedHmyManager } = managers || {}
    ethManager = ethManager as HRC1155EthManager
    hmyManager = hmyManager as HRC1155HmyManager
    tokenManager = tokenManager as HRC1155TokenManager
    ownerHrc1155 = ownerHrc1155 as HRC1155
    ownerSignedHmyManager = ownerSignedHmyManager as HRC1155HmyManager

    // Validate parameters and balance
    const { tokenIds, amounts } = tokenInfo.info as HRC1155Info
    if (!tokenIds || tokenIds.length === 0) {
      throw Error('Error in tokenInfo, tokenIds cannot be undefined nor empty for HRC1155')
    }
    if (!amounts || amounts.length === 0) {
      throw Error('Error in tokenInfo, amounts cannot be undefined nor empty for HRC1155')
    }
    if (amounts.length !== tokenIds.length) {
      throw Error('Error in tokenInfo, amounts length must be same as tokensIds length')
    }
    // creates an array with the same account with a length equal to tokenIds
    const senderArray = tokenIds.map(() => sender)
    const balances = await this.balanceOfBatch(senderArray, tokenIds, txOptions)
    balances.forEach((balance, index)=> {
      if (balance < new BN(amounts[index])) {
        throw new Error(`Insufficient funds. Balance: ${balance}. TokenId: ${tokenIds[index]}. Amount: ${amounts[index]}`)
      }
    })

    // approve HRC1155EthManager on HRC1155TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC1155TokenManager rely tx hash: ', relyTx.transactionHash)

    // Get Bridged Token address
    const erc1155Addr = await this.getBridgedTokenAddress(ethManager, tokenManager, tokenIds[0],txOptions)
    console.log('ERC1155 Bridged Token at address: ', erc1155Addr)

    // Approve hmyManager
    const approveTx = await ownerHrc1155.setApprovalForAll(hmyManager.address, true, txOptions)
    if (approveTx.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx}`)
    }
    console.log('Approve Harmony Manager to Lock Tokens. Transaction Status: ', approveTx.txStatus)

    // Lock tokens on Hmy side to mint on Eth side
    const lockTokenTx = await ownerSignedHmyManager.lockHRC1155Tokens(
      this.address,
      tokenIds,
      recipient,
      amounts,
      [],
      txOptions,
    )
    if (lockTokenTx.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx}`)
    }
    console.log('Tokens Locked (lockHRC1155Tokens) on Harmony Network. Transaction Status: ', lockTokenTx.txStatus)

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx.receipt?.blockNumber ?? ''), 10) + 6
    const RPC = Utils.getRpc(network)
    await Utils.waitForNewBlock(expectedBlockNumber, RPC, ChainType.Harmony, Utils.getChainId(network))
    
    // Mint tokens on Eth side
    const mintTokenTx = await ethManager.mintTokens(erc1155Addr, tokenIds, recipient, lockTokenTx.id, amounts, [])
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
    ownerSignedEthManager = ownerSignedEthManager as HRC1155EthManager
    hmyManager = hmyManager as HRC1155HmyManager
    const erc1155 = bridgedToken as BridgedHRC1155Token
    const erc1155Addr = erc1155.address
    console.log('ERC1155 Bridged Token at address: ', erc1155Addr)

    // Verify parameters and balances
    const { tokenIds, amounts } = tokenInfo.info as HRC1155Info
    if (!tokenIds || tokenIds.length === 0) {
      throw Error('Error in tokenInfo, tokenIds cannot be undefined nor empty for HRC1155')
    }
    if (!amounts || amounts.length === 0) {
      throw Error('Error in tokenInfo, amounts cannot be undefined nor empty for HRC1155')
    }
    // creates an array with the same account with a length equal to tokenIds
    const senderArray = tokenIds.map(() => sender)
    const balances = await erc1155.balanceOfBatch(senderArray, tokenIds)
    balances.forEach((balance, index)=> {
      if (balance.toNumber() < amounts[index]) {
        throw new Error(`Insufficient funds. Balance: ${balance}. TokenId: ${tokenIds[index]}. Amount: ${amounts[index]}`)
      }
    })

    // Approve EthManager to burn the tokens on the Ethereum Network
    const approveTx = await erc1155.setApprovalForAll(ethManager.address, true)
    console.info(
      'HRC1155 setApprovalForAll EthManager to burn tokens on the Ethereum Network. Transaction Hash: ',
      approveTx.transactionHash,
    )

    // Burn tokens to unlock on Harmony Network
    const burnTx = await ownerSignedEthManager.burnTokens(erc1155Addr, tokenIds, recipient, amounts)
    const burnTokenTxHash = burnTx.transactionHash
    console.info('HRC1155EthManager burnToken on the Ethereum Network. Transaction Hash: ', burnTokenTxHash)

    // Unlock Tokens on Harmony Netowrk
    const unlockTokenTx = await hmyManager.unlockHRC1155Tokens(
      this.address,
      tokenIds,
      recipient,
      burnTokenTxHash,
      amounts,
      [],
      txOptions,
    )
    if (unlockTokenTx.txStatus !== TxStatus.CONFIRMED) {
      throw Error(`Failed to unlock tokens. Status: ${unlockTokenTx.txStatus}`)
    }
    console.info('HRC1155HmyManager unlockHRC1155Tokens on Harmony Network. Transaction Hash: ', unlockTokenTx.id)
  }
}
