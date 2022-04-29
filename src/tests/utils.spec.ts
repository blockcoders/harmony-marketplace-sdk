import { expect } from 'chai'
import { isBNish } from '../utils'

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
