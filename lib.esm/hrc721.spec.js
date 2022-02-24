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
import { HRC721 } from './hrc721';
import { HarmonyShards } from './interfaces';
import { PrivateKey } from './private-key';
import { HRC721_CONTRACT_ADDRESS, TEST_ADDRESS_1, TEST_ACCOUNT_1, TEST_ACCOUNT_2, TEST_ACCOUNT_3, EMPTY_TEST_ADDRESS, HRC721_TOKEN_GOLD, TEST_ADDRESS_2, TX_OPTIONS, } from './tests/constants';
import { ABI } from './tests/contracts/HR721/abi';
describe('HRC721 Contract Interface', () => {
    use(chaiAsPromised);
    let contract;
    let provider;
    before(() => {
        provider = new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet);
        contract = new HRC721(HRC721_CONTRACT_ADDRESS, ABI, provider);
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        sinon.restore();
    }));
    it('should be defined', () => {
        expect(provider).to.not.be.undefined;
    });
    describe('balanceOf', () => {
        it('should get the number of tokens in the specified account', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOf(TEST_ADDRESS_1, TX_OPTIONS);
            expect(balance).to.not.be.null;
            expect(balance).to.not.be.undefined;
            expect(balance).to.be.an.instanceof(BN);
            expect(balance.gt(new BN(0))).to.be.true;
        }));
        it('should throw an error if address is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOf('')).to.be.rejectedWith(Error);
        }));
    });
    describe('ownerOf', () => {
        it('should return the owner of the tokenId token', () => __awaiter(void 0, void 0, void 0, function* () {
            const owner = yield contract.ownerOf(HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(owner).to.not.be.null;
            expect(owner).to.not.be.undefined;
            expect(owner).to.be.equals(TEST_ADDRESS_1);
        }));
        it('should return the owner of the tokenId token with tokenId as a string', () => __awaiter(void 0, void 0, void 0, function* () {
            const owner = yield contract.ownerOf(HRC721_TOKEN_GOLD.toString(), TX_OPTIONS);
            expect(owner).to.exist;
            expect(owner).to.not.be.null;
            expect(owner).to.not.be.undefined;
            expect(owner).to.be.equals(TEST_ADDRESS_1);
        }));
        it('should return the origin address of the tokenId token if the token has no owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const owner = yield contract.ownerOf(HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(owner).to.not.be.null;
            expect(owner).to.not.be.undefined;
            expect(owner).to.be.equals(TEST_ADDRESS_1);
        }));
        it('should throw an error if tokenId is a non existent token', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.ownerOf('6')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if tokenId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.ownerOf('')).to.be.rejectedWith(Error);
        }));
    });
    describe('transferFrom', () => {
        it('should throw if there is no signer', () => {
            expect(contract.transferFrom(TEST_ADDRESS_1, TEST_ADDRESS_1, HRC721_TOKEN_GOLD)).to.be.rejectedWith(Error);
        });
        it.skip('should transfer the ownership of a token from one address to another', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const owner = yield contract.ownerOf(HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(owner).to.equal(TEST_ADDRESS_1);
            expect(owner).to.not.equal(TEST_ADDRESS_2);
            const result = yield contract.transferFrom(TEST_ADDRESS_1, TEST_ADDRESS_2, HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(result.txStatus).to.eq(TxStatus.CONFIRMED);
            expect((_a = result.receipt) === null || _a === void 0 ? void 0 : _a.blockHash).to.be.string;
            const newOwner = yield contract.ownerOf(HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(newOwner).to.equal(TEST_ADDRESS_2);
            expect(newOwner).to.not.equal(TEST_ADDRESS_1);
            contract.setSignerByPrivateKey(TEST_ACCOUNT_2.privateKey);
            const result2 = yield contract.transferFrom(TEST_ADDRESS_2, TEST_ADDRESS_1, HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(result2.txStatus).to.eq(TxStatus.CONFIRMED);
            expect((_b = result2.receipt) === null || _b === void 0 ? void 0 : _b.blockHash).to.be.string;
            const oldOwner = yield contract.ownerOf(HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(oldOwner).to.equal(TEST_ADDRESS_1);
            expect(oldOwner).to.not.equal(TEST_ADDRESS_2);
        }));
    });
    describe.skip('safeTransferFrom', () => {
        it('should throw if there is no signer', () => {
            expect(contract.safeTransferFrom(TEST_ADDRESS_1, TEST_ADDRESS_1, '1')).to.be.rejectedWith(Error);
        });
        it('should transfer the ownership of a token from one address to another', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const owner = yield contract.ownerOf(HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(owner).to.be.oneOf([TEST_ACCOUNT_2.address, TEST_ACCOUNT_3.address]);
            const ownerAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address === owner);
            const receiverAccount = [TEST_ACCOUNT_2, TEST_ACCOUNT_3].find((account) => account.address !== owner);
            if (!ownerAccount || !receiverAccount)
                throw new Error('Account not found');
            contract.setSignerByPrivateKey(ownerAccount.privateKey);
            const result = yield contract.safeTransferFrom(ownerAccount.address, receiverAccount.address, '5');
            expect(result.txStatus).to.eq(TxStatus.CONFIRMED);
            expect((_a = result.receipt) === null || _a === void 0 ? void 0 : _a.blockHash).to.be.string;
        }));
    });
    describe('getApproved', () => {
        it('should return the account approved for tokenId token', () => __awaiter(void 0, void 0, void 0, function* () {
            const approved = yield contract.getApproved(HRC721_TOKEN_GOLD, TX_OPTIONS);
            expect(approved).to.not.be.null;
            expect(approved).to.not.be.undefined;
            expect(approved).to.be.equals('0x0000000000000000000000000000000000000000');
        }));
        it('should throw an error if tokenId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.getApproved('')).to.be.rejectedWith(Error);
        }));
    });
    describe('isApprovedForAll', () => {
        it('should return a boolean value if the operator is allowed to manage all of the assets of owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const approved = yield contract.isApprovedForAll(TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, TX_OPTIONS);
            expect(approved).to.not.be.null;
            expect(approved).to.not.be.undefined;
            expect(approved).to.be.equals(false);
        }));
        it('should throw an error if addressOwner is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOperator is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
        }));
    });
    describe('setApprovalForAll', () => {
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.setApprovalForAll('', false)).to.be.rejectedWith(Error);
        }));
    });
});
//# sourceMappingURL=hrc721.spec.js.map