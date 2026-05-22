import { expect } from 'chai'
import { isBNish, isValidHarmonyAddress, shortenAddress } from '../utils'

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

  it('should validate Harmony bech32 and hex addresses', async () => {
    expect(isValidHarmonyAddress('one1pdv9lrdwl0rg5vglh4xtyrv3wjk3wsqket7zxy')).to.be.equals(true)
    expect(isValidHarmonyAddress('0x0B585F8dAefBC68A311fBd4Cb20D9174ad174016')).to.be.equals(true)
    expect(isValidHarmonyAddress('not-an-address')).to.be.equals(false)
  })

  it('should shorten Harmony addresses for UI display', async () => {
    const shortened = shortenAddress('one1pdv9lrdwl0rg5vglh4xtyrv3wjk3wsqket7zxy')

    expect(shortened).to.be.equals('one1pdv9...7zxy')
  })

  it('should shorten hex addresses as bech32 Harmony addresses', async () => {
    const shortened = shortenAddress('0x0B585F8dAefBC68A311fBd4Cb20D9174ad174016', 6)

    expect(shortened).to.be.equals('one1pdv9lr...et7zxy')
  })

  it('should reject invalid addresses when shortening', async () => {
    expect(() => shortenAddress('not-an-address')).to.throw('Invalid Harmony address')
  })
})
