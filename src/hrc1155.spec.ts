import { Harmony } from '@harmony-js/core'
import { ChainID, ChainType } from '@harmony-js/utils'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC1155 } from './hrc1155'
import {
  HRC1155_CONTRACT_ABI,
  HRC1155_CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  TEST_ACCOUNT_1,
  HARMONY_TESTNET,
  EMPTY_TEST_ADDRESS,
  TEST_ACCOUNT_2,
} from './tests/constants'

describe('HRC1155 Provider', () => {
  const client = new Harmony(HARMONY_TESTNET, {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  })
  let provider: HRC1155
  use(chaiAsPromised)

  beforeEach(async () => {
    provider = new HRC1155(HRC1155_CONTRACT_ADDRESS, HRC1155_CONTRACT_ABI, client)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(provider).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account with id as a number', async () => {
      const balance = await provider.balanceOf(TEST_ADDRESS_1, 1)
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(100000100)
    })

    it('should get the number of tokens in the specified account with id as a string', async () => {
      const balance = await provider.balanceOf(TEST_ADDRESS_1, '1')
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(100000100)
    })

    it('should get the number of tokens in the specified account with id as a byte', async () => {
      const balance = await provider.balanceOf(TEST_ADDRESS_1, '00000001')
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.equals(100000100)
    })

    it('should throw an error if address is not provided', async () => {
      expect(provider.balanceOf('', 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if id is not provided', async () => {
      expect(provider.balanceOf(TEST_ADDRESS_1, 0)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(provider.balanceOf('', 0)).to.be.rejectedWith(Error)
    })
  })

  describe('balanceOfBatch', () => {
    it('should return multiple balances in the specified account with id as a number', async () => {
      const balance = await provider.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], [1, 2])
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).length(2)
    })

    it('should return multiple balances in the specified account with id as a string', async () => {
      const balance = await provider.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], ['1', '2'])
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).length(2)
    })

    it('should return multiple balances in the specified account with id as a byte', async () => {
      const balance = await provider.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], ['00000001', '00000010'])
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).length(2)
    })

    it('should throw an error if ids is not provided', async () => {
      expect(provider.balanceOfBatch([], [1, 2])).to.be.rejectedWith(Error)
    })

    it('should throw an error if accounts is not provided', async () => {
      expect(provider.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], [])).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(provider.balanceOfBatch([], [])).to.be.rejectedWith(Error)
    })
  })

  describe('safeBatchTransferFrom', async () => {
    it('should transfer amount tokens of the specified id from one address to another', async () => {
      provider.setSignerByPrivateKey(TEST_ACCOUNT_1.privateKey, 'HRC1155')
      const approved = await provider.setApprovalForAll(TEST_ACCOUNT_1.address, true)
      provider.setSignerByPrivateKey(TEST_ACCOUNT_2.privateKey, 'HRC1155')
      console.log(approved)
      const safe = await provider.safeBatchTransferFrom(TEST_ADDRESS_1, TEST_ACCOUNT_2.address, [1], [10], '0x')
      expect(safe).to.exist
      expect(safe).to.not.be.null
      expect(safe).to.not.be.undefined
    })

    it('should thow an error if sender address is not provided', async () => {
      expect(provider.safeBatchTransferFrom('', TEST_ADDRESS_1, [1], [10], '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if receiver address is not provided', async () => {
      expect(provider.safeBatchTransferFrom(TEST_ADDRESS_1, '', [1], [10], '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if token ids are not provided', async () => {
      expect(provider.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [], [10], '0x')).to.be.rejectedWith(
        Error,
      )
    })

    it('should thow an error if amounts are not provided', async () => {
      expect(provider.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [1], [], '0x')).to.be.rejectedWith(
        Error,
      )
    })

    it('should thow an error if data is not provided', async () => {
      expect(provider.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [1], [10], '')).to.be.rejectedWith(
        Error,
      )
    })

    it('should throw an error if params are not provided', async () => {
      expect(provider.safeBatchTransferFrom('', '', [0], [0], '')).to.be.rejectedWith(Error)
    })
  })
})
