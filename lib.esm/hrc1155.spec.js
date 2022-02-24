var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TxStatus } from '@harmony-js/transaction';
import { ChainID } from '@harmony-js/utils';
import BN from 'bn.js';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { HRC1155 } from './hrc1155';
import { HarmonyShards } from './interfaces';
import { PrivateKey } from './private-key';
import { HRC1155_CONTRACT_ADDRESS, TEST_ADDRESS_1, TEST_ACCOUNT_1, EMPTY_TEST_ADDRESS, TEST_ADDRESS_2, HRC721_TOKEN_GOLD, TX_OPTIONS, } from './tests/constants';
import { ABI } from './tests/contracts/HR1155/abi';
describe('HRC1155 Contract Interface', () => {
    use(chaiAsPromised);
    let contract;
    let provider;
    before(() => {
        provider = new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet);
        contract = new HRC1155(HRC1155_CONTRACT_ADDRESS, ABI, provider);
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        sinon.restore();
    }));
    it('should be defined', () => {
        expect(contract).to.not.be.undefined;
    });
    describe('balanceOf', () => {
        it('should get the number of tokens in the specified account with id as a number', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOf(TEST_ADDRESS_1, HRC721_TOKEN_GOLD);
            expect(balance).to.not.be.null;
            expect(balance).to.not.be.undefined;
            expect(balance).to.be.an.instanceof(BN);
            expect(balance.gt(new BN(0))).to.be.true;
        }));
        it('should get the number of tokens in the specified account with id as a string', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOf(TEST_ADDRESS_1, HRC721_TOKEN_GOLD.toString());
            expect(balance).to.not.be.null;
            expect(balance).to.not.be.undefined;
            expect(balance).to.be.an.instanceof(BN);
            expect(balance.gt(new BN(0))).to.be.true;
        }));
        it('should throw an error if address is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOf('', 1)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOf(TEST_ADDRESS_1, 0)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOf('', 0)).to.be.rejectedWith(Error);
        }));
    });
    describe('balanceOfBatch', () => {
        it('should return multiple balances in the specified account with id as a number', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], [1, 2]);
            expect(balance).to.exist;
            expect(balance).to.not.be.null;
            expect(balance).to.not.be.undefined;
            expect(balance).length(2);
        }));
        it('should return multiple balances in the specified account with id as a string', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], ['1', '2']);
            expect(balance).to.exist;
            expect(balance).to.not.be.null;
            expect(balance).to.not.be.undefined;
            expect(balance).length(2);
        }));
        it('should return multiple balances in the specified account with id as a byte', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], ['00000001', '00000010']);
            expect(balance).to.exist;
            expect(balance).to.not.be.null;
            expect(balance).to.not.be.undefined;
            expect(balance).length(2);
        }));
        it('should throw an error if ids is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOfBatch([], [1, 2])).to.be.rejectedWith(Error);
        }));
        it('should throw an error if accounts is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOfBatch([TEST_ADDRESS_1, EMPTY_TEST_ADDRESS], [])).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOfBatch([], [])).to.be.rejectedWith(Error);
        }));
    });
    describe('safeTransferFrom', () => __awaiter(void 0, void 0, void 0, function* () {
        it('should transfer amount tokens of the specified id from one address to another', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const balance = yield contract.balanceOf(TEST_ADDRESS_2, HRC721_TOKEN_GOLD.toString());
            expect(balance).to.not.be.null;
            expect(balance).to.not.be.undefined;
            expect(balance).to.be.an.instanceof(BN);
            const result = yield contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, HRC721_TOKEN_GOLD, 1, '0x', TX_OPTIONS);
            expect(result.txStatus).to.eq(TxStatus.CONFIRMED);
            expect((_a = result.receipt) === null || _a === void 0 ? void 0 : _a.blockHash).to.be.string;
            const newBalance = yield contract.balanceOf(TEST_ADDRESS_2, HRC721_TOKEN_GOLD.toString());
            expect(balance).to.not.be.null;
            expect(balance).to.not.be.undefined;
            expect(balance).to.be.an.instanceof(BN);
            expect(newBalance.gt(balance)).to.be.true;
        }));
        it('should thow an error if sender address is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.safeTransferFrom('', TEST_ADDRESS_1, 1, 10, '0x')).to.be.rejectedWith(Error);
        }));
        it('should thow an error if receiver address is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.safeTransferFrom(TEST_ADDRESS_1, '', 1, 10, '0x')).to.be.rejectedWith(Error);
        }));
        it('should thow an error if token id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.safeTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, '', 10, '0x')).to.be.rejectedWith(Error);
        }));
        it('should thow an error if amount is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.safeTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, 1, '', '0x')).to.be.rejectedWith(Error);
        }));
        it('should thow an error if data is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.safeTransferFrom(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, 1, 10, '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.safeTransferFrom('', '', 0, 0, '')).to.be.rejectedWith(Error);
        }));
    }));
});
//# sourceMappingURL=hrc1155.spec.js.map