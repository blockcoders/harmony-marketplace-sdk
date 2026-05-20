import { Wallet } from '@ethersproject/wallet'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgedHRC1155Token } from '../bridge'
import { AddressZero } from '../constants'

use(chaiAsPromised)

describe('BridgedHRC1155Token', () => {
  let contract: BridgedHRC1155Token

  beforeEach(() => {
    contract = new BridgedHRC1155Token(AddressZero, Wallet.createRandom())
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('name', () => {
    it('reads the bridged collection name', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('name', [])
      stub.resolves('Bridged Items')

      const name = await contract.name()

      expect(stub.calledOnce).to.be.true
      expect(name).to.equal('Bridged Items')
    })
  })

  describe('symbol', () => {
    it('reads the bridged collection symbol', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('symbol', [])
      stub.resolves('BITEM')

      const symbol = await contract.symbol()

      expect(stub.calledOnce).to.be.true
      expect(symbol).to.equal('BITEM')
    })
  })

  describe('tokenURI', () => {
    it('reads ERC1155 metadata through the contract uri(uint256) function', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('uri', [7])
      stub.resolves('ipfs://metadata/7')

      const tokenURI = await contract.tokenURI(7)

      expect(stub.calledOnce).to.be.true
      expect(tokenURI).to.equal('ipfs://metadata/7')
    })

    it('passes string ids through to uri(uint256)', async () => {
      const stub = sinon.stub(contract, 'read').withArgs('uri', ['42'])
      stub.resolves('ipfs://metadata/42')

      const tokenURI = await contract.tokenURI('42')

      expect(stub.calledOnce).to.be.true
      expect(tokenURI).to.equal('ipfs://metadata/42')
    })

    it('rejects invalid token ids before calling the contract', async () => {
      const stub = sinon.stub(contract, 'read')

      await expect(contract.tokenURI('not-a-token-id')).to.be.rejectedWith(Error)
      expect(stub.called).to.be.false
    })
  })
})
