import { TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import {
  DEFAULT_TX_OPTIONS,
  DEVNET_HRC20_CONTRACTS_ADDRESSES,
  MAINNET_HRC20_CONTRACTS_ADDRESSES,
  NetworkInfo,
} from '../constants'
import { HRC20 } from '../contracts'
import { HRC20Info, ITransactionOptions } from '../interfaces'
import { waitForNewBlock } from '../utils'
import { BridgeToken } from './bridgeToken'
import { HRC20EthManager } from './hrc20EthManager'
import { HRC20HmyManager } from './hrc20HmyManager'
import { HRC20TokenManager } from './hrc20TokenManager'

export class BridgeHRC20Token extends BridgeToken {
  public async ethToHmy(
    sender: string,
    recipient: string,
    network: NetworkInfo,
    token: HRC20,
    tokenInfo: HRC20Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ) {
    throw Error('Error on BridgeToken ethToHmy needs to be implemented in child class.')
  }

  public async hmyToEth(
    sender: string,
    recipient: string,
    network: NetworkInfo,
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

    const erc20Addr = await ethManager.mappings(token.address)
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
