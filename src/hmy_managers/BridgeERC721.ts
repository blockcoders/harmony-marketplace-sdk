import { Harmony } from '@harmony-js/core'
import { ChainType } from '@harmony-js/utils'
import { ACTION_TYPE, BridgeSDK, EXCHANGE_MODE } from 'bridge-sdk'
import { testnet, mainnet } from 'bridge-sdk/lib/configs'
import { withDecimals } from 'bridge-sdk/src/blockchain/utils'
import { TokenInfo } from 'src/interfaces'
import { abi as ERC721HmyManager } from './ERC721HmyManager'

export default class BridgeERC721 {
  hmyManagerContract: any
  hmy: any
  hmyTokenContract: any
  constructor(params: any) {
    this.hmy = new Harmony(params.nodeURL, {
      chainType: ChainType.Harmony,
      chainId: Number(params.chainId),
    })
    this.hmyManagerContract = this.hmy.contracts.createContract(ERC721HmyManager)
  }
  async sendToken(options: any, walletPK: string) {
    const bridgeSDK = new BridgeSDK({ logLevel: 2 }) // 2 - full logs, 1 - only success & errors, 0 - logs off

    options.isMainnet ? await bridgeSDK.init(mainnet) : await bridgeSDK.init(testnet)

    if (options.type === EXCHANGE_MODE.ETH_TO_ONE) {
      await bridgeSDK.addEthWallet(walletPK)
    } else {
      await this.hmy.wallet.addByPrivateKey(walletPK)
      await this.oneToEth(options, bridgeSDK)
    }
  }

  async oneToEth(options: any, bridgeSDK: BridgeSDK) {
    try {
      const { type, token, amount, oneAddress, ethAddress, tokenInfo } = options || {}
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
      await this.deposit(depositAmount, async (transactionHash) => {
        console.log('Deposit hash: ', transactionHash)

        await operation.confirmAction({
          actionType: ACTION_TYPE.depositOne,
          transactionHash,
        })
      })

      await operation.waitActionComplete(ACTION_TYPE.depositOne)
      //const hrc721Address = options.tokenInfo.tokenAddress
      //const hmyTokenContract = this.hmy.contracts.createContract(MyERC721Abi, hrc721Address);
      await this.approveHmyManger(amount, async (transactionHash) => {
        console.log('Approve hash: ', transactionHash)

        await operation.confirmAction({
          actionType: ACTION_TYPE.approveHmyManger,
          transactionHash,
        })
      })

      await operation.waitActionComplete(ACTION_TYPE.approveHmyManger)

      await this.burnTokens(tokenInfo, ethAddress, amount, async (transactionHash) => {
        console.log('burnToken hash: ', transactionHash)

        await operation.confirmAction({
          actionType: ACTION_TYPE.burnToken,
          transactionHash,
        })
      })

      await operation.waitActionComplete(ACTION_TYPE.burnToken)

      await operation.waitOperationComplete()
    } catch (e: any) {
      console.error('Error: ', e.message || e, e.response?.body || '')
    }
  }

  async deposit(amount: number, sendTxCallback: (tx: string) => void) {
    return new Promise(async (resolve, reject) => {
      try {
        const oneWallet = '' //window.onewallet
        await this.connectToWallet(oneWallet, reject)

        const response = await this.hmyManagerContract.methods
          .deposit(withDecimals(amount, 18))
          .send({ gasPrice: 30000000000, gasLimit: 6721900, value: withDecimals(amount, 18) })
          .on('transactionHash', sendTxCallback)

        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  }

  async approveHmyManger(amount: number, sendTxCallback: (tx: string) => void) {
    return new Promise(async (resolve, reject) => {
      try {
        const oneWallet = '' //window.onewallet
        await this.connectToWallet(oneWallet, reject)

        const response: any = await this.hmyTokenContract.methods
          .approve(this.hmyManagerContract.address, withDecimals(amount, 18))
          .send({ gasPrice: 30000000000, gasLimit: 6721900 })
          .on('transactionHash', sendTxCallback)
        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  }

  async burnTokens(
    tokenInfo: TokenInfo,
    userAddr: string,
    amount: number | number[],
    sendTxCallback?: (hash: string) => void,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const oneWallet = '' //window.onewallet
        await this.connectToWallet(oneWallet, reject)
        const userAddrHex = this.hmy.crypto.getAddress(userAddr).checksum

        const response = await this.hmyManagerContract.methods
          .burnTokens(tokenInfo.tokenAddress, tokenInfo.tokenId, amount, userAddrHex)
          .send({ gasPrice: 30000000000, gasLimit: 6721900 })
          .on('transactionHash', sendTxCallback)

        resolve(response)
      } catch (e) {
        reject(e)
      }
    })
  }

  async connectToWallet(walletExtension: any, reject: any) {
    const { address } = await walletExtension.getAccount()
    const userAddress = this.hmy.crypto.getAddress(address).checksum
    this.hmyManagerContract.wallet.defaultSigner = userAddress
    this.hmyManagerContract.wallet.signTransaction = async (tx: any) => {
      try {
        tx.from = userAddress
        return walletExtension.signTransaction(tx)
      } catch (e) {
        reject(e)
      }

      return null
    }
  }
}
