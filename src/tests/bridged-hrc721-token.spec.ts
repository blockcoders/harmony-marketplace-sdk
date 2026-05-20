import { Wallet } from '@ethersproject/wallet'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgedHRC721Token } from '../bridge'
import { AddressZero } from '../constants'

use(chaiAsPromised)

const owner = '0x1111111111111111111111111111111111111111'

describe('BridgedHRC721Token', () => {
  let contract: BridgedHRC721Token

  beforeEach(() => {
    contract = new BridgedHRC721Token(AddressZero, Wallet.createRandom())
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('setTokenURI', () => {
    it('writes bridged token metadata through setTokenURI(uint256,string)', async () => {
      const stub = sinon.stub(contract, 'write').withArgs('setTokenURI', [7, 'ipfs://token-7'], undefined)

      await contract.setTokenURI(7, 'ipfs://token-7')

      expect(stub.calledOnce).to.be.true
    })

    it('rejects invalid token ids before sending a transaction', async () => {
      const stub = sinon.stub(contract, 'write')

      await expect(contract.setTokenURI('not-a-token-id', 'ipfs://token-7')).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })

  describe('baseURI', () => {
    it('reads the bridged token base URI', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('baseURI')
      stub.resolves('ipfs://base/')

      const baseURI = await contract.baseURI()

      expect(stub.calledOnce).to.be.true
      expect(baseURI).to.equal('ipfs://base/')
    })
  })

  describe('tokenByIndex', () => {
    it('reads a token id from the global enumerable index', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('tokenByIndex', [2])
      stub.resolves(9)

      const tokenId = await contract.tokenByIndex(2)

      expect(stub.calledOnce).to.be.true
      expect(tokenId).to.equal(9)
    })

    it('rejects invalid indexes before calling the contract', async () => {
      const stub = sinon.stub(contract, 'read')

      await expect(contract.tokenByIndex('not-an-index')).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })

  describe('tokenOfOwnerByIndex', () => {
    it('reads a token id from an owner enumerable index', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('tokenOfOwnerByIndex', [owner, 3])
      stub.resolves(11)

      const tokenId = await contract.tokenOfOwnerByIndex(owner, 3)

      expect(stub.calledOnce).to.be.true
      expect(tokenId).to.equal(11)
    })

    it('rejects invalid owners and indexes before calling the contract', async () => {
      const stub = sinon.stub(contract, 'read')

      await expect(contract.tokenOfOwnerByIndex(AddressZero, 3)).to.be.rejectedWith(Error)
      await expect(contract.tokenOfOwnerByIndex(owner, 'not-an-index')).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })

  describe('supportsInterface', () => {
    it('reads ERC165 interface support', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('supportsInterface', ['0x80ac58cd'])
      stub.resolves(true)

      const supportsInterface = await contract.supportsInterface('0x80ac58cd')

      expect(stub.calledOnce).to.be.true
      expect(supportsInterface).to.equal(true)
    })

    it('rejects empty interface ids before calling the contract', async () => {
      const stub = sinon.stub(contract, 'read')

      await expect(contract.supportsInterface('')).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })
})
