import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC20 } from '../contracts'
import {
  TEST_ADDRESS_1,
  TEST_ADDRESS_2,
  TOKEN_GOLD,
  TX_OPTIONS,
  WALLET_PROVIDER_TEST_1,
  ContractName,
  FAKE_SUPPLY,
} from './constants'
import { getContractMetadata } from './helpers'

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
})
