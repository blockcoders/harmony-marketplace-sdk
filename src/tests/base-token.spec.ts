import { ChainID } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { AddressZero } from '../constants'
import { BaseToken } from '../contracts'
import { BNish, HarmonyShards, ITransactionOptions } from '../interfaces'
import { PrivateKey } from '../wallets'
import { TEST_PK_1 } from './constants'
import { ABI } from './contracts/TestToken/abi'

use(chaiAsPromised)

class TestToken extends BaseToken {
  constructor() {
    super('0x', ABI, new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_PK_1, ChainID.HmyPangaea))
  }
  public async balanceOf(address: string, id?: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    return this.getBalance(address, id, txOptions)
  }
}

describe('Base Token', () => {
  let contract: TestToken

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
})
