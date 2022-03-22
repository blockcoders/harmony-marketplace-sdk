import { Account } from '@harmony-js/account'
import { ChainID } from '@harmony-js/utils'
import BN from 'bn.js'
/*import { EXCHANGE_MODE, NETWORK_TYPE, TOKEN } from 'bridge-sdk'*/
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { BaseToken } from './base-token'
import { AddressZero, HARMONY_RPC_SHARD_0_TESTNET } from './constants'
import { BNish, HarmonyShards, ITransactionOptions } from './interfaces'
import { MnemonicKey } from './mnemonic-key'
import { PrivateKey } from './private-key'
import {
  TEST_ADDRESS_1,
  EMPTY_TEST_ADDRESS,
  TEST_ADDRESS_2,
  TEST_PK_1,
  TX_OPTIONS,
  TOKEN_GOLD,
  TEST_SEED,
} from './tests/constants'
import { ABI } from './tests/contracts/HRC721/abi'

class TestToken extends BaseToken {
  constructor() {
    super('0x', ABI, new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_PK_1, ChainID.HmyTestnet))
  }

  public async balanceOf(address: string, id?: BNish, txOptions?: ITransactionOptions): Promise<BN> {
    return this.getBalance(address, id, txOptions)
  }
}

describe('Base Token Provider', () => {
  let contract: TestToken

  use(chaiAsPromised)

  before(() => {
    contract = new TestToken()
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should throw an error if address is not provided in HRC1155', async () => {
      expect(contract.balanceOf('', 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if address is not provided in HRC721', async () => {
      expect(contract.balanceOf('')).to.be.rejectedWith(Error)
    })

    it('should throw an error if provided address is zero-address in HRC1155', async () => {
      expect(contract.balanceOf(AddressZero, 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if provided address is zero-address in HRC721', async () => {
      expect(contract.balanceOf(AddressZero)).to.be.rejectedWith(Error)
    })
  })

  describe('setApprovalForAll', () => {
    it('should throw an error if addressOperator is not provided in HRC1155', async () => {
      expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC721', async () => {
      expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error)
    })
  })

  describe('isApprovedForAll', () => {
    it('should throw an error if addressOwner is not provided in HRC1155', async () => {
      expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOwner is not provided in HRC721', async () => {
      expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC1155', async () => {
      expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if addressOperator is not provided in HRC721', async () => {
      expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided in HRC1155', async () => {
      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided in HRC721', async () => {
      expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('setSignerByPrivateKey', () => {
    it('should return an instance of an Account', async () => {
      const account = contract.setSignerByPrivateKey(TEST_PK_1)

      expect(account).to.not.be.null
      expect(account).to.not.be.undefined
      expect(account).to.be.instanceOf(Account)
    })

    it('should throw an error if privateKey is not provided', async () => {
      try {
        contract.setSignerByPrivateKey('')
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })

    it('should throw an error if privateKey is not valid', async () => {
      try {
        contract.setSignerByPrivateKey('This is a test')
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })

    it('should throw an error if type is not valid', async () => {
      try {
        contract.setSignerByPrivateKey(TEST_ADDRESS_2)
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('send', () => {
    it('should throw an error if method is invalid', async () => {
      expect(contract.send('test', [TOKEN_GOLD], TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no transaction response', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'send')
      stub.withArgs('safeTransferFrom', [TEST_ADDRESS_2, '', TOKEN_GOLD, 10, '0x'], TX_OPTIONS).onFirstCall().rejects()

      expect(
        contract.send('safeTransferFrom', [TEST_ADDRESS_2, '', TOKEN_GOLD, 10, '0x'], TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should throw an error if there is no params', async () => {
      const stub = sinon.stub(BaseToken.prototype, 'send')
      stub.withArgs('', []).onFirstCall().rejects()

      expect(contract.send('', [])).to.be.rejectedWith(Error)
    })
  })

  describe('setSignerByMnemonic', () => {
    it('should return an Account instance', async () => {
      const account = contract.setSignerByMnemonic(TEST_SEED)

      expect(account).to.not.be.null
      expect(account).to.not.be.undefined
      expect(account).to.be.instanceOf(Account)
    })

    it('should throw an error if mnemonic is not valid', async () => {
      try {
        contract.setSignerByMnemonic('')
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  describe('setSignerByKey', () => {
    it('should throw an error if key is not valid', async () => {
      try {
        new MnemonicKey(HARMONY_RPC_SHARD_0_TESTNET.url, {}, ChainID.HmyTestnet)
      } catch (error) {
        expect(error).to.not.null
        expect(error).to.not.undefined
        expect(error).to.be.instanceOf(Error)
      }
    })
  })

  /*describe('bridgeToken', () => {
    const PK = '0xae7eb3a0d2dc10f332ea0156e6a942d2db0d7765351c312c98663fbec3f36712'
    const M_PK = '0x05f1e68452b809de284575b342e887e01c6d1aa0c719ee6ef4299e70bded3561'
    it('one to eth', async () => {
      await contract.bridgeToken(
        {
          ethAddress: '0x3C6914F9276Ecc1d31f9C57b9906CfA1F55Bd97A',
          oneAddress: 'one1mwhtsd264qk4yacxy53hy37jfryzwvxg6hlxw8',
          network: NETWORK_TYPE.ETHEREUM,
          type: EXCHANGE_MODE.ONE_TO_ETH,
          token: TOKEN.ONE,
          amount: 10,
        },
        PK,
      )
      Promise.resolve()
    })
    it('eth to one', async () => {
      await contract.bridgeToken(
        {
          ethAddress: '0x3C6914F9276Ecc1d31f9C57b9906CfA1F55Bd97A',
          oneAddress: 'one1mwhtsd264qk4yacxy53hy37jfryzwvxg6hlxw8',
          network: NETWORK_TYPE.ETHEREUM,
          type: EXCHANGE_MODE.ETH_TO_ONE,
          token: TOKEN.ONE,
          amount: 10,
        },
        M_PK,
      )
      Promise.resolve()
    })
    it('erc1155', async () => {
      await contract.bridgeToken(
        {
          ethAddress: '0x3C6914F9276Ecc1d31f9C57b9906CfA1F55Bd97A',
          oneAddress: 'one1mwhtsd264qk4yacxy53hy37jfryzwvxg6hlxw8',
          network: NETWORK_TYPE.ETHEREUM,
          type: EXCHANGE_MODE.ONE_TO_ETH,
          token: TOKEN.ERC1155,
          amount: 1,
          tokenInfo: {
            contractToken: 'erc1155',
            tokenAddress: '0x35889EB854f5B1beB779161D565Af5921f528757',
            tokenId: '1',
          },
        },
        PK,
      )
      Promise.resolve()
    })
  })*/
})
