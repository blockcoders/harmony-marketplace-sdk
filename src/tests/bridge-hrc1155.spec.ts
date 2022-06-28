import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgeHRC1155Token } from '../bridge/bridgeHrc1155Token'
import { HRC1155EthManager, HRC1155TokenManager } from '../bridge'
import { AddressZero } from '../constants'
import { HRC1155 } from '../contracts'
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

describe('HRC1155 Contract Interface', () => {
  let contract: HRC1155
  let bridge: BridgeHRC1155Token
  before(async () => {
    const { abi } = await getContractMetadata(ContractName.BlockcodersHRC1155)
    contract = new HRC1155('0x', abi, WALLET_PROVIDER_TEST_1)
    bridge = new BridgeHRC1155Token(WALLET_HMY_OWNER, WALLET_ETH_OWNER, WALLET_ETH_MASTER.provider, false)
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
      callStub.withArgs('uri', [TOKEN_GOLD], TX_OPTIONS).returns(Promise.resolve(TOKEN_GOLD_URI))

      const fakeEthManager = new HRC1155EthManager('0x', WALLET_ETH_MASTER)
      const stub = sinon.stub(fakeEthManager, 'mappings').withArgs(contract.address)
      stub.resolves().returns(Promise.resolve(expectedAddress))

      const fakeTokenManager = new HRC1155TokenManager('0x', WALLET_ETH_MASTER)

      const erc1155Address = await bridge.getBridgedTokenAddress(
        contract,
        TOKEN_GOLD,
        fakeEthManager,
        fakeTokenManager,
        TX_OPTIONS,
      )

      expect(erc1155Address).to.be.equals(expectedAddress)
    })

    it('should return the bridged token address after adding the new token', async () => {
      const expectedAddress = '0xfake'
      const callStub = sinon.stub(contract, 'call')
      callStub.withArgs('name', [], TX_OPTIONS).returns(Promise.resolve('BlockCodersFake'))
      callStub.withArgs('symbol', [], TX_OPTIONS).returns(Promise.resolve('BCFake'))
      callStub.withArgs('uri', [TOKEN_GOLD], TX_OPTIONS).returns(Promise.resolve(TOKEN_GOLD_URI))

      const fakeEthManager = new HRC1155EthManager('0x', WALLET_ETH_MASTER)
      const stub = sinon.stub(fakeEthManager, 'mappings').withArgs(contract.address)
      stub.onCall(0).returns(Promise.resolve(AddressZero))
      stub.onCall(1).returns(Promise.resolve(expectedAddress))

      const addTokenStub = sinon.stub(fakeEthManager, 'addToken')
      addTokenStub.resolves()
      const fakeTokenManager = new HRC1155TokenManager('0x', WALLET_ETH_MASTER)

      const erc1155Address = await bridge.getBridgedTokenAddress(
        contract,
        TOKEN_GOLD,
        fakeEthManager,
        fakeTokenManager,
        TX_OPTIONS,
      )
      expect(stub.callCount).to.be.equals(2)
      expect(addTokenStub.calledOnce).to.be.true
      expect(erc1155Address).to.be.equals(expectedAddress)
    })
  })
})
