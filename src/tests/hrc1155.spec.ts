import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import { AddressZero } from '../constants'
import { HRC1155 } from '../tokens/hrc1155'
import {
  HRC1155_CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  EMPTY_TEST_ADDRESS,
  TEST_ADDRESS_2,
  TOKEN_GOLD,
  TOKEN_SILVER,
  TX_OPTIONS,
  FAKE_BALANCE_HRC1155,
  WALLET_PROVIDER_TEST_1,
} from './constants'
import { ABI } from './contracts/HRC1155/abi'

describe('HRC1155 Contract Interface', () => {
  use(chaiAsPromised)

  let contract: HRC1155

  before(() => {
    contract = new HRC1155(HRC1155_CONTRACT_ADDRESS, ABI, WALLET_PROVIDER_TEST_1)
  })

  afterEach(async () => {
    sinon.restore()
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('balanceOf', () => {
    it('should get the number of tokens in the specified account with id as a number', async () => {
      const stub = sinon.stub(contract, 'call').withArgs('balanceOf', [TEST_ADDRESS_1, TOKEN_GOLD], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOf(TEST_ADDRESS_1, TOKEN_GOLD, TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should get the number of tokens in the specified account with id as a string', async () => {
      const stub = sinon
        .stub(contract, 'call')
        .withArgs('balanceOf', [TEST_ADDRESS_1, TOKEN_GOLD.toString()], TX_OPTIONS)
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOf(TEST_ADDRESS_1, TOKEN_GOLD.toString(), TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if address is not provided', async () => {
      expect(contract.balanceOf('', TOKEN_GOLD, TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if id is not provided', async () => {
      expect(contract.balanceOf(TEST_ADDRESS_1, '', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.balanceOf('', '')).to.be.rejectedWith(Error)
    })
  })

  describe('balanceOfBatch', () => {
    it('should return multiple balances in the specified account with id as a number', async () => {
      const stub = sinon.stub(contract, 'call').withArgs(
        'balanceOfBatch',
        [
          [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
          [TOKEN_GOLD, TOKEN_SILVER],
        ],
        TX_OPTIONS,
      )
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOfBatch(
        [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
        [TOKEN_GOLD, TOKEN_SILVER],
        TX_OPTIONS,
      )

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should return multiple balances in the specified account with id as a string', async () => {
      const stub = sinon.stub(contract, 'call').withArgs(
        'balanceOfBatch',
        [
          [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
          [TOKEN_GOLD.toString(), TOKEN_SILVER.toString()],
        ],
        TX_OPTIONS,
      )
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOfBatch(
        [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
        [TOKEN_GOLD.toString(), TOKEN_SILVER.toString()],
        TX_OPTIONS,
      )

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should return multiple balances in the specified account with id as a byte', async () => {
      const stub = sinon.stub(contract, 'call').withArgs(
        'balanceOfBatch',
        [
          [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
          ['00000001', '00000010'],
        ],
        TX_OPTIONS,
      )
      stub.resolves().returns(Promise.resolve(FAKE_BALANCE_HRC1155))

      const balance = await contract.balanceOfBatch(
        [TEST_ADDRESS_1, EMPTY_TEST_ADDRESS],
        ['00000001', '00000010'],
        TX_OPTIONS,
      )

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
      expect(balance).to.be.equals(await stub.returnValues[0])
    })

    it('should throw an error if ids is not provided', async () => {
      const stub = sinon.stub(contract, 'call')
      stub
        .withArgs('balanceOfBatch', [[], [1, 2]])
        .onFirstCall()
        .rejects()

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
    it('should transfer amount tokens of the specified id from one address to another', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs('safeTransferFrom', [TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, 10, '0x'], TX_OPTIONS)
      stub.resolves()

      await contract.safeTransferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, 10, '0x', TX_OPTIONS)

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should thow an error if sender address is not provided', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs('safeTransferFrom', ['', TEST_ADDRESS_1, TOKEN_GOLD, 10, '0x'], TX_OPTIONS)
      stub.rejects()

      expect(contract.safeTransferFrom('', TEST_ADDRESS_1, 1, 10, '0x', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should thow an error if receiver address is not provided', async () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_2, '', TOKEN_GOLD, 10, '0x', TX_OPTIONS)).to.be.rejectedWith(Error)
    })

    it('should thow an error if to address is zero-address', async () => {
      expect(
        contract.safeTransferFrom(TEST_ADDRESS_2, AddressZero, TOKEN_GOLD, 10, '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if token id is not provided', async () => {
      expect(contract.safeTransferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, '', 10, '0x')).to.be.rejectedWith(Error)
    })

    it('should thow an error if amount is not provided', async () => {
      expect(
        contract.safeTransferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, 0, '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if data is not provided', async () => {
      expect(
        contract.safeTransferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, TOKEN_GOLD, 10, '', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.safeTransferFrom('', '', 0, 0, '')).to.be.rejectedWith(Error)
    })
  })

  describe('safeBatchTransferFrom', async () => {
    it('should transfer amount tokens of the specified id from one address to another', async () => {
      const stub = sinon
        .stub(contract, 'send')
        .withArgs(
          'safeBatchTransferFrom',
          [TEST_ADDRESS_1, TEST_ADDRESS_2, [TOKEN_GOLD, TOKEN_SILVER], [10, 20], '0x'],
          TX_OPTIONS,
        )
      stub.resolves()

      await contract.safeBatchTransferFrom(
        TEST_ADDRESS_1,
        TEST_ADDRESS_2,
        [TOKEN_GOLD, TOKEN_SILVER],
        [10, 20],
        '0x',
        TX_OPTIONS,
      )

      expect(stub.calledOnce).to.be.true
      expect(stub.callCount).to.be.equals(1)
    })

    it('should thow an error if sender address is not provided', async () => {
      expect(
        contract.safeBatchTransferFrom('', TEST_ADDRESS_1, [TOKEN_GOLD], [10], '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if receiver address is not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, '', [TOKEN_GOLD], [10], '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if token ids are not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [], [10], '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if amounts are not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [TOKEN_GOLD], [], '0x', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should thow an error if data is not provided', async () => {
      expect(
        contract.safeBatchTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, [TOKEN_GOLD], [10], '', TX_OPTIONS),
      ).to.be.rejectedWith(Error)
    })

    it('should throw an error if params are not provided', async () => {
      expect(contract.safeBatchTransferFrom('', '', [], [], '')).to.be.rejectedWith(Error)
    })
  })
})
