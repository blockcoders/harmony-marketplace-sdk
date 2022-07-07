import { TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import {
  AddressZero,
  DEFAULT_TX_OPTIONS,
  DEVNET_HRC20_CONTRACTS_ADDRESSES,
  HARMONY_RPC_WS,
  MAINNET_HRC20_CONTRACTS_ADDRESSES,
} from '../constants'
import { HRC20 } from '../contracts'
import { BridgeResponse, ContractAddresses, HRC20Info, ITransactionOptions } from '../interfaces'
import { waitForNewBlock } from '../utils'
import { BridgeToken } from './bridgeToken'
import { BridgedHRC20Token } from './bridgedHrc20Token'
import { HRC20EthManager } from './hrc20EthManager'
import { HRC20HmyManager } from './hrc20HmyManager'
import { HRC20TokenManager } from './hrc20TokenManager'

export class BridgeHRC20Token extends BridgeToken {
  private getContractAddresses(): ContractAddresses {
    return this.isMainnet ? MAINNET_HRC20_CONTRACTS_ADDRESSES : DEVNET_HRC20_CONTRACTS_ADDRESSES
  }

  public async getBridgedTokenAddress(
    token: HRC20,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<string> {
    const { ethManagerAddress, tokenManagerAddress } = this.getContractAddresses()
    const ethManager = new HRC20EthManager(ethManagerAddress, this.ethOwnerWallet)
    const tokenManager = new HRC20TokenManager(tokenManagerAddress, this.ethMasterWallet)

    let erc20Addr = undefined
    // can throw an error if the mapping do not exist.
    try {
      erc20Addr = await ethManager.mappings(token.address)
    } catch (err) {}

    if (!erc20Addr || erc20Addr === AddressZero) {
      const [name, symbol, decimals] = await Promise.all([
        token.name(txOptions),
        token.symbol(txOptions),
        token.decimals(txOptions),
      ])

      await ethManager.addToken(tokenManager.address, token.address, name, symbol, decimals)

      erc20Addr = await ethManager.mappings(token.address)
    }

    return erc20Addr
  }

  public async ethToHmy(
    sender: string,
    recipient: string,
    token: HRC20,
    tokenInfo: HRC20Info,
  ): Promise<BridgeResponse> {
    const { ethManagerAddress } = this.getContractAddresses()

    const ethManager = new HRC20EthManager(ethManagerAddress, this.ethOwnerWallet)
    const erc20Address = await ethManager.mappings(token.address)
    const erc20 = new BridgedHRC20Token(erc20Address, this.ethOwnerWallet)

    // Verify parameters and balance
    const { amount } = tokenInfo

    if (!amount) {
      throw Error('Error in tokenInfo, amount cannot be undefined for HRC20')
    }

    const balance = await erc20.balanceOf(sender)

    if (balance.lt(amount)) {
      throw Error('Insufficient funds')
    }

    // Approve EthManager to burn the tokens on the Ethereum Network
    const approveTx = await erc20.approve(ethManager.address, amount)

    if (approveTx?.status !== 1) {
      throw new Error(`Failed to approve erc20: ${approveTx?.transactionHash}`)
    }

    // Burn tokens to unlock on Harmony Network
    const burnTx = await ethManager.burnToken(erc20Address, amount, recipient)

    if (burnTx?.status !== 1) {
      throw new Error(`Failed to approve erc20: ${burnTx?.transactionHash}`)
    }

    return { addr: token.address, receiptId: burnTx?.transactionHash }
  }

  public async hmyToEth(
    sender: string,
    recipient: string,
    token: HRC20,
    tokenInfo: HRC20Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<BridgeResponse> {
    // Verify parameters and balance
    const { amount, ws = HARMONY_RPC_WS, waitingFor = 12 } = tokenInfo

    if (!amount) {
      throw Error('Error in tokenInfo, amount cannot be undefined for HRC20')
    }

    const balance = await token.balanceOf(sender, txOptions)

    if (balance.lt(new BN(amount))) {
      throw new Error(`Insufficient funds. Balance: ${balance}. Amount: ${amount}`)
    }

    const { hmyManagerAddress } = this.getContractAddresses()
    const hmyManager = new HRC20HmyManager(hmyManagerAddress, this.hmyOwnerWallet)
    // Get Bridged Token address
    const erc20Addr = await this.getBridgedTokenAddress(token, txOptions)
    // Approve hmyManager
    const approveTx = await token.approve(hmyManager.address, amount, txOptions)

    if (approveTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx?.id}`)
    }

    // Lock tokens on Hmy side to mint on Eth side
    const lockTokenTx = await hmyManager.lockToken(token.address, amount, recipient, txOptions)

    if (lockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx?.id}`)
    }

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx?.receipt?.blockNumber ?? ''), 10) + waitingFor

    await waitForNewBlock(expectedBlockNumber, ws, token.messenger.chainType, token.messenger.chainId)

    return { addr: erc20Addr, receiptId: lockTokenTx?.id }
  }
}
