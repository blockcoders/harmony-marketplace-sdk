import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { EthBaseContract } from '../contracts'
import { TEST_ADDRESS_2, TOKEN_GOLD, WALLET_ETH_MASTER } from './constants'

use(chaiAsPromised)

class TestToken extends EthBaseContract {
  constructor() {
    super('0x', [], WALLET_ETH_MASTER)
  }
}

describe('EthBase Contract', () => {
  let contract: TestToken

  before(async () => {
    contract = new TestToken()
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('write', () => {
    it('should throw an error if method is invalid', async () => {
      expect(contract.write('test', [])).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no transaction response', async () => {
      const stub = sinon.stub(EthBaseContract.prototype, 'write')
      stub.withArgs('safeTransferFrom', [TEST_ADDRESS_2, '', TOKEN_GOLD, 10, '0x']).onFirstCall().rejects()

      expect(contract.write('safeTransferFrom', [TEST_ADDRESS_2, '', TOKEN_GOLD, 10, '0x'])).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no params', async () => {
      const stub = sinon.stub(EthBaseContract.prototype, 'write')
      stub.withArgs('', []).onFirstCall().rejects()

      expect(contract.write('', [])).to.be.rejectedWith(Error)
    })
  })
})
