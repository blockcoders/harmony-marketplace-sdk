import { Wallet } from '@ethersproject/wallet'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgedHRC721Token } from '../bridge'
import { AddressZero } from '../constants'

use(chaiAsPromised)

const owner = '0x1111111111111111111111111111111111111111'
const approved = '0x2222222222222222222222222222222222222222'
const operator = '0x3333333333333333333333333333333333333333'

describe('BridgedHRC721Token', () => {
  let contract: BridgedHRC721Token

  beforeEach(() => {
    contract = new BridgedHRC721Token(AddressZero, Wallet.createRandom())
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('ownerOf', () => {
    it('reads token ownership through ownerOf(uint256)', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('ownerOf', [7])
      stub.resolves(owner.toUpperCase())

      const tokenOwner = await contract.ownerOf(7)

      expect(stub.calledOnce).to.be.true
      expect(tokenOwner).to.equal(owner)
    })

    it('rejects invalid token ids before calling the contract', async () => {
      const stub = sinon.stub(contract, 'read')

      await expect(contract.ownerOf('not-a-token-id')).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })

  describe('getApproved', () => {
    it('reads the approved account for a token', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('getApproved', ['42'])
      stub.resolves(approved.toUpperCase())

      const approvedAddress = await contract.getApproved('42')

      expect(stub.calledOnce).to.be.true
      expect(approvedAddress).to.equal(approved)
    })
  })

  describe('setApprovalForAll', () => {
    it('writes operator approval state', async () => {
      const stub = sinon.stub(contract, 'write').withArgs('setApprovalForAll', [operator, true], undefined)

      await contract.setApprovalForAll(operator, true)

      expect(stub.calledOnce).to.be.true
    })

    it('rejects an empty operator before sending a transaction', async () => {
      const stub = sinon.stub(contract, 'write')

      await expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })

  describe('isApprovedForAll', () => {
    it('reads operator approval state', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('isApprovedForAll', [owner, operator])
      stub.resolves(true)

      const isApproved = await contract.isApprovedForAll(owner, operator)

      expect(stub.calledOnce).to.be.true
      expect(isApproved).to.equal(true)
    })

    it('rejects zero owner and operator addresses before calling the contract', async () => {
      const stub = sinon.stub(contract, 'read')

      await expect(contract.isApprovedForAll(AddressZero, operator)).to.be.rejectedWith(Error)
      await expect(contract.isApprovedForAll(owner, AddressZero)).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })

  describe('safeTransferFrom', () => {
    it('uses the non-data safeTransferFrom overload', async () => {
      const stub = sinon
        .stub(contract, 'write')
        .withArgs('safeTransferFrom(address,address,uint256)', [owner, approved, 7], undefined)

      await contract.safeTransferFrom(owner, approved, 7)

      expect(stub.calledOnce).to.be.true
    })

    it('rejects zero-address recipients before sending a transaction', async () => {
      const stub = sinon.stub(contract, 'write')

      await expect(contract.safeTransferFrom(owner, AddressZero, 7)).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })
})
