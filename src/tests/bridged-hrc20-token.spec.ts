import { Wallet } from '@ethersproject/wallet'
import { expect } from 'chai'
import sinon from 'sinon'
import { BridgedHRC20Token } from '../bridge'

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000001'
const PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123'
const ACCOUNT = '0x0000000000000000000000000000000000000002'
const AMOUNT = '1000000000000000000'
const TX_OPTIONS = { gasLimit: 21000 }
const TX_RECEIPT = { transactionHash: '0xfakeHash' } as any

describe('BridgedHRC20Token', () => {
  let token: BridgedHRC20Token

  beforeEach(() => {
    token = new BridgedHRC20Token(CONTRACT_ADDRESS, new Wallet(PRIVATE_KEY))
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('mint', () => {
    it('should mint the provided amount to the account', async () => {
      const stub = sinon.stub(token, 'write')
      stub.withArgs('mint', [ACCOUNT, AMOUNT], TX_OPTIONS).resolves(TX_RECEIPT)

      const receipt = await token.mint(ACCOUNT, AMOUNT, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(receipt).to.equal(TX_RECEIPT)
    })
  })
})
