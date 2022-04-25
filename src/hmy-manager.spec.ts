import { fail } from 'assert'
import { expect } from 'chai'
import sinon from 'sinon'
import { abi as ABI } from './abi-hmy-manager-erc721'
import { HarmonyManagerContract } from './hmy-manager'
import { TX_OPTIONS, WALLET_PROVIDER_TEST_1 } from './tests/constants'

let contract: HarmonyManagerContract

before(() => {
  contract = new HarmonyManagerContract('0xFakeAddress', ABI, WALLET_PROVIDER_TEST_1)
})

afterEach(async () => {
  sinon.restore()
})

describe('Manager', () => {

  // ----------------------------------------- NOT IMPLEMENTED YET-------------------------------------------//
  it('addToken', async () => {
    try {
      await contract.addToken("fakeTokenManager","fakeEthTokenAddress","fakeName", "FAKE_SYMBOL")
      fail("Should not get here")
    } catch (error) {
      expect(error).to.exist
    }
  })

  it('removeToken', async () => {
    try {
      await contract.removeToken("fakeTokenManager","fakeEthTokenAddress")
      fail("Should not get here")
    } catch (error) {
      expect(error).to.exist
    }
  })

  it('mintToken', async () => {
    try {
      await contract.mintToken("fakeOneToken", 0, "fakeRecipient", "fakeReceipt")
      fail("Should not get here")
    } catch (error) {
      expect(error).to.exist
    }
  })

  it('mintTokens', async () => {
    try {
      await contract.mintTokens("fakeOneToken", [0], "fakeRecipient", "fakeReceipt")
      fail("Should not get here")
    } catch (error) {
      expect(error).to.exist
    }
  })

  // --------------------------------------------------------------------------------------------------------//


  it('burnToken', async () => {
    const oneToken = "0xFakeAddress"
    const tokenId = 10
    const recipient = "0xFakeRecipient"
    const stub = sinon.stub(contract, 'send').withArgs('burnToken', [oneToken, tokenId, recipient], TX_OPTIONS)
    stub.resolves()

    await contract.burnToken(oneToken, tokenId, recipient, TX_OPTIONS)
    expect(stub.calledOnce).to.be.true
    expect(stub.callCount).to.be.equals(1)
  })

  it('burnTokens', async () => {
    const oneToken = "0xFakeAddress"
    const tokenIds = [10,11]
    const recipient = "0xFakeRecipient"
    const stub = sinon.stub(contract, 'send').withArgs('burnTokens', [oneToken, tokenIds, recipient], TX_OPTIONS)
    stub.resolves()

    await contract.burnTokens(oneToken, tokenIds, recipient, TX_OPTIONS)
    expect(stub.calledOnce).to.be.true
    expect(stub.callCount).to.be.equals(1)
  })
})
