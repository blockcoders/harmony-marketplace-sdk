import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { abi as ABI } from '../bridge-managers/abis/tokens/erc721'
import { BRIDGE, BridgeParams, BRIDGE_TOKENS, ITransactionOptions } from '../interfaces'
import { ERC721 } from '../tokens/erc721'
import { ERC721_CONTRACT_ADDRESS, TEST_ADDRESS_1, WALLET_PROVIDER_TEST_1 } from './constants'

describe('HRC721 Contract Interface', () => {
  use(chaiAsPromised)

  let contract: ERC721

  before(() => {
    contract = new ERC721(ERC721_CONTRACT_ADDRESS, ABI, WALLET_PROVIDER_TEST_1)
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('bridgeToken E2E', () => {
    it('Sends an ERC721 token from eth to hmy and then back to eth', async () => {
      const paramsEthToHmy: BridgeParams = {
        ethAddress: TEST_ADDRESS_1,
        oneAddress: 'one1rnh8ruyzr7ma8n96e23zrtr7x49u0epe283wff',
        type: BRIDGE.ETH_TO_HMY,
        token: BRIDGE_TOKENS.ERC721,
        amount: 20,
        isMainnet: false,
        tokenId: 12,
      }
      const paramsHmyToEth: BridgeParams = {
        ethAddress: TEST_ADDRESS_1,
        oneAddress: 'one1rnh8ruyzr7ma8n96e23zrtr7x49u0epe283wff',
        type: BRIDGE.HMY_TO_ETH,
        token: BRIDGE_TOKENS.ERC721,
        amount: 20,
        isMainnet: false,
        tokenId: 12,
      }
      const txOptions: ITransactionOptions = {
        gasPrice: 30000000000,
        gasLimit: 6721900,
      }
      await contract.bridgeToken(paramsEthToHmy, txOptions)
      await contract.bridgeToken(paramsHmyToEth, txOptions)
    })
  })
})
