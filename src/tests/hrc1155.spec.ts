import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC1155EthManager, HRC1155TokenManager } from '../bridge'
import { AddressZero } from '../constants'
import { HRC1155 } from '../contracts'
import {
  TEST_ADDRESS_1,
  EMPTY_TEST_ADDRESS,
  TEST_ADDRESS_2,
  TOKEN_GOLD,
  TOKEN_SILVER,
  TX_OPTIONS,
  FAKE_BALANCE_HRC1155,
  WALLET_PROVIDER_TEST_1,
  ContractName,
  TOKEN_GOLD_URI,
  FAKE_SUPPLY,
  WALLET_ETH_MASTER,
} from './constants'
import { getContractMetadata } from './helpers'

use(chaiAsPromised)

describe('HRC1155 Contract Interface', () => {
  let contract: HRC1155

  before(async () => {
    const { abi } = await getContractMetadata(ContractName.BlockcodersHRC1155)
    contract = new HRC1155('0x', abi, WALLET_PROVIDER_TEST_1)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account with id as a number', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('balanceOf', [TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOf(TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should get the number of tokens in the specified account with id as a string', async () => {
      const stub = sinon
        .stub(contract, 'call')
        .withArgs('balanceOf', [TEST_ADDRESS_1, TOKEN_GOLD.toString()], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOf(TEST_ADDRESS_1, TOKEN_GOLD.toString(), TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if address is not provided', async () => {
      expect(contract.balanceOf('', TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if id is not provided', async () => {
      expect(contract.balanceOf(TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.balanceOf('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('balanceOfBatch', () => {
    it('should return multiple balances in the specified account with id as a number', async () => {
      const stub = sinon.stub(contract, 'call').withArgs(
        'balanceOfBatch',
        [
          [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
          [TOKEN_GOLD, TOKEN_SILVER],
        ],
        TX_OPTIONS,
      )
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOfBatch(
        [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
        [TOKEN_GOLD, TOKEN_SILVER],
        TX_OPTIONS,
      )

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should return multiple balances in the specified account with id as a string', async () => {
      const stub = sinon.stub(contract, 'call').withArgs(
        'balanceOfBatch',
        [
          [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
          [TOKEN_GOLD.toString(), TOKEN_SILVER.toString()],
        ],
        TX_OPTIONS,
      )
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOfBatch(
        [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
        [TOKEN_GOLD.toString(), TOKEN_SILVER.toString()],
        TX_OPTIONS,
      )

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should return multiple balances in the specified account with id as a byte', async () => {
      const stub = sinon.stub(contract, 'call').withArgs(
        'balanceOfBatch',
        [
          [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
          ['00000001', '00000010'],
        ],
        TX_OPTIONS,
      )
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOfBatch(
        [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
        ['00000001', '00000010'],
        TX_OPTIONS,
      )

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if ids is not provided', async () => {
      const stub = sinon.stub(contract, 'call')
      stub
        .withArgs('balanceOfBatch', [[], [1, 2]])
        .onFirstCall()
        .rejects()

      expect(contract.balanceOfBatch([], [1, 2])).to.be.rejectedWith(Error)
    })

    it('should throw an error if accounts is not provided', async () => {
      expect(contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], [])).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.balanceOfBatch([], [])).to.be.rejectedWith(Error)
    })
  })

  describe('safeTransferFrom', async () => {
    it('should transfer amount tokens of the specified id from one address to another', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs('safeTransferFrom', [TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, 10, '0x'], TX_OPTIONS)
      stub.resolves()

      await contract.safeTransferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, 10, '0x', TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should thow an error if sender address is not provided', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs('safeTransferFrom', ['', TEST_ADDRESS_1, TOKEN_GOLD, 10, '0x'], TX_OPTIONS)
      stub.rejects()

      expect(contract.safeTransferFrom('', TEST_ADDRESS_1, 1, 10, '0x', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should thow an error if receiver address is not provided', async () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_2, '', TOKEN_GOLD, 10, '0x', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should thow an error if to address is zero-address', async () => {
      expect(
        contract.safeTransferFrom(TEST_ADDRESS_2, AddressZero, TOKEN_GOLD, 10, '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if token id is not provided', async () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, '', 10, '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if amount is not provided', async () => {
      expect(
        contract.safeTransferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, 0, '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if data is not provided', async () => {
      expect(
        contract.safeTransferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, 10, '', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.safeTransferFrom('', '', 0, 0, '')).to.be.rejectedWith(Error)
    })
  })

  describe('safeBatchTransferFrom', async () => {
    it('should transfer amount tokens of the specified id from one address to another', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs(
          'safeBatchTransferFrom',
          [TEST_ADDRESS_1, TEST_ADDRESS_2, [TOKEN_GOLD, TOKEN_SILVER], [10, 20], '0x'],
          TX_OPTIONS,
        )
      stub.resolves()

      await contract.safeBatchTransferFrom(
        TEST_ADDRESS_1,
        TEST_ADDRESS_2,
        [TOKEN_GOLD, TOKEN_SILVER],
        [10, 20],
        '0x',
        TX_OPTIONS,
      )

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should thow an error if sender address is not provided', async () => {
      expect(
        contract.safeBatchTransferFrom('', TEST_ADDRESS_1, [TOKEN_GOLD], [10], '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if receiver address is not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, '', [TOKEN_GOLD], [10], '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if token ids are not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [], [10], '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if amounts are not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [TOKEN_GOLD], [], '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if data is not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [TOKEN_GOLD], [10], '', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.safeBatchTransferFrom('', '', [], [], '')).to.be.rejectedWith(Error)
    })
  })

  describe('setApprovalForAll', () => {
    it('should throw an error if addressOperator is not provided in HRC1155', async () => {
      expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC1155', async () => {
      expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should throw an error if addressOwner is not provided in HRC1155', async () => {
      expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOwner is not provided in HRC1155', async () => {
      expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC1155', async () => {
      expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC721', async () => {
      expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided in HRC1155', async () => {
      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided in HRC721', async () => {
      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('owner', () => {
    it('should return the owner', async () => {
      const stub = sinon.stub(contract, "call").withArgs('owner', [], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(TEST_ADDRESS_1))
      
      const owner = await contract.owner(TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(owner).to.be.equals(await stub.returnValues[0])
    })
  })

  describe('totalSupply', () => {
    it('should return the total supply of the contract', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('totalSupply', [TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(FAKE_SUPPLY))

      const totalSupply = await contract.totalSupply(TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(totalSupply).to.be.equals(await stub.returnValues[0])
    })
  })

  describe('tokenURI', () => {
    it('should return the tokenURI for the given tokenId', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('uri', [TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(TOKEN_GOLD_URI))

      const tokenURI = await contract.tokenURI(TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(tokenURI).to.be.equals(await stub.returnValues[0])
    })

    it('should return the tokenURI of the tokenId with tokenId as a string', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('uri', [TOKEN_GOLD.toString()], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(TOKEN_GOLD_URI))

      const tokenURI = await contract.tokenURI(TOKEN_GOLD.toString(), TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(tokenURI).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if tokenId is a non existent token', async () => {
      expect(contract.tokenURI(6, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.tokenURI('')).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not valid', async () => {
      expect(contract.tokenURI('fakeInvalidId')).to.be.rejectedWith(Error)
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
    const AMOUNT = 10
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('mint', [TEST_ADDRESS_1, TOKEN_GOLD, AMOUNT, []], TX_OPTIONS)
      stub.resolves()

      await contract.mint(TEST_ADDRESS_1, TOKEN_GOLD, AMOUNT, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if account is not provided', async () => {
      expect(contract.mint('', TOKEN_GOLD, AMOUNT, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.mint(TEST_ADDRESS_1, '', AMOUNT, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.mint(TEST_ADDRESS_1, TOKEN_GOLD, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.mint('', '', '')).to.be.rejectedWith(Error)
    })
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

      const erc1155Address = await contract.getBridgedTokenAddress(
        fakeEthManager,
        fakeTokenManager,
        TOKEN_GOLD,
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

      const erc1155Address = await contract.getBridgedTokenAddress(
        fakeEthManager,
        fakeTokenManager,
        TOKEN_GOLD,
        TX_OPTIONS,
      )
      expect(stub.callCount).to.be.equals(2)
      expect(addTokenStub.calledOnce).to.be.true
      expect(erc1155Address).to.be.equals(expectedAddress)
    })
  })
})
