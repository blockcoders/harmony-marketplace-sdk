import { expect } from 'chai'
import { abi as ABI } from '../bridge-managers/abis/tokens/erc721'
import { BRIDGE, BridgeParams, BRIDGE_TOKENS } from '../interfaces'
import { ERC721 } from '../tokens/erc721'
import { ERC721_CONTRACT_ADDRESS, TEST_ADDRESS_1, TX_OPTIONS, WALLET_ETH_PROVIDER_TEST_1, WALLET_PROVIDER_TEST_1 } from './constants'

describe('ERC721 Contract Interface', () => {


  let contract: ERC721

  before(() => {
    contract = new ERC721(ERC721_CONTRACT_ADDRESS, ABI, WALLET_ETH_PROVIDER_TEST_1)
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('bridgeToken E2E', () => {
    it.only('Sends an ERC721 token from eth to hmy and then back to eth', async () => {
      const paramsEthToHmy: BridgeParams = {
        ethAddress: TEST_ADDRESS_1,
        oneAddress: 'one1rnh8ruyzr7ma8n96e23zrtr7x49u0epe283wff',
        type: BRIDGE.ETH_TO_HMY,
        token: BRIDGE_TOKENS.ERC721,
        amount: 20,
        isMainnet: false,
        tokenId: 5,
      }
      /*const paramsHmyToEth: BridgeParams = {
        ethAddress: TEST_ADDRESS_1,
        oneAddress: 'one1rnh8ruyzr7ma8n96e23zrtr7x49u0epe283wff',
        type: BRIDGE.HMY_TO_ETH,
        token: BRIDGE_TOKENS.ERC721,
        amount: 20,
        isMainnet: false,
        tokenId: 12,
      }*/
      await contract.bridgeToken(paramsEthToHmy, WALLET_PROVIDER_TEST_1,TX_OPTIONS)
      //await contract.bridgeToken(paramsHmyToEth, txOptions)
    })
  })
})
