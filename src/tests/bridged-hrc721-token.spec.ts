import { Wallet } from '@ethersproject/wallet'
import { expect } from 'chai'
import sinon from 'sinon'
import { BridgedHRC721Token } from '../bridge'

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000001'
const PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123'
const TOKEN_ID = 1
const TOKEN_URI = 'https://example.com/token/1'

describe('BridgedHRC721Token', () => {
  let token: BridgedHRC721Token

  beforeEach(() => {
    token = new BridgedHRC721Token(CONTRACT_ADDRESS, new Wallet(PRIVATE_KEY))
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('tokenURI', () => {
    it('should return the token URI string for the given tokenId', async () => {
      const stub = sinon.stub(token, 'read')
      stub.withArgs('tokenURI', [TOKEN_ID]).resolves(TOKEN_URI)

      const tokenURI: string = await token.tokenURI(TOKEN_ID)

      expect(stub.calledOnce).to.be.true
      expect(tokenURI).to.equal(TOKEN_URI)
    })
  })
})
