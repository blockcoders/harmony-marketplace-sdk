import { Wallet } from '@ethersproject/wallet'
import { expect } from 'chai'
import sinon from 'sinon'
import { BridgedHRC721Token } from '../bridge'

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000001'
const PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123'
const ACCOUNT = '0x0000000000000000000000000000000000000002'
const TOKEN_ID = 7
const TX_OPTIONS = { gasLimit: 21000 }
const TX_RECEIPT = { transactionHash: '0xfakeHash' } as any

describe('BridgedHRC721Token mint and burn methods', () => {
  let token: BridgedHRC721Token

  beforeEach(() => {
    token = new BridgedHRC721Token(CONTRACT_ADDRESS, new Wallet(PRIVATE_KEY))
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should mint the provided token id to the account', async () => {
    const stub = sinon.stub(token, 'write')
    stub.withArgs('mint', [ACCOUNT, TOKEN_ID], TX_OPTIONS).resolves(TX_RECEIPT)

    const receipt = await token.mint(ACCOUNT, TOKEN_ID, TX_OPTIONS)

    expect(stub.calledOnce).to.be.true
    expect(receipt).to.equal(TX_RECEIPT)
  })

  it('should burn the provided token id', async () => {
    const stub = sinon.stub(token, 'write')
    stub.withArgs('burn', [TOKEN_ID], TX_OPTIONS).resolves(TX_RECEIPT)

    const receipt = await token.burn(TOKEN_ID, TX_OPTIONS)

    expect(stub.calledOnce).to.be.true
    expect(receipt).to.equal(TX_RECEIPT)
  })

  it('should burn the provided token id from the owner account', async () => {
    const stub = sinon.stub(token, 'write')
    stub.withArgs('burnFrom', [ACCOUNT, TOKEN_ID], TX_OPTIONS).resolves(TX_RECEIPT)

    const receipt = await token.burnFrom(ACCOUNT, TOKEN_ID, TX_OPTIONS)

    expect(stub.calledOnce).to.be.true
    expect(receipt).to.equal(TX_RECEIPT)
  })
})
