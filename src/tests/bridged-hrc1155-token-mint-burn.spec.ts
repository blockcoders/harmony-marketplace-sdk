import { Wallet } from '@ethersproject/wallet'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BridgedHRC1155Token } from '../bridge'

use(chaiAsPromised)

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000001'
const PRIVATE_KEY = '0x0123456789012345678901234567890123456789012345678901234567890123'
const ACCOUNT = '0x0000000000000000000000000000000000000002'
const TOKEN_ID = 7
const SECOND_TOKEN_ID = 8
const AMOUNT = 3
const SECOND_AMOUNT = 4
const TX_OPTIONS = { gasLimit: 21000 }
const TX_RECEIPT = { transactionHash: '0xfakeHash' } as any

describe('BridgedHRC1155Token mint and burn methods', () => {
  let token: BridgedHRC1155Token

  beforeEach(() => {
    token = new BridgedHRC1155Token(CONTRACT_ADDRESS, new Wallet(PRIVATE_KEY))
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should mint the provided token amount to the account', async () => {
    const stub = sinon.stub(token, 'write')
    stub.withArgs('mint', [ACCOUNT, TOKEN_ID, AMOUNT, []], TX_OPTIONS).resolves(TX_RECEIPT)

    const receipt = await token.mint(ACCOUNT, TOKEN_ID, AMOUNT, TX_OPTIONS)

    expect(stub.calledOnce).to.be.true
    expect(receipt).to.equal(TX_RECEIPT)
  })

  it('should batch mint the provided token amounts to the account', async () => {
    const tokenIds = [TOKEN_ID, SECOND_TOKEN_ID]
    const amounts = [AMOUNT, SECOND_AMOUNT]
    const stub = sinon.stub(token, 'write')
    stub.withArgs('batchMint', [ACCOUNT, tokenIds, amounts, []], TX_OPTIONS).resolves(TX_RECEIPT)

    const receipt = await token.batchMint(ACCOUNT, tokenIds, amounts, TX_OPTIONS)

    expect(stub.calledOnce).to.be.true
    expect(receipt).to.equal(TX_RECEIPT)
  })

  it('should reject batch mint calls with mismatched token id and amount arrays', async () => {
    await expect(token.batchMint(ACCOUNT, [TOKEN_ID], [AMOUNT, SECOND_AMOUNT], TX_OPTIONS)).to.be.rejectedWith(Error)
  })

  it('should burn the provided token amount from the account', async () => {
    const stub = sinon.stub(token, 'write')
    stub.withArgs('burn', [ACCOUNT, TOKEN_ID, AMOUNT], TX_OPTIONS).resolves(TX_RECEIPT)

    const receipt = await token.burn(ACCOUNT, TOKEN_ID, AMOUNT, TX_OPTIONS)

    expect(stub.calledOnce).to.be.true
    expect(receipt).to.equal(TX_RECEIPT)
  })

  it('should batch burn the provided token amounts from the account', async () => {
    const tokenIds = [TOKEN_ID, SECOND_TOKEN_ID]
    const amounts = [AMOUNT, SECOND_AMOUNT]
    const stub = sinon.stub(token, 'write')
    stub.withArgs('batchBurn', [ACCOUNT, tokenIds, amounts], TX_OPTIONS).resolves(TX_RECEIPT)

    const receipt = await token.batchBurn(ACCOUNT, tokenIds, amounts, TX_OPTIONS)

    expect(stub.calledOnce).to.be.true
    expect(receipt).to.equal(TX_RECEIPT)
  })

  it('should reject batch burn calls with mismatched token id and amount arrays', async () => {
    await expect(token.batchBurn(ACCOUNT, [TOKEN_ID], [AMOUNT, SECOND_AMOUNT], TX_OPTIONS)).to.be.rejectedWith(Error)
  })
})
