import { JsonRpcProvider } from '@ethersproject/providers'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants'
import { HR721, RpcError } from './harmony-rpc'
import { HARMONY_TESTNET_NETWORK } from './networks'

describe('HarmonyProvider', () => {
  let provider: HR721
  use(chaiAsPromised)

  beforeEach(async () => {
    const jsonProvider = new JsonRpcProvider(HARMONY_TESTNET_NETWORK)
    provider = new HR721(jsonProvider, CONTRACT_ABI, CONTRACT_ADDRESS)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('ownerOf', () => {
    it('should returns the owner of the tokenId token.', async () => {
      const owner = await provider.ownerOf('1')
      expect(owner).to.exist
    })

    it('should throw an error if tokenId is not provided', async () => {
      expect(provider.ownerOf('')).to.be.rejectedWith(Error)
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
