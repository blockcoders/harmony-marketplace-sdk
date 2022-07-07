import { TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import {
  AddressZero,
  DEFAULT_TX_OPTIONS,
  DEVNET_HRC1155_CONTRACTS_ADDRESSES,
  HARMONY_RPC_WS,
  MAINNET_HRC1155_CONTRACTS_ADDRESSES,
} from '../constants'
import { HRC1155 } from '../contracts'
import { BNish, BridgeResponse, ContractAddresses, HRC1155Info, ITransactionOptions } from '../interfaces'
import { waitForNewBlock } from '../utils'
import { BridgeToken } from './bridgeToken'
import { BridgedHRC1155Token } from './bridgedHrc1155Token'
import { HRC1155EthManager } from './hrc1155EthManager'
import { HRC1155HmyManager } from './hrc1155HmyManager'
import { HRC1155TokenManager } from './hrc1155TokenManager'

export class BridgeHRC1155Token extends BridgeToken {
  private getContractAddresses(): ContractAddresses {
    return this.isMainnet ? MAINNET_HRC1155_CONTRACTS_ADDRESSES : DEVNET_HRC1155_CONTRACTS_ADDRESSES
  }

  public async getBridgedTokenAddress(token: HRC1155, tokenId: BNish, txOptions: ITransactionOptions): Promise<string> {
    const { ethManagerAddress, tokenManagerAddress } = this.getContractAddresses()
    const ethManager = new HRC1155EthManager(ethManagerAddress, this.ethOwnerWallet)
    const tokenManager = new HRC1155TokenManager(tokenManagerAddress, this.ethMasterWallet)
    let erc1155Addr = undefined
    // can throw an error if the mapping do not exist.
    try {
      erc1155Addr = await ethManager.mappings(token.address)
    } catch (err) {}

    if (!erc1155Addr || erc1155Addr === AddressZero) {
      const [name, symbol, tokenURI] = await Promise.all([
        token.name(txOptions),
        token.symbol(txOptions),
        token.tokenURI(tokenId, txOptions),
      ])

      await ethManager.addToken(tokenManager.address, token.address, name, symbol, tokenURI)

      erc1155Addr = await ethManager.mappings(token.address)
    }
    return erc1155Addr
  }

  public async ethToHmy(
    sender: string,
    recipient: string,
    token: HRC1155,
    tokenInfo: HRC1155Info,
  ): Promise<BridgeResponse> {
    const { ethManagerAddress } = this.getContractAddresses()
    const ethManager = new HRC1155EthManager(ethManagerAddress, this.ethOwnerWallet)
    const erc1155Address = await ethManager.mappings(token.address)
    const erc1155 = new BridgedHRC1155Token(erc1155Address, this.ethOwnerWallet)
    // Verify parameters and balances
    const { tokenIds, amounts } = tokenInfo

    if (!tokenIds || tokenIds.length === 0) {
      throw Error('Error in tokenInfo, tokenIds cannot be undefined nor empty for HRC1155')
    }

    if (!amounts || amounts.length === 0) {
      throw Error('Error in tokenInfo, amounts cannot be undefined nor empty for HRC1155')
    }

    // creates an array with the same account with a length equal to tokenIds
    const senderArray = tokenIds.map(() => sender)
    const balances = await erc1155.balanceOfBatch(senderArray, tokenIds)

    balances.forEach((balance, index) => {
      if (balance.lt(amounts[index])) {
        throw new Error(
          `Insufficient funds. Balance: ${balance}. TokenId: ${tokenIds[index]}. Amount: ${amounts[index]}`,
        )
      }
    })

    // Approve EthManager to burn the tokens on the Ethereum Network
    const approveTx = await erc1155.setApprovalForAll(ethManager.address, true)

    if (approveTx?.status !== 1) {
      throw new Error(`Failed to approve erc721: ${approveTx?.transactionHash}`)
    }

    // Burn tokens to unlock on Harmony Network
    const burnTx = await ethManager.burnTokens(erc1155Address, tokenIds, recipient, amounts)

    if (burnTx?.status !== 1) {
      throw new Error(`Failed to approve erc721: ${burnTx?.transactionHash}`)
    }

    return { addr: token.address, receiptId: burnTx?.transactionHash }
  }

  public async hmyToEth(
    sender: string,
    recipient: string,
    token: HRC1155,
    tokenInfo: HRC1155Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<BridgeResponse> {
    // Validate parameters and balance
    const { tokenIds, amounts, ws = HARMONY_RPC_WS, waitingFor = 12 } = tokenInfo

    if (!tokenIds || tokenIds.length === 0) {
      throw Error('Error in tokenInfo, tokenIds cannot be undefined nor empty for HRC1155')
    }

    if (!amounts || amounts.length === 0) {
      throw Error('Error in tokenInfo, amounts cannot be undefined nor empty for HRC1155')
    }

    if (amounts.length !== tokenIds.length) {
      throw Error('Error in tokenInfo, amounts length must be same as tokensIds length')
    }

    const { hmyManagerAddress } = this.getContractAddresses()
    const hmyManager = new HRC1155HmyManager(hmyManagerAddress, this.hmyOwnerWallet)
    // creates an array with the same account with a length equal to tokenIds
    const senderArray = tokenIds.map(() => sender)
    const balances = await token.balanceOfBatch(senderArray, tokenIds, txOptions)

    balances.forEach((balance, index) => {
      if (balance.lt(new BN(amounts[index]))) {
        throw new Error(
          `Insufficient funds. Balance: ${balance}. TokenId: ${tokenIds[index]}. Amount: ${amounts[index]}`,
        )
      }
    })

    // Get Bridged Token address
    const erc1155Addr = await this.getBridgedTokenAddress(token, tokenIds[0], txOptions)
    // Approve hmyManager
    const approveTx = await token.setApprovalForAll(hmyManager.address, true, txOptions)

    if (approveTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx}`)
    }

    // Lock tokens on Hmy side to mint on Eth side
    const lockTokenTx = await hmyManager.lockHRC1155Tokens(token.address, tokenIds, recipient, amounts, [], txOptions)
    if (lockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx}`)
    }

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx?.receipt?.blockNumber ?? ''), 10) + waitingFor

    await waitForNewBlock(expectedBlockNumber, ws, token.messenger.chainType, token.messenger.chainId)

    return { addr: erc1155Addr, receiptId: lockTokenTx?.id }
  }
}
