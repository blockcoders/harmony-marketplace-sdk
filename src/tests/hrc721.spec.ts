import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgeToken } from '../bridge-managers/bridge-token'
import { AddressZero } from '../constants'
import { BRIDGE, BridgeParams, BRIDGE_TOKENS } from '../interfaces'
import { HRC721 } from '../tokens/hrc721'
import {
  HRC721_CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  TEST_ADDRESS_2,
  EMPTY_TEST_ADDRESS,
  TOKEN_GOLD,
  TX_OPTIONS,
  WALLET_PROVIDER_TEST_1,
  TOKEN_SWORD,
  WALLET_ETH_PROVIDER_TEST_1,
} from './constants'
import { ABI } from './contracts/HRC721/abi'

describe('HRC721 Contract Interface', () => {
  use(chaiAsPromised)

  let contract: HRC721

  before(() => {
    contract = new HRC721(HRC721_CONTRACT_ADDRESS, ABI, WALLET_PROVIDER_TEST_1)
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

  describe('bridgeToken E2E', () => {
    it('Sends an HRC721 token from hmy to eth', async () => {
      const params: BridgeParams = {
        ethAddress: TEST_ADDRESS_1,
        oneAddress: 'one1rnh8ruyzr7ma8n96e23zrtr7x49u0epe283wff',
        type: BRIDGE.HMY_TO_ETH,
        token: BRIDGE_TOKENS.HRC721,
        amount: 20,
        tokenId: 5,
      }

      const bridge = new BridgeToken(contract, WALLET_ETH_PROVIDER_TEST_1, WALLET_PROVIDER_TEST_1)

      await bridge.bridgeToken(params)
    })
  })
})
