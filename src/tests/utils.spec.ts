import { ChainID } from '@harmony-js/utils'
import { expect } from 'chai'
import { HARMONY_RPC_DEVNET_WS, HARMONY_RPC_WS, NetworkInfo } from '../constants'
import { isBNish, getRpc, getChainId } from '../utils'


describe('Utils', () => {
  it('should return true if param is a BNish type, as a number', async () => {
    const bnish = isBNish(0)

    expect(bnish).to.not.be.null
    expect(bnish).to.not.be.undefined
    expect(bnish).to.be.equals(true)
  })

  it('should return true if param is a BNish type, as a string', async () => {
    const bnish = isBNish('0')

    expect(bnish).to.not.be.null
    expect(bnish).to.not.be.undefined
    expect(bnish).to.be.equals(true)
  })

  it('should return true if param is a BNish type, as a hexadecimal', async () => {
    const bnish = isBNish('0x0')

    expect(bnish).to.not.be.null
    expect(bnish).to.not.be.undefined
    expect(bnish).to.be.equals(true)
  })

  it('should return true if param is a BNish type, as a bigint', async () => {
    const bnish = isBNish(BigInt(0))

    expect(bnish).to.not.be.null
    expect(bnish).to.not.be.undefined
    expect(bnish).to.be.equals(true)
  })

  it('should return true if param is a BNish type, as a arrayish', async () => {
    const bnish = isBNish([0, 1])

    expect(bnish).to.not.be.null
    expect(bnish).to.not.be.undefined
    expect(bnish).to.be.equals(true)
  })

  it('should return false if param is undefined', async () => {
    const bnish = isBNish(undefined)

    expect(bnish).to.not.be.null
    expect(bnish).to.not.be.undefined
    expect(bnish).to.be.equals(false)
  })

  it('should return false if param is null', async () => {
    const bnish = isBNish(null)

    expect(bnish).to.not.be.null
    expect(bnish).to.not.be.undefined
    expect(bnish).to.be.equals(false)
  })
})

describe('getRpc', () => {
  it('should return the devnet rpc', () => {
    const rpc = getRpc(NetworkInfo.DEVNET)
    expect(rpc).to.be.equal(HARMONY_RPC_DEVNET_WS)
  })
  it('should return the mainnet rpc', () => {
    const rpc = getRpc(NetworkInfo.MAINNET)
    expect(rpc).to.be.equal(HARMONY_RPC_WS)
  })
  it('should throw an error if network info is invalid/not supported', () => {
    try {
      getRpc(5)
      expect.fail("Should not get here!!")
    } catch (error) {
      expect(error).not.to.be.undefined
    }
  })
})

describe('getChainId', () => {
  it('should return the mainnet chain id', () => {
    const chainId = getChainId(NetworkInfo.MAINNET)
    expect(chainId).to.be.equal(ChainID.HmyMainnet)
  })
  it('should return the devnet chain id', () => {
    const rpc = getChainId(NetworkInfo.DEVNET)
    expect(rpc).to.be.equal(4)
  })
  it('should throw an error if network info is invalid/not supported', () => {
    try {
      getChainId(5)
      expect.fail("Should not get here!!")
    } catch (error) {
      expect(error).not.to.be.undefined
    }
  })
})