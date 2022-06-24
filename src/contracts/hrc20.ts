import { Transaction, TxStatus } from '@harmony-js/transaction'
import BN from 'bn.js'
import { AddressZero, DEFAULT_TX_OPTIONS, NetworkInfo } from '../constants'
import { BNish, BridgeManagers, HRC20Info, IBridgeToken, ITransactionOptions, TokenInfo } from '../interfaces'
import { BaseToken } from './baseToken'
import { ChainType, hexToNumber } from '@harmony-js/utils'
import * as Utils from '../utils'
import { BridgedHRC20Token, HRC20EthManager, HRC20HmyManager, HRC20TokenManager } from '../bridge'

export class HRC20 extends BaseToken implements IBridgeToken {
  public async totalSupply(txOptions?: ITransactionOptions): Promise<BN> {
    return this.call<BN>('totalSupply', [], txOptions)
  }

  public async balanceOf(address: string, txOptions?: ITransactionOptions): Promise<BN> {
    return await this.getBalance(address, undefined, txOptions)
  }

  public async transfer(to: string, amount: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('transfer', [to, amount], txOptions)
  }

  public async allowance(owner: string, spender: string, txOptions?: ITransactionOptions): Promise<BN> {
    return this.call<BN>('allowance', [owner, spender], txOptions)
  }

  public async approve(spender: string, amount: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('approve', [spender, amount], txOptions)
  }

  public async transferFrom(
    from: string,
    to: string,
    amount: BNish,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    return this.send('transferFrom', [from, to, amount], txOptions)
  }

  public async symbol(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('symbol', [], txOptions)
  }

  public async name(txOptions?: ITransactionOptions): Promise<string> {
    return this.call<string>('name', [], txOptions)
  }

  public async decimals(txOptions?: ITransactionOptions): Promise<number> {
    return this.call<number>('decimals', [], txOptions)
  }

  public mint(account: string, amount: BNish, txOptions?: ITransactionOptions): Promise<Transaction> {
    return this.send('mint', [account, amount], txOptions)
  }

  public burn(amount: number, txOptions?: ITransactionOptions) {
    return this.send('burn', [amount], txOptions)
  }

  public burnFrom(account: string, amount: number, txOptions?: ITransactionOptions) {
    return this.send('burnFrom', [account, amount], txOptions)
  }

  public async getBridgedTokenAddress(
    ethManager: HRC20EthManager,
    tokenManager: HRC20TokenManager,
    txOptions: ITransactionOptions,
  ): Promise<string> {
    // Get contract data
    const name = await this.name(txOptions)
    const symbol = await this.symbol(txOptions)
    const decimals = await this.decimals(txOptions)
    const alreadyMapped = await ethManager.mappings(this.address)
    if (alreadyMapped === AddressZero) {
      // Add token manager
      const addTokenTx = await ethManager.addToken(tokenManager.address, this.address, name, symbol, decimals)
      console.info('HRC20EthManager addToken tx hash: ', addTokenTx?.transactionHash)
    }
    return ethManager.mappings(this.address)
  }

  public async hmyToEth(
    managers: BridgeManagers,
    sender: string,
    recipient: string,
    tokenInfo: TokenInfo,
    network: NetworkInfo,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ) {
    let { ethManager, hmyManager, tokenManager, ownerSignedToken: ownerHrc20 } = managers || {}
    ethManager = ethManager as HRC20EthManager
    hmyManager = hmyManager as HRC20HmyManager
    tokenManager = tokenManager as HRC20TokenManager

    // Validate parameters and balance
    const { amount } = (tokenInfo.info as HRC20Info) || {}
    if (!amount) {
      throw Error('Error in tokenInfo, amount cannot be undefined for HRC20')
    }
    const balance = await this.balanceOf(sender, txOptions)
    if (balance < new BN(amount)) {
      throw new Error(`Insufficient funds. Balance: ${balance}. Amount: ${amount}`)
    }

    // approve HRC20EthManager on HRC20TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC20TokenManager rely tx hash: ', relyTx?.transactionHash)

    // Get Bridged Token address
    const erc20Addr = await this.getBridgedTokenAddress(ethManager, tokenManager, txOptions)
    console.log('ERC20 Bridged Token at address: ', erc20Addr)

    // Approve hmyManager
    const approveTx = await (ownerHrc20 as HRC20).approve(hmyManager.address, amount, txOptions)
    if (approveTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx}`)
    }
    console.log('Approve Harmony Manager to Lock Tokens. Transaction Status: ', approveTx?.txStatus)

    // Lock tokens on Hmy side to mint on Eth side
    const lockTokenTx = await hmyManager.lockTokenFor(this.address, sender, amount, recipient, txOptions)
    if (lockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx}`)
    }
    console.log('Tokens Locked on Harmony Network. Transaction Status: ', lockTokenTx?.txStatus)

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx?.receipt?.blockNumber ?? ''), 10) + 6
    const RPC = Utils.getRpc(network)
    await Utils.waitForNewBlock(expectedBlockNumber, RPC, ChainType.Harmony, Utils.getChainId(network))

    // Mint tokens on Eth side
    const mintTokenTx = await ethManager.mintToken(erc20Addr, amount, recipient, lockTokenTx?.id)
    if (mintTokenTx?.status !== 1) {
      throw new Error(`Failed to mint tokens: ${mintTokenTx}`)
    }
    console.log('Minted tokens on the Ethereum Network. Transaction Hash: ', mintTokenTx?.transactionHash)
  }

  public async ethToHmy(
    managers: BridgeManagers,
    sender: string,
    recipient: string,
    tokenInfo: TokenInfo,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ) {
    let { ethManager, hmyManager, ownerSignedEthManager, bridgedToken } = managers || {}
    ownerSignedEthManager = ownerSignedEthManager as HRC20EthManager
    hmyManager = hmyManager as HRC20HmyManager
    const erc20 = bridgedToken as BridgedHRC20Token
    const erc20Addr = erc20.address
    console.log('ERC20 Bridged Token at address: ', erc20Addr)

    // Verify parameters and balance
    const { amount } = (tokenInfo.info as HRC20Info) || {}
    if (!amount) {
      throw Error('Error in tokenInfo, amount cannot be undefined for HRC20')
    }
    const balance = await erc20.balanceOf(sender)
    if (balance.toNumber() < amount) {
      throw Error('Insufficient funds')
    }

    // Approve EthManager to burn the tokens on the Ethereum Network
    const approveTx = await erc20.approve(ethManager.address, amount)
    console.info(
      'HRC20 approve EthManager to burn tokens on the Ethereum Network. Transaction Hash: ',
      approveTx?.transactionHash,
    )

    // Burn tokens to unlock on Harmony Network
    const burnTx = await ownerSignedEthManager.burnToken(erc20Addr, amount, recipient)
    const burnTokenTxHash = burnTx?.transactionHash
    console.info('HRC20EthManager burnToken on the Ethereum Network. Transaction Hash: ', burnTokenTxHash)

    // Unlock Tokens on Harmony Netowrk
    const unlockTokenTx = await hmyManager.unlockToken(this.address, amount, recipient, burnTokenTxHash, txOptions)
    if (unlockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw Error(`Failed to unlock tokens. Status: ${unlockTokenTx?.txStatus}`)
    }
    console.info('HRC20HmyManager unlockToken on Harmony Network. Transaction Hash: ', unlockTokenTx?.id)
  }
}
