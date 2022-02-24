"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = require("@harmony-js/transaction");
const utils_1 = require("@harmony-js/utils");
const bn_js_1 = __importDefault(require("bn.js"));
const chai_1 = require("chai");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const sinon_1 = __importDefault(require("sinon"));
const hrc721_1 = require("./hrc721");
const interfaces_1 = require("./interfaces");
const private_key_1 = require("./private-key");
const constants_1 = require("./tests/constants");
const abi_1 = require("./tests/contracts/HR721/abi");
describe('HRC721 Contract Interface', () => {
    (0, chai_1.use)(chai_as_promised_1.default);
    let contract;
    let provider;
    before(() => {
        provider = new private_key_1.PrivateKey(interfaces_1.HarmonyShards.SHARD_0_TESTNET, constants_1.TEST_ACCOUNT_1.privateKey, utils_1.ChainID.HmyTestnet);
        contract = new hrc721_1.HRC721(constants_1.HRC721_CONTRACT_ADDRESS, abi_1.ABI, provider);
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        sinon_1.default.restore();
    }));
    it('should be defined', () => {
        (0, chai_1.expect)(provider).to.not.be.undefined;
    });
    describe('balanceOf', () => {
        it('should get the number of tokens in the specified account', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOf(constants_1.TEST_ADDRESS_1, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(balance).to.not.be.null;
            (0, chai_1.expect)(balance).to.not.be.undefined;
            (0, chai_1.expect)(balance).to.be.an.instanceof(bn_js_1.default);
            (0, chai_1.expect)(balance.gt(new bn_js_1.default(0))).to.be.true;
        }));
        it('should throw an error if address is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOf('')).to.be.rejectedWith(Error);
        }));
    });
    describe('ownerOf', () => {
        it('should return the owner of the tokenId token', () => __awaiter(void 0, void 0, void 0, function* () {
            const owner = yield contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(owner).to.not.be.null;
            (0, chai_1.expect)(owner).to.not.be.undefined;
            (0, chai_1.expect)(owner).to.be.equals(constants_1.TEST_ADDRESS_1);
        }));
        it('should return the owner of the tokenId token with tokenId as a string', () => __awaiter(void 0, void 0, void 0, function* () {
            const owner = yield contract.ownerOf(constants_1.HRC721_TOKEN_GOLD.toString(), constants_1.TX_OPTIONS);
            (0, chai_1.expect)(owner).to.exist;
            (0, chai_1.expect)(owner).to.not.be.null;
            (0, chai_1.expect)(owner).to.not.be.undefined;
            (0, chai_1.expect)(owner).to.be.equals(constants_1.TEST_ADDRESS_1);
        }));
        it('should return the origin address of the tokenId token if the token has no owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const owner = yield contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(owner).to.not.be.null;
            (0, chai_1.expect)(owner).to.not.be.undefined;
            (0, chai_1.expect)(owner).to.be.equals(constants_1.TEST_ADDRESS_1);
        }));
        it('should throw an error if tokenId is a non existent token', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.ownerOf('6')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if tokenId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.ownerOf('')).to.be.rejectedWith(Error);
        }));
    });
    describe('transferFrom', () => {
        it('should throw if there is no signer', () => {
            (0, chai_1.expect)(contract.transferFrom(constants_1.TEST_ADDRESS_1, constants_1.TEST_ADDRESS_1, constants_1.HRC721_TOKEN_GOLD)).to.be.rejectedWith(Error);
        });
        it.skip('should transfer the ownership of a token from one address to another', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const owner = yield contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(owner).to.equal(constants_1.TEST_ADDRESS_1);
            (0, chai_1.expect)(owner).to.not.equal(constants_1.TEST_ADDRESS_2);
            const result = yield contract.transferFrom(constants_1.TEST_ADDRESS_1, constants_1.TEST_ADDRESS_2, constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(result.txStatus).to.eq(transaction_1.TxStatus.CONFIRMED);
            (0, chai_1.expect)((_a = result.receipt) === null || _a === void 0 ? void 0 : _a.blockHash).to.be.string;
            const newOwner = yield contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(newOwner).to.equal(constants_1.TEST_ADDRESS_2);
            (0, chai_1.expect)(newOwner).to.not.equal(constants_1.TEST_ADDRESS_1);
            contract.setSignerByPrivateKey(constants_1.TEST_ACCOUNT_2.privateKey);
            const result2 = yield contract.transferFrom(constants_1.TEST_ADDRESS_2, constants_1.TEST_ADDRESS_1, constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(result2.txStatus).to.eq(transaction_1.TxStatus.CONFIRMED);
            (0, chai_1.expect)((_b = result2.receipt) === null || _b === void 0 ? void 0 : _b.blockHash).to.be.string;
            const oldOwner = yield contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(oldOwner).to.equal(constants_1.TEST_ADDRESS_1);
            (0, chai_1.expect)(oldOwner).to.not.equal(constants_1.TEST_ADDRESS_2);
        }));
    });
    describe.skip('safeTransferFrom', () => {
        it('should throw if there is no signer', () => {
            (0, chai_1.expect)(contract.safeTransferFrom(constants_1.TEST_ADDRESS_1, constants_1.TEST_ADDRESS_1, '1')).to.be.rejectedWith(Error);
        });
        it('should transfer the ownership of a token from one address to another', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const owner = yield contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(owner).to.be.oneOf([constants_1.TEST_ACCOUNT_2.address, constants_1.TEST_ACCOUNT_3.address]);
            const ownerAccount = [constants_1.TEST_ACCOUNT_2, constants_1.TEST_ACCOUNT_3].find((account) => account.address === owner);
            const receiverAccount = [constants_1.TEST_ACCOUNT_2, constants_1.TEST_ACCOUNT_3].find((account) => account.address !== owner);
            if (!ownerAccount || !receiverAccount)
                throw new Error('Account not found');
            contract.setSignerByPrivateKey(ownerAccount.privateKey);
            const result = yield contract.safeTransferFrom(ownerAccount.address, receiverAccount.address, '5');
            (0, chai_1.expect)(result.txStatus).to.eq(transaction_1.TxStatus.CONFIRMED);
            (0, chai_1.expect)((_a = result.receipt) === null || _a === void 0 ? void 0 : _a.blockHash).to.be.string;
        }));
    });
    describe('getApproved', () => {
        it('should return the account approved for tokenId token', () => __awaiter(void 0, void 0, void 0, function* () {
            const approved = yield contract.getApproved(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(approved).to.not.be.null;
            (0, chai_1.expect)(approved).to.not.be.undefined;
            (0, chai_1.expect)(approved).to.be.equals('0x0000000000000000000000000000000000000000');
        }));
        it('should throw an error if tokenId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.getApproved('')).to.be.rejectedWith(Error);
        }));
    });
    describe('isApprovedForAll', () => {
        it('should return a boolean value if the operator is allowed to manage all of the assets of owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const approved = yield contract.isApprovedForAll(constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS, constants_1.TX_OPTIONS);
            (0, chai_1.expect)(approved).to.not.be.null;
            (0, chai_1.expect)(approved).to.not.be.undefined;
            (0, chai_1.expect)(approved).to.be.equals(false);
        }));
        it('should throw an error if addressOwner is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll('', constants_1.EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOperator is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll(constants_1.TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
        }));
    });
    describe('setApprovalForAll', () => {
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.setApprovalForAll('', false)).to.be.rejectedWith(Error);
        }));
    });
});
//# sourceMappingURL=hrc721.spec.js.map