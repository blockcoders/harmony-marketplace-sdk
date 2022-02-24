import { TxStatus } from '@harmony-js/transaction'
import { ChainID } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { HRC1155 } from './hrc1155'
import { HarmonyShards } from './interfaces'
import { PrivateKey } from './private-key'
import {
  HRC1155_CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  TEST_ACCOUNT_1,
  EMPTY_TEST_ADDRESS,
  TEST_ADDRESS_2,
  TOKEN_GOLD,
  TOKEN_SILVER,
  TX_OPTIONS,
} from './tests/constants'
import { ABI } from './tests/contracts/HRC1155/abi'

describe('HRC1155 Contract Interface', () => {
  use(chaiAsPromised)

  let contract: HRC1155
  let provider: PrivateKey

  before(() => {
    provider = new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet)
    contract = new HRC1155(HRC1155_CONTRACT_ADDRESS, ABI, provider)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account with id as a number', async () => {
      const balance = await contract.balanceOf(TEST_ADDRESS_1, TOKEN_GOLD)

      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.an.instanceof(BN)
      expect(balance.gt(new BN(0))).to.be.true
    })

    it('should get the number of tokens in the specified account with id as a string', async () => {
      const balance = await contract.balanceOf(TEST_ADDRESS_1, TOKEN_GOLD.toString())

      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.an.instanceof(BN)
      expect(balance.gt(new BN(0))).to.be.true
    })

    it('should throw an error if address is not provided', async () => {
      expect(contract.balanceOf('', 1)).to.be.rejectedWith(Error)
    })

    it('should throw an error if id is not provided', async () => {
      expect(contract.balanceOf(TEST_ADDRESS_1, 0)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.balanceOf('', 0)).to.be.rejectedWith(Error)
    })
  })

  describe('balanceOfBatch', () => {
    it('should return multiple balances in the specified account with id as a number', async () => {
      const balance = await contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], [1, 2])
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).length(2)
    })

    it('should return multiple balances in the specified account with id as a string', async () => {
      const balance = await contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], ['1', '2'])
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).length(2)
    })

    it('should return multiple balances in the specified account with id as a byte', async () => {
      const balance = await contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], ['00000001', '00000010'])
      expect(balance).to.exist
      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).length(2)
    })

    it('should throw an error if ids is not provided', async () => {
      expect(contract.balanceOfBatch([], [1, 2])).to.be.rejectedWith(Error)
    })

    it('should throw an error if accounts is not provided', async () => {
      expect(contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], [])).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.balanceOfBatch([], [])).to.be.rejectedWith(Error)
    })
  })

  describe('safeTransferFrom', async () => {
    it.skip('should transfer amount tokens of the specified id from one address to another', async () => {
      const balance = await contract.balanceOf(TEST_ADDRESS_2, TOKEN_GOLD.toString())

      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.an.instanceof(BN)

      const result = await contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, TOKEN_GOLD, 1, '0x', TX_OPTIONS)

      expect(result.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result.receipt?.blockHash).to.be.string

      const newBalance = await contract.balanceOf(TEST_ADDRESS_2, TOKEN_GOLD.toString())

      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.an.instanceof(BN)
      expect(newBalance.gt(balance)).to.be.true
    })

    it('should thow an error if sender address is not provided', async () => {
      expect(contract.safeTransferFrom('', TEST_ADDRESS_1, 1, 10, '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if receiver address is not provided', async () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_1, '', 1, 10, '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if token id is not provided', async () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, '', 10, '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if amount is not provided', async () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, 1, '', '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if data is not provided', async () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, 1, 10, '')).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.safeTransferFrom('', '', 0, 0, '')).to.be.rejectedWith(Error)
    })
  })

  describe('safeBatchTransferFrom', async () => {
    it.skip('should transfer amount tokens of the specified id from one address to another', async () => {
      const balance = await contract.balanceOfBatch(
        [TEST_ADDRESS_1, TEST_ADDRESS_2],
        [TOKEN_GOLD.toString(), TOKEN_SILVER.toString()],
      )

      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.exist

      const result = await contract.safeBatchTransferFrom(
        TEST_ADDRESS_1,
        TEST_ADDRESS_2,
        [TOKEN_GOLD, TOKEN_SILVER],
        [1, 2],
        '0x',
        TX_OPTIONS,
      )

      expect(result.txStatus).to.eq(TxStatus.CONFIRMED)
      expect(result.receipt?.blockHash).to.be.string

      const newBalance = await contract.balanceOfBatch([TEST_ADDRESS_2, TEST_ADDRESS_1], [TOKEN_GOLD, TOKEN_SILVER])

      expect(balance).to.not.be.null
      expect(balance).to.not.be.undefined
      expect(balance).to.be.exist
      expect(parseInt(newBalance[0].toString())).to.be.lt(parseInt(balance[0].toString()))
    })

    it('should thow an error if sender address is not provided', async () => {
      expect(contract.safeBatchTransferFrom('', TEST_ADDRESS_1, [TOKEN_GOLD], [10], '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if receiver address is not provided', async () => {
      expect(contract.safeBatchTransferFrom(TEST_ADDRESS_1, '', [TOKEN_GOLD], [10], '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if token ids are not provided', async () => {
      expect(contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [], [10], '0x')).to.be.rejectedWith(
        Error,
      )
    })

    it('should thow an error if amounts are not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [TOKEN_GOLD], [], '0x'),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if data is not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [TOKEN_GOLD], [10], ''),
      ).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.safeBatchTransferFrom('', '', [], [], '')).to.be.rejectedWith(Error)
    })
  })
})
