import { ChainID } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BaseToken } from './base-token'
import { AddressZero } from './constants'
import { BNish, HarmonyShards, ITransactionOptions } from './interfaces'
import { PrivateKey } from './private-key'
import { TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, TEST_ACCOUNT_2, TEST_ACCOUNT_1 } from './tests/constants'
import { ABI } from './tests/contracts/HRC721/abi'

class TestToken extends BaseToken {
  constructor() {
    super('0x', ABI, new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet))
  }

  public async balanceOf(address: string, id?: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    return this.getBalance(address, id, txOptions)
  }
}

describe('Base Token Provider', () => {
  let contract: TestToken

  use(chaiAsPromised)

  before(() => {
    contract = new TestToken()
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should throw an error if address is not provided in HRC1155', async () => {
      expect(contract.balanceOf('', 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if address is not provided in HRC721', async () => {
      expect(contract.balanceOf('')).to.be.rejectedWith(Error)
    })

    it('should throw an error if provided address is zero-address in HRC1155', async () => {
      expect(contract.balanceOf(AddressZero, 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if provided address is zero-address in HRC721', async () => {
      expect(contract.balanceOf(AddressZero)).to.be.rejectedWith(Error)
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

  describe('setSignerByPrivateKey', () => {
    it('should throw an error if privateKey is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey')
      stub.withArgs('').onCall(0).rejects()

      expect(contract.setSignerByPrivateKey('')).to.be.rejectedWith(Error)
    })

    it('should throw an error if privateKey is not valid', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey')
      stub.withArgs('This is a test').onCall(0).rejects()

      expect(contract.setSignerByPrivateKey('This is a test')).to.be.rejectedWith(Error)
    })

    it('should throw an error if type is not provided', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey')
      stub.withArgs(TEST_ACCOUNT_2.privateKey).onCall(0).rejects()

      expect(contract.setSignerByPrivateKey(TEST_ACCOUNT_2.privateKey)).to.be.rejectedWith(Error)
    })
  })
})
