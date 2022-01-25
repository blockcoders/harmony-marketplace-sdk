import { JsonRpcProvider } from '@ethersproject/providers'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC721, RpcError } from './HRC721'
import { HARMONY_TESTNET_NETWORK } from './networks'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './tests/constants'

describe('HarmonyProvider', () => {
  let provider: HRC721
  use(chaiAsPromised)

  beforeEach(async () => {
    const jsonProvider = new JsonRpcProvider(HARMONY_TESTNET_NETWORK)
    provider = new HRC721(jsonProvider, CONTRACT_ABI, CONTRACT_ADDRESS)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account', async () => {
      const balance = await provider.balanceOf('0x36f41b8a79eca329610d6158f3ea9676bec281b9')
      expect(balance).to.exist
    })

    it('should throw an error if address is not provided', async () => {
      expect(provider.balanceOf('')).to.be.rejectedWith(Error)
    })
  })

  describe('RpcError', () => {
    it('should be an instance of Error', () => {
      const type = 'METHOD_NOT_FOUND'
      const code = 32601
      const data = 'invalid method'
      const error = new RpcError('Method not found', type, code, data)

      expect(error).to.be.an.instanceof(Error)
      expect(error.name).to.be.eq(RpcError.name)
      expect(error.type).to.be.eq(type)
      expect(error.code).to.be.eq(code)
      expect(error.data).to.be.eq(data)
    })
  })
})
