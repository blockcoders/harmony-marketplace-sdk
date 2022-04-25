import { withDecimals } from 'bridge-sdk/lib/blockchain/utils'
import { expect } from 'chai'
import sinon from 'sinon'
import { abi as ABI } from './abi-hmy-deposit'
import { HarmonyDepositContract } from './hmy-deposit'
import { TX_OPTIONS, WALLET_PROVIDER_TEST_1 } from './tests/constants'

let contract: HarmonyDepositContract

before(() => {
  contract = new HarmonyDepositContract('0xFakeAddress', ABI, WALLET_PROVIDER_TEST_1)
})

afterEach(async () => {
  sinon.restore()
})

describe('Deposit', () => {
  it('calls send only once', async () => {
    const fakeAmount = 10
    const stub = sinon.stub(contract, 'send').withArgs('deposit', [withDecimals(fakeAmount, 18)], TX_OPTIONS)
    stub.resolves()

    await contract.deposit(fakeAmount, TX_OPTIONS)
    expect(stub.calledOnce).to.be.true
    expect(stub.callCount).to.be.equals(1)
  })
})
