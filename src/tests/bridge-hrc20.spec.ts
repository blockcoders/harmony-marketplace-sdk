import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgeHRC20Token } from '../bridge/bridgeHrc20Token'
import { HRC20EthManager, HRC20TokenManager } from '../bridge'
import { AddressZero } from '../constants'
import { HRC20 } from '../contracts'
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

describe('HRC20 Contract Interface', () => {
  let contract: HRC20
  let bridge: BridgeHRC20Token
  before(async () => {
    const { abi } = await getContractMetadata(ContractName.BlockcodersHRC20)
    contract = new HRC20('0x', abi, WALLET_PROVIDER_TEST_1)
    bridge = new BridgeHRC20Token(WALLET_HMY_OWNER, WALLET_ETH_OWNER, WALLET_ETH_MASTER.provider, false)
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
      callStub.withArgs('decimals', [], TX_OPTIONS).returns(Promise.resolve(18))

      const fakeEthManager = new HRC20EthManager('0x', WALLET_ETH_MASTER)
      const stub = sinon.stub(fakeEthManager, 'mappings').withArgs(contract.address)
      stub.resolves().returns(Promise.resolve(expectedAddress))

      const fakeTokenManager = new HRC20TokenManager('0x', WALLET_ETH_MASTER)

      const erc20Address = await bridge.getBridgedTokenAddress(contract, fakeEthManager, fakeTokenManager, TX_OPTIONS)

      expect(erc20Address).to.be.equals(expectedAddress)
    })

    it('should return the bridged token address after adding the new token', async () => {
      const expectedAddress = '0xfake'
      const callStub = sinon.stub(contract, 'call')
      callStub.withArgs('name', [], TX_OPTIONS).returns(Promise.resolve('BlockCodersFake'))
      callStub.withArgs('symbol', [], TX_OPTIONS).returns(Promise.resolve('BCFake'))
      callStub.withArgs('tokenURI', [TOKEN_GOLD], TX_OPTIONS).returns(Promise.resolve(TOKEN_GOLD_URI))

      const fakeEthManager = new HRC20EthManager('0x', WALLET_ETH_MASTER)
      const stub = sinon.stub(fakeEthManager, 'mappings').withArgs(contract.address)
      stub.onCall(0).returns(Promise.resolve(AddressZero))
      stub.onCall(1).returns(Promise.resolve(expectedAddress))

      const addTokenStub = sinon.stub(fakeEthManager, 'addToken')
      addTokenStub.resolves()
      const fakeTokenManager = new HRC20TokenManager('0x', WALLET_ETH_MASTER)

      const erc20Address = await bridge.getBridgedTokenAddress(contract, fakeEthManager, fakeTokenManager, TX_OPTIONS)
      expect(stub.callCount).to.be.equals(2)
      expect(addTokenStub.calledOnce).to.be.true
      expect(erc20Address).to.be.equals(expectedAddress)
    })
  })
})
