import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgeManagers, TokenInfo } from '../interfaces'
import { BridgedHRC20Token, HRC20EthManager, HRC20HmyManager, HRC20TokenManager } from '../bridge'
import { AddressZero, NetworkInfo, TokenType } from '../constants'
import { HRC20 } from '../contracts'
import * as Utils from "../utils"
import {
  TEST_ADDRESS_1,
  TEST_ADDRESS_2,
  TOKEN_GOLD,
  TX_OPTIONS,
  WALLET_PROVIDER_TEST_1,
  ContractName,
  FAKE_SUPPLY,
  TOKEN_GOLD_URI,
  WALLET_ETH_MASTER,
  HMY_OWNER_ADDRESS,
  ETH_OWNER_ADDRESS,
  WALLET_HMY_MASTER,
  FAKE_TX_RECEIPT,
  FAKE_TX,
  FAKE_ETH_TX_RECEIPT,
} from './constants'
import { getContractMetadata } from './helpers'
import { TxStatus } from '@harmony-js/transaction'

use(chaiAsPromised)

describe('HRC20 Contract Interface', () => {
  let contract: HRC20

  before(async () => {
    const { abi } = await getContractMetadata(ContractName.BlockcodersHRC20)
    contract = new HRC20('0x', abi, WALLET_PROVIDER_TEST_1)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('balanceOf', [TEST_ADDRESS_1], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(new BN(11)))

      const balance = await contract.balanceOf(TEST_ADDRESS_1, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if address is not provided', async () => {
      expect(contract.balanceOf('', TX_OPTIONS)).to.be.rejectedWith(Error)
    })
  })

  describe('transferFrom', () => {
    it('should transfer the ownership of a token from one address to another', async () => {
      const stub = sinon.stub(contract, 'send')
      stub.withArgs('transferFrom', [TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS).onFirstCall().resolves()

      await contract.transferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if there is no signer', () => {
      expect(contract.transferFrom('', TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no receiver', () => {
      expect(contract.transferFrom(TEST_ADDRESS_2, '', TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no tokenId', () => {
      expect(contract.transferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })
  })

  describe('approve', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('approve', [TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves()

      await contract.approve(TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if to is not provided', async () => {
      expect(contract.approve('', TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.approve(TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if txOptions are not provided', async () => {
      expect(contract.approve(TEST_ADDRESS_1, TOKEN_GOLD)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.approve('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('totalSupply', () => {
    it('should return the total supply of the contract', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('totalSupply', [], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(FAKE_SUPPLY))

      const totalSupply = await contract.totalSupply(TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(totalSupply).to.be.equals(await stub.returnValues[0])
    })
  })

  describe('decimals', () => {
    it('should return the decimals of the token', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('decimals', [], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(18))

      const decimals = await contract.decimals(TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(decimals).to.be.equals(await stub.returnValues[0])
    })
  })

  describe('symbol', () => {
    it('should return the symbol of the NFT', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('symbol', [], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve('BCFake'))

      const symbol = await contract.symbol(TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(symbol).to.be.equals(await stub.returnValues[0])
    })
  })

  describe('name', () => {
    it('should return the name on the NFT', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('name', [], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve('BlockCodersFake'))

      const name = await contract.name(TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(name).to.be.equals(await stub.returnValues[0])
    })
  })

  describe('mint', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('mint', [TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves()

      await contract.mint(TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if account is not provided', async () => {
      expect(contract.mint('', TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.mint(TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.mint('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('burn', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('burn', [10], TX_OPTIONS)
      stub.resolves()

      await contract.burn(10, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })
  })

  describe('burnFrom', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('burnFrom', [TEST_ADDRESS_1, 10], TX_OPTIONS)
      stub.resolves()

      await contract.burnFrom(TEST_ADDRESS_1, 10, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.burnFrom('', 0)).to.be.rejectedWith(Error)
    })
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

      const erc20Address = await contract.getBridgedTokenAddress(
        fakeEthManager,
        fakeTokenManager,
        TX_OPTIONS,
      )

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

      const erc20Address = await contract.getBridgedTokenAddress(
        fakeEthManager,
        fakeTokenManager,
        TX_OPTIONS,
      )
      expect(stub.callCount).to.be.equals(2)
      expect(addTokenStub.calledOnce).to.be.true
      expect(erc20Address).to.be.equals(expectedAddress)
    })
  })

  describe('hmyToEth', () => {
    it('should bridge 10 tokens from Harmony to Ethereum', async () => {
      const sender = HMY_OWNER_ADDRESS
      const recipient = ETH_OWNER_ADDRESS
      const tokenInfo: TokenInfo = {
        tokenAddress: '0xfake',
        type: TokenType.HRC20,
        info: {
          amount: 10,
        },
      }
      const network = NetworkInfo.DEVNET
      const tokenManager = new HRC20TokenManager('0x', WALLET_ETH_MASTER)
      const ethManager = new HRC20EthManager('0x', WALLET_ETH_MASTER)
      const hmyManager = new HRC20HmyManager('0x', WALLET_HMY_MASTER)
      const managers: BridgeManagers = {
        ethManager,
        tokenManager,
        ownerSignedEthManager: ethManager,
        hmyManager,
        ownerSignedHmyManager: hmyManager,
        ownerSignedToken: contract,
        token: contract,
        bridgedToken: new BridgedHRC20Token('0x', WALLET_ETH_MASTER),
      }
      const erc20Addr = '0xFake'

      const tx = FAKE_TX
      tx.setTxStatus(TxStatus.CONFIRMED)
      tx.receipt = FAKE_TX_RECEIPT

      const tokenManagerWriteStub = sinon.stub(tokenManager, 'write').withArgs('rely', [ethManager.address])
      tokenManagerWriteStub.resolves()

      const callStub = sinon.stub(contract, 'call').withArgs('balanceOf', [sender], TX_OPTIONS)
      callStub.resolves().returns(Promise.resolve(new BN(10)))

      const getBridgedTokenAddressStub = sinon.stub(contract, 'getBridgedTokenAddress')
      getBridgedTokenAddressStub.resolves().returns(Promise.resolve(erc20Addr))

      const ownerHRC20SendStub = sinon
        .stub(contract, 'send')
        .withArgs('approve', [hmyManager.address, 10], TX_OPTIONS)
      ownerHRC20SendStub.resolves().returns(Promise.resolve(tx))
      
      const ownerSignedHmyManagerSendStub = sinon
        .stub(hmyManager, 'send')
        .withArgs('lockTokenFor', [ethManager.address, sender, 10, recipient], TX_OPTIONS)
      ownerSignedHmyManagerSendStub.resolves().returns(Promise.resolve(tx))

      const ethManagerSendStub = sinon.stub(ethManager, "write").withArgs("mintToken", [erc20Addr, 10, recipient, tx.id])
      ethManagerSendStub.resolves().returns(Promise.resolve(FAKE_ETH_TX_RECEIPT))

      const utilsStub = sinon.stub(Utils, 'waitForNewBlock')
      utilsStub.resolves()
      
      await contract.hmyToEth(managers, sender, recipient, tokenInfo, network, TX_OPTIONS)

      expect(tokenManagerWriteStub.calledOnce).to.be.true
      expect(callStub.calledOnce).to.be.true
      expect(getBridgedTokenAddressStub.calledOnce).to.be.true
      expect(ownerHRC20SendStub.calledOnce).to.be.true
      expect(ownerSignedHmyManagerSendStub.calledOnce).to.be.true
      expect(ethManagerSendStub.calledOnce).to.be.true
      expect(utilsStub.calledOnce).to.be.true
    })
  })

  describe('ethToHmy', () => {
    it('should bridge 10 tokens from Ethereum to Harmony', async () => {
      const sender = ETH_OWNER_ADDRESS
      const recipient = HMY_OWNER_ADDRESS
      const tokenInfo: TokenInfo = {
        tokenAddress: '0xfake',
        type: TokenType.HRC20,
        info: {
          amount: 10,
        },
      }
      const tokenManager = new HRC20TokenManager('0x', WALLET_ETH_MASTER)
      const ethManager = new HRC20EthManager('0x', WALLET_ETH_MASTER)
      const hmyManager = new HRC20HmyManager('0x', WALLET_HMY_MASTER)
      const bridgedToken = new BridgedHRC20Token('0xFake', WALLET_ETH_MASTER)
      const managers: BridgeManagers = {
        ethManager,
        tokenManager,
        ownerSignedEthManager: ethManager,
        hmyManager,
        ownerSignedHmyManager: hmyManager,
        ownerSignedToken: contract,
        token: contract,
        bridgedToken,
      }
      const erc20Addr = '0xFake'

      const tx = FAKE_TX
      tx.setTxStatus(TxStatus.CONFIRMED)
      tx.receipt = FAKE_TX_RECEIPT

      const bridgedTokenReadStub = sinon.stub(bridgedToken, 'read').withArgs('balanceOf', [sender])
      bridgedTokenReadStub.resolves().returns(Promise.resolve(new BN(10)))

      const bridgedTokenWriteStub = sinon
        .stub(bridgedToken, 'write')
        .withArgs('approve', [ethManager.address, 10])
        bridgedTokenWriteStub.resolves()

      const ownerSignedEthManagerSendStub = sinon
        .stub(ethManager, 'write')
        .withArgs('burnToken', [erc20Addr, 10, recipient])
        ownerSignedEthManagerSendStub.resolves().returns(Promise.resolve(FAKE_ETH_TX_RECEIPT))

      const hmyManagerSendStub = sinon
        .stub(hmyManager, 'send')
        .withArgs('unlockToken', [contract.address, 10, recipient, FAKE_ETH_TX_RECEIPT.transactionHash], TX_OPTIONS)
      hmyManagerSendStub.resolves().returns(Promise.resolve(tx))

      await contract.ethToHmy(managers, sender, recipient, tokenInfo, TX_OPTIONS)
      expect(bridgedTokenReadStub.calledOnce).to.be.true
      expect(bridgedTokenWriteStub.calledOnce).to.be.true
      expect(ownerSignedEthManagerSendStub.calledOnce).to.be.true
      expect(hmyManagerSendStub.calledOnce).to.be.true
    })
  })
})