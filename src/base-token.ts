import { Account, Wallet } from '@harmony-js/account'
import { Contract as BaseContract } from '@harmony-js/contract'
import { AbiItemModel } from '@harmony-js/contract/dist/models/types'
import { ContractOptions } from '@harmony-js/contract/dist/utils/options'
import { Harmony } from '@harmony-js/core'
import { Transaction } from '@harmony-js/transaction'
import { ChainType, hexToNumber, Unit } from '@harmony-js/utils'
import BN from 'bn.js'
import { ACTION_TYPE, BridgeSDK, EXCHANGE_MODE } from 'bridge-sdk'
import { withDecimals } from 'bridge-sdk/lib/blockchain/utils'
import { testnet, mainnet } from 'bridge-sdk/lib/configs'
import { abi as ERC721HmyManager } from './ERC721HmyManager'
import { abi as HmyDeposit } from './HmyDeposit'
import { AddressZero, DEFAULT_GAS_PRICE } from './constants'
import {
  BNish,
  BridgeApprovalParams,
  BridgeParams,
  ContractProviderType,
  ITransactionOptions,
  TokenInfo,
} from './interfaces'
import { Key } from './key'
import { MnemonicKey } from './mnemonic-key'
import { PrivateKey } from './private-key'
import { isBNish } from './utils'

class Contract extends BaseContract {
  public readonly wallet: Wallet

  constructor(abi: AbiItemModel[], address: string, provider: ContractProviderType, options?: ContractOptions) {
    super(abi, address, options, provider)

    this.wallet = provider
  }
}

export class ContractError extends Error {
  public readonly type: string

  constructor(message: string, type: string) {
    super(message)
    this.name = ContractError.name
    this.type = type

    Error.captureStackTrace(this, this.constructor)
  }
}

export abstract class BaseToken {
  private readonly _contract: Contract

  constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions) {
    this._contract = new Contract(abi, address, provider, options)
  }

  protected async estimateGas(
    method: string,
    args: any[] = [],
    options: ITransactionOptions = {
      gasPrice: DEFAULT_GAS_PRICE,
    },
  ): Promise<ITransactionOptions> {
    let gasLimit = options.gasLimit

    if (!gasLimit) {
      const hexValue = await this._contract.methods[method](...args).estimateGas({
        gasPrice: new Unit(options.gasPrice).asGwei().toHex(),
      })
      gasLimit = hexToNumber(hexValue)
    }
    return { gasPrice: new Unit(options.gasPrice).asGwei().toWeiString(), gasLimit }
  }

  public async call<T>(method: string, args: any[] = [], txOptions?: ITransactionOptions): Promise<T> {
    const options = await this.estimateGas(method, args, txOptions)
    const result: any = await this._contract.methods[method](...args).call(options)

    return result as T
  }

  public async send(method: string, args: any[] = [], txOptions?: ITransactionOptions): Promise<Transaction> {
    const options = await this.estimateGas(method, args, txOptions) // { gasPrice: 30000000000, gasLimit: 6721900 }// con estos datos funciona

    const response: BaseContract = await this._contract.methods[method](...args).send(options)

    if (!response.transaction) {
      throw new ContractError('Invalid transaction response', method)
    }

    return response.transaction
  }

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

  public async bridgeToken(options: BridgeParams, walletPK: string): Promise<void> {
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
      await this.ethToOne(options, bridgeSDK, walletPK, initParams)
    } else {
      await this.oneToEth(options, bridgeSDK, walletPK, initParams)
    }
  }

  private async ethToOne(
    options: BridgeParams,
    bridgeSDK: BridgeSDK,
    walletPK: string,
    initParams: typeof testnet | typeof mainnet,
  ) {
    throw new Error(`Error not implemented yet ${options}, ${bridgeSDK}, ${walletPK}, ${initParams}`)
  }

  private async oneToEth(
    options: BridgeParams,
    bridgeSDK: BridgeSDK,
    walletPK: string,
    initParams: typeof testnet | typeof mainnet,
  ) {
    try {
      const {
        hmyClient: { nodeURL, chainId },
      } = initParams || {}
      const hmy = new Harmony(nodeURL, {
        chainType: ChainType.Harmony,
        chainId: Number(chainId),
      })
      const hmyManagerContract = hmy.contracts.createContract(
        ERC721HmyManager,
        initParams.hmyClient.contracts.erc721Manager,
      )
      const depositContract = hmy.contracts.createContract(HmyDeposit, initParams.hmyClient.contracts.depositManager)
      await hmy.wallet.addByPrivateKey(walletPK)

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

      const depositAmount = operation?.operation?.actions[0]?.depositAmount
      if (depositAmount === undefined) {
        throw Error(`deposit amount cannot be undefined ${operation}`)
      }

      await this.bridgeDeposit(depositContract, depositAmount, async (transactionHash: string) => {
        console.log('Deposit hash: ', transactionHash)

        await operation.confirmAction({
          actionType: ACTION_TYPE.depositOne,
          transactionHash,
        })
      })

      await operation.waitActionComplete(ACTION_TYPE.depositOne)

      await this.bridgeApproval(
        { to: initParams.hmyClient.contracts.erc721Manager, tokenId: tokenInfo.tokenId, approved: true },
        async (transactionHash: string) => {
          console.log('Approve hash: ', transactionHash)

          await operation.confirmAction({
            actionType: ACTION_TYPE.approveHmyManger,
            transactionHash,
          })
        },
      )
      await operation.waitActionComplete(ACTION_TYPE.approveHmyManger)

      const recipient = hmy.crypto.getAddress(ethAddress).checksum
      await this.bridgeBurnToken(hmyManagerContract, tokenInfo, recipient, async (transactionHash) => {
        console.log('Burn hash: ', transactionHash)

        await operation.confirmAction({
          actionType: ACTION_TYPE.burnToken,
          transactionHash,
        })
      })

      await operation.waitActionComplete(ACTION_TYPE.burnToken)

      await operation.waitOperationComplete()
    } catch (e: any) {
      console.log('Error: ', e)
    }
  }

  protected abstract bridgeApproval(
    data: BridgeApprovalParams,
    sendTxCallback: (tx: string) => void,
    txOptions?: ITransactionOptions | undefined,
  ): Promise<Transaction>

  private async bridgeDeposit(depositContract: Contract, amount: number, sendTxCallback: (tx: string) => void) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('DEPOSIT')
        const response = await depositContract.methods
          .deposit(withDecimals(amount, 18))
          .send({ gasPrice: 30000000000, gasLimit: 6721900, value: withDecimals(amount, 18) })
          .on('transactionHash', sendTxCallback)
        resolve(response)
      } catch (e) {
        console.log('Error: ', e)
        reject(e)
      }
    })
  }

  private async bridgeBurnToken(
    managerContract: Contract,
    tokenInfo: TokenInfo,
    recipient: string,
    sendTxCallback?: (hash: string) => void,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('BURN', { managerContract })

        const response = await managerContract.methods
          .burnToken(tokenInfo.tokenAddress, tokenInfo.tokenId, recipient)
          .send({ gasPrice: 30000000000, gasLimit: 6721900 })
          .on('transactionHash', sendTxCallback)
        resolve(response)
      } catch (e) {
        console.log('Error: ', e)
        reject(e)
      }
    })
  }
}
