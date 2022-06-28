import { Transaction, TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import {
  DEFAULT_TX_OPTIONS,
  DEVNET_HRC1155_CONTRACTS_ADDRESSES,
  MAINNET_HRC1155_CONTRACTS_ADDRESSES,
} from '../constants'
import { HRC1155 } from '../contracts'
import ABI from './hrc1155/abi'
import { BNish, HRC1155Info, ITransactionOptions } from '../interfaces'
import { waitForNewBlock } from '../utils'
import { BridgedHRC1155Token } from './bridgedHrc1155Token'
import { BridgeToken } from './bridgeToken'
import { HRC1155EthManager } from './hrc1155EthManager'
import { HRC1155HmyManager } from './hrc1155HmyManager'
import { HRC1155TokenManager } from './hrc1155TokenManager'
import { TransactionReceipt } from '@ethersproject/providers'

export class BridgeHRC1155Token extends BridgeToken {
  public async ethToHmy(
    sender: string,
    recipient: string,
    token: HRC1155,
    tokenInfo: HRC1155Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<Transaction> {
    const { ethManagerAddress, hmyManagerAddress } = this.isMainnet
      ? MAINNET_HRC1155_CONTRACTS_ADDRESSES
      : DEVNET_HRC1155_CONTRACTS_ADDRESSES
    const hmyManager = new HRC1155HmyManager(hmyManagerAddress, this.hmyMasterWallet)
    const ownerSignedEthManager = new HRC1155EthManager(ethManagerAddress, this.ethOwnerWallet)
    const ethManager = new HRC1155EthManager(ethManagerAddress, this.ethMasterWallet)
    const erc1155Address = await ethManager.mappings(token.address)
    const erc1155 = new BridgedHRC1155Token(erc1155Address, this.ethOwnerWallet)
    console.log('ERC1155 Bridged Token at address: ', erc1155Address)

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
      if (balance.toNumber() < amounts[index]) {
        throw new Error(
          `Insufficient funds. Balance: ${balance}. TokenId: ${tokenIds[index]}. Amount: ${amounts[index]}`,
        )
      }
    })

    // Approve EthManager to burn the tokens on the Ethereum Network
    const approveTx = await erc1155.setApprovalForAll(ethManager.address, true)
    console.info(
      'HRC1155 setApprovalForAll EthManager to burn tokens on the Ethereum Network. Transaction Hash: ',
      approveTx?.transactionHash,
    )

    // Burn tokens to unlock on Harmony Network
    const burnTx = await ownerSignedEthManager.burnTokens(erc1155Address, tokenIds, recipient, amounts)
    const burnTokenTxHash = burnTx?.transactionHash
    console.info('HRC1155EthManager burnToken on the Ethereum Network. Transaction Hash: ', burnTokenTxHash)

    // Unlock Tokens on Harmony Netowrk
    const unlockTokenTx = await hmyManager.unlockHRC1155Tokens(
      token.address,
      tokenIds,
      recipient,
      burnTokenTxHash,
      amounts,
      [],
      txOptions,
    )
    if (unlockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw Error(`Failed to unlock tokens. Status: ${unlockTokenTx?.txStatus}`)
    }
    console.info('HRC1155HmyManager unlockHRC1155Tokens on Harmony Network. Transaction Hash: ', unlockTokenTx?.id)
    return unlockTokenTx
  }

  public async getBridgedTokenAddress(
    token: HRC1155,
    tokenId: BNish,
    ethManager: HRC1155EthManager,
    tokenManager: HRC1155TokenManager,
    txOptions: ITransactionOptions,
  ): Promise<string> {
    let erc1155Addr = undefined
    // can throw an error if the mapping do not exist.
    try {
      erc1155Addr = await ethManager.mappings(token.address)
    } catch (err) {}

    if (!erc1155Addr) {
      const [name, symbol, tokenURI] = await Promise.all([
        token.name(txOptions),
        token.symbol(txOptions),
        token.tokenURI(tokenId, txOptions),
      ])

      const addTokenTx = await ethManager.addToken(tokenManager.address, token.address, name, symbol, tokenURI)
      console.info('HRC20EthManager addToken tx hash: ', addTokenTx?.transactionHash)

      erc1155Addr = await ethManager.mappings(token.address)
    }
    return erc1155Addr
  }

  public async hmyToEth(
    sender: string,
    recipient: string,
    token: HRC1155,
    tokenInfo: HRC1155Info,
    txOptions: ITransactionOptions = DEFAULT_TX_OPTIONS,
  ): Promise<TransactionReceipt> {
    // Validate parameters and balance
    const { tokenIds, amounts } = tokenInfo
    if (!tokenIds || tokenIds.length === 0) {
      throw Error('Error in tokenInfo, tokenIds cannot be undefined nor empty for HRC1155')
    }
    if (!amounts || amounts.length === 0) {
      throw Error('Error in tokenInfo, amounts cannot be undefined nor empty for HRC1155')
    }
    if (amounts.length !== tokenIds.length) {
      throw Error('Error in tokenInfo, amounts length must be same as tokensIds length')
    }
    
    const { ethManagerAddress, hmyManagerAddress, tokenManagerAddress } = this.isMainnet
      ? MAINNET_HRC1155_CONTRACTS_ADDRESSES
      : DEVNET_HRC1155_CONTRACTS_ADDRESSES

    const hmyManager = new HRC1155HmyManager(hmyManagerAddress, this.hmyMasterWallet)
    const ownerSignedHmyManager = new HRC1155HmyManager(hmyManagerAddress, this.hmyOwnerWallet)
    const ethManager = new HRC1155EthManager(ethManagerAddress, this.ethMasterWallet)
    const tokenManager = new HRC1155TokenManager(tokenManagerAddress, this.ethMasterWallet)
    const ownerHrc1155 = new HRC1155(token.address, ABI, this.hmyOwnerWallet)
    
    // creates an array with the same account with a length equal to tokenIds
    const senderArray = tokenIds.map(() => sender)
    const balances = await token.balanceOfBatch(senderArray, tokenIds, txOptions)
    balances.forEach((balance, index) => {
      if (balance < new BN(amounts[index])) {
        throw new Error(
          `Insufficient funds. Balance: ${balance}. TokenId: ${tokenIds[index]}. Amount: ${amounts[index]}`,
        )
      }
    })

    // approve HRC1155EthManager on HRC1155TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC1155TokenManager rely tx hash: ', relyTx?.transactionHash)

    // Get Bridged Token address
    const erc1155Addr = await this.getBridgedTokenAddress(token, tokenIds[0], ethManager, tokenManager, txOptions)
    console.log('ERC1155 Bridged Token at address: ', erc1155Addr)

    // Approve hmyManager
    const approveTx = await ownerHrc1155.setApprovalForAll(hmyManager.address, true, txOptions)
    if (approveTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to approve manager: ${approveTx}`)
    }
    console.log('Approve Harmony Manager to Lock Tokens. Transaction Status: ', approveTx?.txStatus)

    // Lock tokens on Hmy side to mint on Eth side
    const lockTokenTx = await ownerSignedHmyManager.lockHRC1155Tokens(
      token.address,
      tokenIds,
      recipient,
      amounts,
      [],
      txOptions,
    )
    if (lockTokenTx?.txStatus !== TxStatus.CONFIRMED) {
      throw new Error(`Failed to lock tokens: ${lockTokenTx}`)
    }
    console.log('Tokens Locked (lockHRC1155Tokens) on Harmony Network. Transaction Status: ', lockTokenTx?.txStatus)

    // Wait for safety reasons
    const expectedBlockNumber = parseInt(hexToNumber(lockTokenTx?.receipt?.blockNumber ?? ''), 10) + 6

    await waitForNewBlock(
      expectedBlockNumber,
      token.messenger.provider.url,
      token.messenger.chainType,
      token.messenger.chainId,
    )
    // Mint tokens on Eth side
    const mintTokenTx = await ethManager.mintTokens(erc1155Addr, tokenIds, recipient, lockTokenTx?.id, amounts, [])
    if (mintTokenTx?.status !== 1) {
      throw new Error(`Failed to mint tokens: ${mintTokenTx}`)
    }
    console.log('Minted tokens on the Ethereum Network. Transaction Hash: ', mintTokenTx?.transactionHash)
    return mintTokenTx
  }
}
