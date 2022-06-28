import { TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import {
  AddressZero,
  DEFAULT_TX_OPTIONS,
  DEVNET_HRC20_CONTRACTS_ADDRESSES,
  MAINNET_HRC20_CONTRACTS_ADDRESSES,
} from '../constants'
import { HRC20 } from '../contracts'
import { HRC20Info, ITransactionOptions } from '../interfaces'
import { waitForNewBlock } from '../utils'
import { BridgedHRC20Token } from './bridgedHrc20Token'
import { BridgeToken } from './bridgeToken'
import { HRC20EthManager } from './hrc20EthManager'
import { HRC20HmyManager } from './hrc20HmyManager'
import { HRC20TokenManager } from './hrc20TokenManager'

export class BridgeHRC20Token extends BridgeToken {
  public async ethToHmy(
    sender: string,
    recipient: string,
    token: HRC20,
    tokenInfo: HRC20Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ) {
    const { ethManagerAddress, hmyManagerAddress } = this.isMainnet
      ? MAINNET_HRC20_CONTRACTS_ADDRESSES
      : DEVNET_HRC20_CONTRACTS_ADDRESSES
    const hmyManager = new HRC20HmyManager(hmyManagerAddress, this.hmyMasterWallet)
    const ownerSignedEthManager = new HRC20EthManager(ethManagerAddress, this.ethOwnerWallet)
    const ethManager = new HRC20EthManager(ethManagerAddress, this.ethMasterWallet)
    const erc20Address = await ethManager.mappings(token.address)
    const erc20 = new BridgedHRC20Token(erc20Address, this.ethOwnerWallet)
    console.log('ERC20 Bridged Token at address: ', erc20Address)

    // Verify parameters and balance
    const { amount } = tokenInfo
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
    const burnTx = await ownerSignedEthManager.burnToken(erc20Address, amount, recipient)
    const burnTokenTxHash = burnTx?.transactionHash
    console.info('HRC20EthManager burnToken on the Ethereum Network. Transaction Hash: ', burnTokenTxHash)

    // Unlock Tokens on Harmony Netowrk
    const unlockTokenTx = await hmyManager.unlockToken(token.address, amount, recipient, burnTokenTxHash, txOptions)
    if (unlockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw Error(`Failed to unlock tokens. Status: ${unlockTokenTx?.txStatus}`)
    }
    console.info('HRC20HmyManager unlockToken on Harmony Network. Transaction Hash: ', unlockTokenTx?.id)
  }

  public async getBridgedTokenAddress(
    token: HRC20,
    ethManager: HRC20EthManager,
    tokenManager: HRC20TokenManager,
    txOptions: ITransactionOptions,
  ): Promise<string> {
    // Get contract data
    const name = await token.name(txOptions)
    const symbol = await token.symbol(txOptions)
    const decimals = await token.decimals(txOptions)
    const alreadyMapped = await ethManager.mappings(token.address)
    if (alreadyMapped === AddressZero) {
      // Add token manager
      const addTokenTx = await ethManager.addToken(tokenManager.address, token.address, name, symbol, decimals)
      console.info('HRC20EthManager addToken tx hash: ', addTokenTx?.transactionHash)
    }
    return ethManager.mappings(token.address)
  }

  public async hmyToEth(
    sender: string,
    recipient: string,
    token: HRC20,
    tokenInfo: HRC20Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ) {
    const { ethManagerAddress, hmyManagerAddress, tokenManagerAddress } = this.isMainnet
      ? MAINNET_HRC20_CONTRACTS_ADDRESSES
      : DEVNET_HRC20_CONTRACTS_ADDRESSES

    const hmyManager = new HRC20HmyManager(hmyManagerAddress, this.hmyMasterWallet)
    const ethManager = new HRC20EthManager(ethManagerAddress, this.ethMasterWallet)
    const tokenManager = new HRC20TokenManager(tokenManagerAddress, this.ethMasterWallet)
    const { amount } = tokenInfo

    if (!amount) {
      throw Error('Error in tokenInfo, amount cannot be undefined for HRC20')
    }
    const balance = await token.balanceOf(sender, txOptions)
    if (balance < new BN(amount)) {
      throw new Error(`Insufficient funds. Balance: ${balance}. Amount: ${amount}`)
    }

    // approve HRC20EthManager on HRC20TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC20TokenManager rely tx hash: ', relyTx?.transactionHash)

    // Get Bridged Token address
    const erc20Addr = await this.getBridgedTokenAddress(token, ethManager, tokenManager, txOptions)
    console.log('ERC20 Bridged Token at address: ', erc20Addr)

    // Approve hmyManager
    const approveTx = await token.approve(hmyManager.address, amount, txOptions)
    if (approveTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx}`)
    }
    console.log('Approve Harmony Manager to Lock Tokens. Transaction Status: ', approveTx?.txStatus)

    // Lock tokens on Hmy side to mint on Eth side
    const lockTokenTx = await hmyManager.lockTokenFor(token.address, sender, amount, recipient, txOptions)
    if (lockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx}`)
    }
    console.log('Tokens Locked on Harmony Network. Transaction Status: ', lockTokenTx?.txStatus)

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx?.receipt?.blockNumber ?? ''), 10) + 6

    await waitForNewBlock(
      expectedBlockNumber,
      token.messenger.provider.url,
      token.messenger.chainType,
      token.messenger.chainId,
    )

    // Mint tokens on Eth side
    const mintTokenTx = await ethManager.mintToken(erc20Addr, amount, recipient, lockTokenTx?.id)
    if (mintTokenTx?.status !== 1) {
      throw new Error(`Failed to mint tokens: ${mintTokenTx}`)
    }
    console.log('Minted tokens on the Ethereum Network. Transaction Hash: ', mintTokenTx?.transactionHash)
  }
}
