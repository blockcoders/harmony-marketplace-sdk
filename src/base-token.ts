import { Account } from '@harmony-js/account'
import { Transaction } from '@harmony-js/transaction'
import BN from 'bn.js'
import { ACTION_TYPE, BridgeSDK, EXCHANGE_MODE } from 'bridge-sdk'
import { withDecimals } from 'bridge-sdk/lib/blockchain/utils'
import { testnet, mainnet } from 'bridge-sdk/lib/configs'
import { abi as HmyDepositABI } from './abi-hmy-deposit'
import { abi as ERC721HmyManager } from './abi-hmy-manager-erc721'
import { BaseTokenContract, ContractError } from './base-token-contract'
import { AddressZero } from './constants'
import { HarmonyDepositContract } from './hmy-deposit'
import { HarmonyManagerContract } from './hmy-manager'
import { BNish, BridgeApprovalParams, BridgeParams, ITransactionOptions, TokenInfo } from './interfaces'
import { Key } from './key'
import { MnemonicKey } from './mnemonic-key'
import { PrivateKey } from './private-key'
import { isBNish } from './utils'

export abstract class BaseToken extends BaseTokenContract {
  protected async getBalance(address: string, id?: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    if (!address || address === AddressZero) {
      throw new ContractError('Invalid address provided', '_getBalance')
    }

    const args: any[] = [address]

    if (isBNish(id)) {
      args.push(id)
    }

    return this.call<BN>('balanceOf', args, txOptions)
  }

  protected sanitizeAddress(address: string): string {
    return address.toLowerCase()
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

  public setSignerByPrivateKey(privateKey: string): Account {
    const account = this._contract.wallet.addByPrivateKey(privateKey)

    // Force the new account as defaultSigner
    if (account.address) {
      this._contract.wallet.setSigner(account.address)
    }

    return account
  }

  public setSignerByMnemonic(mnemonic: string, index = 0): Account {
    const account = this._contract.wallet.addByMnemonic(mnemonic, index)

    // Force the new account as defaultSigner
    if (account.address) {
      this._contract.wallet.setSigner(account.address)
    }

    return account
  }

  public setSignerByKey(key: Key | PrivateKey | MnemonicKey): void {
    this._contract.connect(key)
  }

  public async bridgeToken(options: BridgeParams, walletPK: string, txOptions?: ITransactionOptions): Promise<void> {
    if (!options.ethAddress) {
      throw new Error('ethAddress is required')
    }

    if (!options.oneAddress) {
      throw new Error('oneAddress is required')
    }

    if (options.amount === 0) {
      throw new Error('amount must be greater than zero')
    }

    if (!walletPK) {
      throw new Error('walletPK is required')
    }

    const bridgeSDK = new BridgeSDK({ logLevel: 2 }) // 2 - full logs, 1 - only success & errors, 0 - logs off

    const initParams = options?.isMainnet ? mainnet : testnet
    await bridgeSDK.init(initParams)
    if (options.type === EXCHANGE_MODE.ETH_TO_ONE) {
      await this.ethToOne(options, bridgeSDK, initParams, txOptions)
    } else {
      await this.oneToEth(options, bridgeSDK, initParams, txOptions)
    }
  }

  private async ethToOne(
    options: BridgeParams,
    bridgeSDK: BridgeSDK,
    initParams: typeof testnet | typeof mainnet,
    txOptions?: ITransactionOptions,
  ) {
    throw new Error(`Error not implemented yet ${options}, ${bridgeSDK}, ${initParams}, ${txOptions}`)
  }

  // For now, this should allow the caller to send an ERC721 token from the Harmony Network to the Ethereum Network
  private async oneToEth(
    options: BridgeParams,
    bridgeSDK: BridgeSDK,
    initParams: typeof testnet | typeof mainnet,
    txOptions?: ITransactionOptions,
  ) {
    try {
      const {} = initParams || {}

      // Creation of contracts
      const { erc721Manager, depositManager } = initParams.hmyClient.contracts
      const hmyManagerContract = new HarmonyManagerContract(erc721Manager, ERC721HmyManager, this._provider)
      const depositContract = new HarmonyDepositContract(depositManager, HmyDepositABI, this._provider)

      const { type, token, amount, oneAddress, ethAddress, tokenInfo } = options || {}
      if (tokenInfo === undefined || tokenInfo.tokenId === undefined) {
        throw Error('You must provide token address and token id')
      }

      const operation = await bridgeSDK.createOperation({
        type,
        token,
        amount,
        oneAddress,
        ethAddress,
      })

      //----------------- Deposit One Step -----------------//
      const depositAmount = operation?.operation?.actions[0]?.depositAmount
      if (depositAmount === undefined) {
        throw Error(`deposit amount cannot be undefined ${operation}`)
      }

      await this.bridgeDeposit(
        depositContract,
        depositAmount,
        async (transactionHash: string) => {
          console.log('Deposit hash: ', transactionHash)

          await operation.confirmAction({
            actionType: ACTION_TYPE.depositOne,
            transactionHash,
          })
        },
        txOptions,
      )
      await operation.waitActionComplete(ACTION_TYPE.depositOne)
      //----------------------------------------------------//

      //----------------- Approve Step -----------------//
      await this.bridgeApproval(
        // This param will send 'tokenId' property for ERC721 and the 'approved' property
        //for ERC1155 as the approve step is different for each case
        { to: erc721Manager, tokenId: tokenInfo.tokenId },
        async (transactionHash: string) => {
          console.log('Approve hash: ', transactionHash)

          await operation.confirmAction({
            actionType: ACTION_TYPE.approveHmyManger,
            transactionHash,
          })
        },
        txOptions,
      )
      await operation.waitActionComplete(ACTION_TYPE.approveHmyManger)
      //------------------------------------------------//

      //----------------- Burn Step -----------------//
      await this.bridgeBurnToken(
        hmyManagerContract,
        tokenInfo,
        ethAddress,
        async (transactionHash) => {
          console.log('Burn hash: ', transactionHash)

          await operation.confirmAction({
            actionType: ACTION_TYPE.burnToken,
            transactionHash,
          })
        },
        txOptions,
      )
      await operation.waitActionComplete(ACTION_TYPE.burnToken)
      //--------------------------------------------//
      await operation.waitOperationComplete()
    } catch (e: any) {
      console.log('Error: ', e)
    }
  }

  // Implemented at hrc721.ts (hrc1155 is not implemented yet)
  protected abstract bridgeApproval(
    data: BridgeApprovalParams,
    sendTxCallback: (tx: string) => void,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction>

  private async bridgeDeposit(
    depositContract: HarmonyDepositContract,
    amount: number,
    sendTxCallback: (tx: string) => void,
    txOptions?: ITransactionOptions,
  ): Promise<Transaction> {
    try {
      console.log('DEPOSIT')
      const depositTx = await depositContract.deposit(withDecimals(amount, 18), txOptions)
      if (depositTx.txStatus !== 'CONFIRMED') {
        throw Error(`Transaction ${depositTx.txStatus}: ${depositTx}`)
      }
      await sendTxCallback(depositTx.id)
      return depositTx
    } catch (e) {
      throw Error(`Error while executing bridgeDeposit: ${e}`)
    }
  }

  private async bridgeBurnToken(
    managerContract: HarmonyManagerContract,
    tokenInfo: TokenInfo,
    recipient: string,
    sendTxCallback: (hash: string) => void,
    txOptions?: ITransactionOptions,
  ) {
    try {
      console.log('BURN')
      if (!tokenInfo.tokenId) {
        throw Error(`Token Id must be provided. Token info: ${tokenInfo}`)
      }
      const tokenId = parseInt(tokenInfo.tokenId)
      const burnTx = await managerContract.burnToken(tokenInfo.tokenAddress, tokenId, recipient, txOptions) // tokenAddress is the ERC721 token address
      if (burnTx.txStatus !== 'CONFIRMED') {
        console.log(burnTx)
        throw Error(`Transaction ${burnTx.txStatus}`)
      }
      await sendTxCallback(burnTx.id)
      return burnTx
    } catch (e) {
      throw Error(`Error while executing bridgeBurnToken: ${e}`)
    }
  }
}
