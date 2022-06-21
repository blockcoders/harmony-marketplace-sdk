import { TokenInfo } from '../interfaces'
import { BridgeToken } from '../bridge/bridgeToken'
import {
  WALLET_ETH_MASTER,
  WALLET_HMY_MASTER,
  WALLET_HMY_OWNER,
  WALLET_ETH_OWNER,
  HMY_OWNER_ADDRESS,
  ETH_OWNER_ADDRESS,
} from './constants'
import { BridgeType, DEFAULT_TX_OPTIONS, NetworkInfo, TokenType } from '../constants'
const hrc20Address = "0x8202502dc1d2d0bf741ccafcf08bd973c0547bea"
const hrc721Address = "0x3bd7ff8176daef64e81711027b50ed2f3d07c2f5"
const hrc1155Address = "0x245cd441f37d98122e5f9c8214228409ecb51869"

describe('BRIDGE SOME HRC20 TOKENS', () => {
  it('Should send the tokens from Hmy to Eth', async () => {
    const bridge = new BridgeToken(WALLET_ETH_OWNER, WALLET_ETH_MASTER, WALLET_HMY_OWNER, WALLET_HMY_MASTER)
    const sender = HMY_OWNER_ADDRESS
    const recipient = ETH_OWNER_ADDRESS
    const tokenInfo: TokenInfo = {
      tokenAddress: hrc20Address,
      type: TokenType.HRC20,
      info: {
        amount: 10,
      },
    }
    const bridgeType = BridgeType.HMY_TO_ETH
    const network = NetworkInfo.DEVNET
    await bridge.execute(sender, recipient, tokenInfo, bridgeType, network, DEFAULT_TX_OPTIONS)
  })
  it('Should send the tokens from Eth to Hmy', async () => {
    const bridge = new BridgeToken(WALLET_ETH_OWNER, WALLET_ETH_MASTER, WALLET_HMY_OWNER, WALLET_HMY_MASTER)
    const sender = ETH_OWNER_ADDRESS
    const recipient = HMY_OWNER_ADDRESS
    const tokenInfo: TokenInfo = {
      tokenAddress: hrc20Address,
      type: TokenType.HRC20,
      info: {
        amount: 10,
      },
    }
    const bridgeType = BridgeType.ETH_TO_HMY
    const network = NetworkInfo.DEVNET
    await bridge.execute(sender, recipient, tokenInfo, bridgeType, network, DEFAULT_TX_OPTIONS)
  })
})

describe('BRIDGE ONE HRC721 TOKEN', () => {
  it('Should send the tokens from Hmy to Eth', async () => {
    const bridge = new BridgeToken(WALLET_ETH_OWNER, WALLET_ETH_MASTER, WALLET_HMY_OWNER, WALLET_HMY_MASTER)
    const sender = HMY_OWNER_ADDRESS
    const recipient = ETH_OWNER_ADDRESS
    const tokenInfo: TokenInfo = {
      tokenAddress: hrc721Address,
      type: TokenType.HRC721,
      info: {
        tokenId: 1,
      },
    }
    const bridgeType = BridgeType.HMY_TO_ETH
    const network = NetworkInfo.DEVNET
    await bridge.execute(sender, recipient, tokenInfo, bridgeType, network, DEFAULT_TX_OPTIONS)
  })
  it('Should send the tokens from Eth to Hmy', async () => {
    const bridge = new BridgeToken(WALLET_ETH_OWNER, WALLET_ETH_MASTER, WALLET_HMY_OWNER, WALLET_HMY_MASTER)
    const sender = ETH_OWNER_ADDRESS
    const recipient = HMY_OWNER_ADDRESS
    const tokenInfo: TokenInfo = {
      tokenAddress: hrc721Address,
      type: TokenType.HRC721,
      info: {
        tokenId: 1,
      },
    }
    const bridgeType = BridgeType.ETH_TO_HMY
    const network = NetworkInfo.DEVNET
    await bridge.execute(sender, recipient, tokenInfo, bridgeType, network, DEFAULT_TX_OPTIONS)
  })
})


describe('BRIDGE HRC1155 TOKEN', () => {
  it('Should send the tokens from Hmy to Eth', async () => {
    const bridge = new BridgeToken(WALLET_ETH_OWNER, WALLET_ETH_MASTER, WALLET_HMY_OWNER, WALLET_HMY_MASTER)
    const sender = HMY_OWNER_ADDRESS
    const recipient = ETH_OWNER_ADDRESS
    const tokenInfo: TokenInfo = {
      tokenAddress: hrc1155Address,
      type: TokenType.HRC1155,
      info: {
        tokenIds: [1],
        amounts: [1]
      },
    }
    const bridgeType = BridgeType.HMY_TO_ETH
    const network = NetworkInfo.DEVNET
    await bridge.execute(sender, recipient, tokenInfo, bridgeType, network, DEFAULT_TX_OPTIONS)
  })
  it('Should send the tokens from Eth to Hmy', async () => {
    const bridge = new BridgeToken(WALLET_ETH_OWNER, WALLET_ETH_MASTER, WALLET_HMY_OWNER, WALLET_HMY_MASTER)
    const sender = ETH_OWNER_ADDRESS
    const recipient = HMY_OWNER_ADDRESS
    const tokenInfo: TokenInfo = {
      tokenAddress: hrc1155Address,
      type: TokenType.HRC1155,
      info: {
        tokenIds: [1],
        amounts: [1]
      },
    }
    const bridgeType = BridgeType.ETH_TO_HMY
    const network = NetworkInfo.DEVNET
    await bridge.execute(sender, recipient, tokenInfo, bridgeType, network, DEFAULT_TX_OPTIONS)
  })
})
