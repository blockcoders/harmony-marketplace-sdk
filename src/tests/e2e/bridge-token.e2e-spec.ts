import { HRC1155, HRC20, HRC721 } from '../../contracts'
import { BridgeHRC20Token } from '../../bridge/bridgeHrc20Token'
import { BridgeType, DEFAULT_TX_OPTIONS, NetworkInfo } from '../../constants'
import { HRC1155Info, HRC20Info, HRC721Info } from '../../interfaces'
import {
  WALLET_ETH_MASTER,
  WALLET_HMY_MASTER,
  WALLET_HMY_OWNER,
  WALLET_ETH_OWNER,
  HMY_OWNER_ADDRESS,
  ETH_OWNER_ADDRESS,
} from '../constants'
import HRC1155ABI from '../../bridge/hrc1155/abi'
import HRC20ABI from '../../bridge/hrc20/abi'
import HRC721ABI from '../../bridge/hrc721/abi'
import { BridgeHRC721Token } from '../../bridge/bridgeHrc721Token'
import { BridgeHRC1155Token } from '../../bridge/bridgeHrc1155Token'

const hrc20Address = '0x8202502dc1d2d0bf741ccafcf08bd973c0547bea'
const hrc721Address = '0x3bd7ff8176daef64e81711027b50ed2f3d07c2f5'
const hrc1155Address = '0x245cd441f37d98122e5f9c8214228409ecb51869'

let bridge: BridgeHRC20Token | BridgeHRC721Token | BridgeHRC1155Token
let token: HRC20 | HRC721 | HRC1155

describe.only('BRIDGE SOME HRC20 TOKENS', () => {
  before(() => {
    bridge = new BridgeHRC20Token(WALLET_HMY_OWNER, WALLET_ETH_OWNER, WALLET_ETH_MASTER.provider, NetworkInfo.DEVNET)
    token = new HRC20(hrc20Address, HRC20ABI, WALLET_HMY_MASTER)
  })
  it('Should send the tokens from Hmy to Eth', async () => {
    const sender = HMY_OWNER_ADDRESS
    const recipient = ETH_OWNER_ADDRESS
    const tokenInfo: HRC20Info = {
      amount: 10,
    }
    await bridge.sendToken(BridgeType.HMY_TO_ETH, sender, recipient, token, tokenInfo, DEFAULT_TX_OPTIONS)
  })
  it('Should send the tokens from Eth to Hmy', async () => {
    const sender = ETH_OWNER_ADDRESS
    const recipient = HMY_OWNER_ADDRESS
    const tokenInfo: HRC20Info = {
      amount: 10,
    }
    await bridge.sendToken(BridgeType.ETH_TO_HMY, sender, recipient, token, tokenInfo, DEFAULT_TX_OPTIONS)
  })
})

describe('BRIDGE ONE HRC721 TOKEN', () => {
  before(() => {
    bridge = new BridgeHRC721Token(WALLET_HMY_OWNER, WALLET_ETH_OWNER, WALLET_ETH_MASTER.provider, NetworkInfo.DEVNET)
    token = new HRC721(hrc721Address, HRC721ABI, WALLET_HMY_MASTER)
  })
  it('Should send the tokens from Hmy to Eth', async () => {
    const sender = HMY_OWNER_ADDRESS
    const recipient = ETH_OWNER_ADDRESS
    const tokenInfo: HRC721Info = {
      tokenId: 1,
    }
    await bridge.sendToken(BridgeType.HMY_TO_ETH, sender, recipient, token, tokenInfo, DEFAULT_TX_OPTIONS)
  })
  it('Should send the tokens from Eth to Hmy', async () => {
    const sender = ETH_OWNER_ADDRESS
    const recipient = HMY_OWNER_ADDRESS
    const tokenInfo: HRC721Info = {
      tokenId: 1,
    }
    await bridge.sendToken(BridgeType.ETH_TO_HMY, sender, recipient, token, tokenInfo, DEFAULT_TX_OPTIONS)
  })
})

describe('BRIDGE HRC1155 TOKEN', () => {
  before(() => {
    bridge = new BridgeHRC1155Token(WALLET_HMY_OWNER, WALLET_ETH_OWNER, WALLET_ETH_MASTER.provider, NetworkInfo.DEVNET)
    token = new HRC1155(hrc1155Address, HRC1155ABI, WALLET_HMY_MASTER)
  })
  it('Should send the tokens from Hmy to Eth', async () => {
    const sender = HMY_OWNER_ADDRESS
    const recipient = ETH_OWNER_ADDRESS
    const tokenInfo: HRC1155Info = {
      tokenIds: [1],
      amounts: [1],
    }
    await bridge.sendToken(BridgeType.HMY_TO_ETH, sender, recipient, token, tokenInfo, DEFAULT_TX_OPTIONS)
  })
  it('Should send the tokens from Eth to Hmy', async () => {
    const sender = ETH_OWNER_ADDRESS
    const recipient = HMY_OWNER_ADDRESS
    const tokenInfo: HRC1155Info = {
      tokenIds: [1],
      amounts: [1],
    }
    await bridge.sendToken(BridgeType.ETH_TO_HMY, sender, recipient, token, tokenInfo, DEFAULT_TX_OPTIONS)
  })
})
