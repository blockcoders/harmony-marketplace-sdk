import { expect } from 'chai'
import sinon from 'sinon'
import { BridgedHRC20Token } from '../bridge'
import { TEST_ADDRESS_1, TEST_ADDRESS_2, WALLET_ETH_OWNER } from './constants'

describe('BridgedHRC20Token', () => {
  let bridgedToken: BridgedHRC20Token

  beforeEach(() => {
    bridgedToken = new BridgedHRC20Token(TEST_ADDRESS_1, WALLET_ETH_OWNER)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('forwards increaseAllowance to the underlying contract write call', async () => {
    const txReceipt = { transactionHash: '0x123' } as any
    const writeStub = sinon.stub(bridgedToken, 'write').resolves(txReceipt)

    const result = await bridgedToken.increaseAllowance(TEST_ADDRESS_2, 5)

    expect(result).to.equal(txReceipt)
    expect(writeStub.calledOnceWithExactly('increaseAllowance', [TEST_ADDRESS_2, 5], undefined)).to.equal(true)
  })

  it('forwards decreaseAllowance to the underlying contract write call', async () => {
    const txReceipt = { transactionHash: '0x456' } as any
    const writeStub = sinon.stub(bridgedToken, 'write').resolves(txReceipt)

    const result = await bridgedToken.decreaseAllowance(TEST_ADDRESS_2, 3)

    expect(result).to.equal(txReceipt)
    expect(writeStub.calledOnceWithExactly('decreaseAllowance', [TEST_ADDRESS_2, 3], undefined)).to.equal(true)
  })
})
