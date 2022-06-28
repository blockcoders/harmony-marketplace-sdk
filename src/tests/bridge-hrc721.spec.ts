import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgeHRC721Token } from '../bridge/bridgeHrc721Token'
import { HRC721EthManager, HRC721TokenManager } from '../bridge'
import { NetworkInfo } from '../constants'
import { HRC721 } from '../contracts'
import {
  TOKEN_GOLD,
  TX_OPTIONS,
  WALLET_PROVIDER_TEST_1,
  ContractName,
  TOKEN_GOLD_URI,
  WALLET_ETH_MASTER,
  WALLET_HMY_OWNER,
  WALLET_ETH_OWNER,
} from './constants'
import { getContractMetadata } from './helpers'

use(chaiAsPromised)

describe('HRC721 Contract Interface', () => {
  let contract: HRC721
  let bridge: BridgeHRC721Token
  before(async () => {
    const { abi } = await getContractMetadata(ContractName.BlockcodersHRC721)
    contract = new HRC721('0x', abi, WALLET_PROVIDER_TEST_1)
    bridge = new BridgeHRC721Token(WALLET_HMY_OWNER, WALLET_ETH_OWNER, WALLET_ETH_MASTER.provider, NetworkInfo.DEVNET)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  
  describe('getBridgedTokenAddress', () => {
    it('should return the bridged token address', async () => {
      const expectedAddress = '0xfake'
      const callStub = sinon.stub(contract, 'call')
      callStub.withArgs('name', [], TX_OPTIONS).returns(Promise.resolve('BlockCodersFake'))
      callStub.withArgs('symbol', [], TX_OPTIONS).returns(Promise.resolve('BCFake'))
      callStub.withArgs('tokenURI', [TOKEN_GOLD], TX_OPTIONS).returns(Promise.resolve(TOKEN_GOLD_URI))

      const fakeEthManager = new HRC721EthManager('0x', WALLET_ETH_MASTER)
      const stub = sinon.stub(fakeEthManager, 'mappings').withArgs(contract.address)
      stub.resolves().returns(Promise.resolve(expectedAddress))

      const fakeTokenManager = new HRC721TokenManager('0x', WALLET_ETH_MASTER)

      const erc721Address = await bridge.getBridgedTokenAddress(
        contract,
        TOKEN_GOLD,
        fakeEthManager,
        fakeTokenManager,
        TX_OPTIONS,
      )

      expect(erc721Address).to.be.equals(expectedAddress)
    })

    it('should return the bridged token address after adding the new token', async () => {
      const expectedAddress = '0xfake'
      const callStub = sinon.stub(contract, 'call')
      callStub.withArgs('name', [], TX_OPTIONS).returns(Promise.resolve('BlockCodersFake'))
      callStub.withArgs('symbol', [], TX_OPTIONS).returns(Promise.resolve('BCFake'))
      callStub.withArgs('tokenURI', [TOKEN_GOLD], TX_OPTIONS).returns(Promise.resolve(TOKEN_GOLD_URI))

      const fakeEthManager = new HRC721EthManager('0x', WALLET_ETH_MASTER)
      const stub = sinon.stub(fakeEthManager, 'mappings').withArgs(contract.address)
      stub.onCall(0).returns(Promise.reject())
      stub.onCall(1).returns(Promise.resolve(expectedAddress))

      const addTokenStub = sinon.stub(fakeEthManager, 'addToken')
      addTokenStub.resolves()
      const fakeTokenManager = new HRC721TokenManager('0x', WALLET_ETH_MASTER)

      const erc721Address = await bridge.getBridgedTokenAddress(
        contract,
        TOKEN_GOLD,
        fakeEthManager,
        fakeTokenManager,
        TX_OPTIONS,
      )
      expect(stub.callCount).to.be.equals(2)
      expect(addTokenStub.calledOnce).to.be.true
      expect(erc721Address).to.be.equals(expectedAddress)
    })
  })
})
