import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC721EthManager, HRC721TokenManager } from '../bridge'
import { AddressZero } from '../constants'
import { HRC721 } from '../contracts'
import {
  TEST_ADDRESS_1,
  TEST_ADDRESS_2,
  EMPTY_TEST_ADDRESS,
  TOKEN_GOLD,
  TX_OPTIONS,
  WALLET_PROVIDER_TEST_1,
  TOKEN_SWORD,
  ContractName,
  FAKE_SUPPLY,
  TOKEN_GOLD_URI,
  WALLET_ETH_MASTER,
} from './constants'
import { getContractMetadata } from './helpers'

use(chaiAsPromised)

describe('HRC721 Contract Interface', () => {
  let contract: HRC721

  before(async () => {
    const { abi } = await getContractMetadata(ContractName.BlockcodersHRC721)
    contract = new HRC721('0x', abi, WALLET_PROVIDER_TEST_1)
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

  describe('ownerOf', () => {
    it('should return the owner of the tokenId token', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf', [TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(TEST_ADDRESS_1))

      const owner = await contract.ownerOf(TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(owner).to.be.equals(await stub.returnValues[0])
    })

    it('should return the owner of the tokenId token with tokenId as a string', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf', [TOKEN_GOLD.toString()], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(TEST_ADDRESS_1))

      const owner = await contract.ownerOf(TOKEN_GOLD.toString(), TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(owner).to.be.equals(await stub.returnValues[0])
    })

    it('should return the origin address of the tokenId token if the token has no owner', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('ownerOf', [TOKEN_SWORD], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(TEST_ADDRESS_1))

      const owner = await contract.ownerOf(TOKEN_SWORD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(owner).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if tokenId is a non existent token', async () => {
      expect(contract.ownerOf(6, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.ownerOf('')).to.be.rejectedWith(Error)
    })

    it('should throw an error if txOptions is not provided', async () => {
      expect(contract.ownerOf(TOKEN_GOLD)).to.be.rejectedWith(Error)
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

  describe('safeTransferFrom', () => {
    it('should transfer the ownership of a token from one address to another with data', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs('safeTransferFrom', [TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD, '0x'], TX_OPTIONS)
      stub.resolves()

      await contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD, '0x', TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should transfer the ownership of a token from one address to another without data', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs('safeTransferFrom', [TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves()

      await contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD, '', TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw if there is no signer', () => {
      expect(contract.safeTransferFrom('', TEST_ADDRESS_2, TOKEN_GOLD, '0x', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw if there is no receiver', () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_1, '', TOKEN_GOLD, '0x', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw if there is no tokenId', () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })
  })

  describe('getApproved', () => {
    it('should return the account approved for tokenId token with txOptions', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('getApproved', [TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(AddressZero))

      const approved = await contract.getApproved(TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(approved).to.be.equals(await stub.returnValues[0])
    })

    it('should return the account approved for tokenId token without txOptions', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('getApproved', [TOKEN_GOLD])
      stub.resolves().returns(Promise.resolve(AddressZero))

      const approved = await contract.getApproved(TOKEN_GOLD)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(approved).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.getApproved('', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is invalid', async () => {
      expect(contract.getApproved(6, TX_OPTIONS)).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should return a boolean value if the operator is allowed to manage all of the assets of owner with txOptions', async () => {
      const stub = sinon
        .stub(contract, 'call')
        .withArgs('isApprovedForAll', [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(false))

      const approved = await contract.isApprovedForAll(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(approved).to.be.equals(await stub.returnValues[0])
    })

    it('should return a boolean value if the operator is allowed to manage all of the assets of owner without txOptions', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('isApprovedForAll', [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS])
      stub.resolves().returns(Promise.resolve(false))

      const approved = await contract.isApprovedForAll(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(approved).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if addressOwner is not provided', async () => {
      expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided', async () => {
      expect(contract.isApprovedForAll(TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOwner is zero-address', async () => {
      expect(contract.isApprovedForAll(AddressZero, EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is zero-address', async () => {
      expect(contract.isApprovedForAll(TEST_ADDRESS_1, AddressZero)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('setApprovalForAll', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('setApprovalForAll', [TEST_ADDRESS_1, true], TX_OPTIONS)
      stub.resolves()

      await contract.setApprovalForAll(TEST_ADDRESS_1, true, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if addressOperator is not provided', async () => {
      expect(contract.setApprovalForAll('', true, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if approved is not provided', async () => {
      expect(contract.setApprovalForAll(TEST_ADDRESS_1, false, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if txOptions are not provided', async () => {
      expect(contract.setApprovalForAll(TEST_ADDRESS_1, true)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.setApprovalForAll('', false)).to.be.rejectedWith(Error)
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

  describe('setApprovalForAll', () => {
    it('should throw an error if addressOperator is not provided in HRC1155', async () => {
      expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC721', async () => {
      expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should throw an error if addressOwner is not provided in HRC1155', async () => {
      expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOwner is not provided in HRC721', async () => {
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

  describe('tokenURI', () => {
    it('should return the tokenURI for the given tokenId', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('tokenURI', [TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(TOKEN_GOLD_URI))

      const tokenURI = await contract.tokenURI(TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(tokenURI).to.be.equals(await stub.returnValues[0])
    })

    it('should return the tokenURI of the tokenId with tokenId as a string', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('tokenURI', [TOKEN_GOLD.toString()], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(TEST_ADDRESS_1))

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
      stub.resolves().returns(Promise.resolve("BCFake"))

      const symbol = await contract.symbol(TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(symbol).to.be.equals(await stub.returnValues[0])
    })
  })

  describe('name', () => {
    it('should return the name on the NFT', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('name', [], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve("BlockCodersFake"))

      const name = await contract.name(TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(name).to.be.equals(await stub.returnValues[0])
    })
  })

  describe('increaseAllowance', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('increaseAllowance', [TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves()

      await contract.increaseAllowance(TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if spender is not provided', async () => {
      expect(contract.increaseAllowance('', TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if value is not provided', async () => {
      expect(contract.increaseAllowance(TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.increaseAllowance('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('decreaseAllowance', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('decreaseAllowance', [TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves()

      await contract.decreaseAllowance(TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if spender is not provided', async () => {
      expect(contract.decreaseAllowance('', TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if value is not provided', async () => {
      expect(contract.decreaseAllowance(TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.decreaseAllowance('', '')).to.be.rejectedWith(Error)
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

  describe('safeMint', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('safeMint', [TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves()

      await contract.safeMint(TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if account is not provided', async () => {
      expect(contract.safeMint('', TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.safeMint(TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.safeMint('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('burn', () => {
    it('should return the transaction', async () => {
      const stub = sinon.stub(contract, 'send').withArgs('burn', [TOKEN_GOLD], TX_OPTIONS)
      stub.resolves()

      await contract.burn(TOKEN_GOLD, TX_OPTIONS)
      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(contract.burn('', TX_OPTIONS)).to.be.rejectedWith(Error)
    })
  })

  describe('getBridgedTokenAddress', () => {
    it('should return the bridged token address', async () => {
      const expectedAddress = "0xfake"
      const callStub = sinon.stub(contract, 'call')
      callStub.withArgs('name', [], TX_OPTIONS).returns(Promise.resolve("BlockCodersFake"))
      callStub.withArgs('symbol', [], TX_OPTIONS).returns(Promise.resolve("BCFake"))
      callStub.withArgs('tokenURI', [TOKEN_GOLD], TX_OPTIONS).returns(Promise.resolve(TOKEN_GOLD_URI))
      
      const fakeEthManager = new HRC721EthManager("0x", WALLET_ETH_MASTER)
      const stub = sinon.stub(fakeEthManager, "mappings").withArgs(contract.address)
      stub.resolves().returns(Promise.resolve(expectedAddress))

      const fakeTokenManager = new HRC721TokenManager("0x", WALLET_ETH_MASTER)
      
      const erc721Address = await contract.getBridgedTokenAddress(fakeEthManager, fakeTokenManager, TOKEN_GOLD, TX_OPTIONS)
      
      expect(erc721Address).to.be.equals(expectedAddress)
    })

    it('should return the bridged token address after adding the new token', async () => {
      const expectedAddress = "0xfake"
      const callStub = sinon.stub(contract, 'call')
      callStub.withArgs('name', [], TX_OPTIONS).returns(Promise.resolve("BlockCodersFake"))
      callStub.withArgs('symbol', [], TX_OPTIONS).returns(Promise.resolve("BCFake"))
      callStub.withArgs('tokenURI', [TOKEN_GOLD], TX_OPTIONS).returns(Promise.resolve(TOKEN_GOLD_URI))
      
      const fakeEthManager = new HRC721EthManager("0x", WALLET_ETH_MASTER)
      const stub = sinon.stub(fakeEthManager, "mappings").withArgs(contract.address)
      stub.onCall(0).returns(Promise.resolve(AddressZero))
      stub.onCall(1).returns(Promise.resolve(expectedAddress))

      const addTokenStub = sinon.stub(fakeEthManager, "addToken")
      addTokenStub.resolves()
      const fakeTokenManager = new HRC721TokenManager("0x", WALLET_ETH_MASTER)
      
      const erc721Address = await contract.getBridgedTokenAddress(fakeEthManager, fakeTokenManager, TOKEN_GOLD, TX_OPTIONS)
      expect(stub.callCount).to.be.equals(2)
      expect(addTokenStub.calledOnce).to.be.true
      expect(erc721Address).to.be.equals(expectedAddress)
    })
  })
})
