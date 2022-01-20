import { JsonRpcProvider } from '@ethersproject/providers'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HR721, RpcError } from './harmony-rpc'
import { HARMONY_TESTNET_NETWORK } from './networks'

describe('HarmonyProvider', () => {
  let provider: HR721
  use(chaiAsPromised)

  beforeEach(async () => {
    const jsonProvider = new JsonRpcProvider(HARMONY_TESTNET_NETWORK)
    const abi = ''
    provider = new HR721(jsonProvider, abi)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account', async () => {
      const balance = await provider.balanceOf('one103su3u5z464w8cz8d5zn85sacsk94g2x2nty0a')
      expect(balance).to.exist
      expect(balance).to.be.finite
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
