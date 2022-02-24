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
const hrc1155_1 = require("./hrc1155");
const interfaces_1 = require("./interfaces");
const private_key_1 = require("./private-key");
const constants_1 = require("./tests/constants");
const abi_1 = require("./tests/contracts/HR1155/abi");
describe('HRC1155 Contract Interface', () => {
    (0, chai_1.use)(chai_as_promised_1.default);
    let contract;
    let provider;
    before(() => {
        provider = new private_key_1.PrivateKey(interfaces_1.HarmonyShards.SHARD_0_TESTNET, constants_1.TEST_ACCOUNT_1.privateKey, utils_1.ChainID.HmyTestnet);
        contract = new hrc1155_1.HRC1155(constants_1.HRC1155_CONTRACT_ADDRESS, abi_1.ABI, provider);
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        sinon_1.default.restore();
    }));
    it('should be defined', () => {
        (0, chai_1.expect)(contract).to.not.be.undefined;
    });
    describe('balanceOf', () => {
        it('should get the number of tokens in the specified account with id as a number', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOf(constants_1.TEST_ADDRESS_1, constants_1.HRC721_TOKEN_GOLD);
            (0, chai_1.expect)(balance).to.not.be.null;
            (0, chai_1.expect)(balance).to.not.be.undefined;
            (0, chai_1.expect)(balance).to.be.an.instanceof(bn_js_1.default);
            (0, chai_1.expect)(balance.gt(new bn_js_1.default(0))).to.be.true;
        }));
        it('should get the number of tokens in the specified account with id as a string', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOf(constants_1.TEST_ADDRESS_1, constants_1.HRC721_TOKEN_GOLD.toString());
            (0, chai_1.expect)(balance).to.not.be.null;
            (0, chai_1.expect)(balance).to.not.be.undefined;
            (0, chai_1.expect)(balance).to.be.an.instanceof(bn_js_1.default);
            (0, chai_1.expect)(balance.gt(new bn_js_1.default(0))).to.be.true;
        }));
        it('should throw an error if address is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOf('', 1)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOf(constants_1.TEST_ADDRESS_1, 0)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOf('', 0)).to.be.rejectedWith(Error);
        }));
    });
    describe('balanceOfBatch', () => {
        it('should return multiple balances in the specified account with id as a number', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOfBatch([constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS], [1, 2]);
            (0, chai_1.expect)(balance).to.exist;
            (0, chai_1.expect)(balance).to.not.be.null;
            (0, chai_1.expect)(balance).to.not.be.undefined;
            (0, chai_1.expect)(balance).length(2);
        }));
        it('should return multiple balances in the specified account with id as a string', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOfBatch([constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS], ['1', '2']);
            (0, chai_1.expect)(balance).to.exist;
            (0, chai_1.expect)(balance).to.not.be.null;
            (0, chai_1.expect)(balance).to.not.be.undefined;
            (0, chai_1.expect)(balance).length(2);
        }));
        it('should return multiple balances in the specified account with id as a byte', () => __awaiter(void 0, void 0, void 0, function* () {
            const balance = yield contract.balanceOfBatch([constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS], ['00000001', '00000010']);
            (0, chai_1.expect)(balance).to.exist;
            (0, chai_1.expect)(balance).to.not.be.null;
            (0, chai_1.expect)(balance).to.not.be.undefined;
            (0, chai_1.expect)(balance).length(2);
        }));
        it('should throw an error if ids is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOfBatch([], [1, 2])).to.be.rejectedWith(Error);
        }));
        it('should throw an error if accounts is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOfBatch([constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS], [])).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOfBatch([], [])).to.be.rejectedWith(Error);
        }));
    });
    describe('safeTransferFrom', () => __awaiter(void 0, void 0, void 0, function* () {
        it('should transfer amount tokens of the specified id from one address to another', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const balance = yield contract.balanceOf(constants_1.TEST_ADDRESS_2, constants_1.HRC721_TOKEN_GOLD.toString());
            (0, chai_1.expect)(balance).to.not.be.null;
            (0, chai_1.expect)(balance).to.not.be.undefined;
            (0, chai_1.expect)(balance).to.be.an.instanceof(bn_js_1.default);
            const result = yield contract.safeTransferFrom(constants_1.TEST_ADDRESS_1, constants_1.TEST_ADDRESS_2, constants_1.HRC721_TOKEN_GOLD, 1, '0x', constants_1.TX_OPTIONS);
            (0, chai_1.expect)(result.txStatus).to.eq(transaction_1.TxStatus.CONFIRMED);
            (0, chai_1.expect)((_a = result.receipt) === null || _a === void 0 ? void 0 : _a.blockHash).to.be.string;
            const newBalance = yield contract.balanceOf(constants_1.TEST_ADDRESS_2, constants_1.HRC721_TOKEN_GOLD.toString());
            (0, chai_1.expect)(balance).to.not.be.null;
            (0, chai_1.expect)(balance).to.not.be.undefined;
            (0, chai_1.expect)(balance).to.be.an.instanceof(bn_js_1.default);
            (0, chai_1.expect)(newBalance.gt(balance)).to.be.true;
        }));
        it('should thow an error if sender address is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.safeTransferFrom('', constants_1.TEST_ADDRESS_1, 1, 10, '0x')).to.be.rejectedWith(Error);
        }));
        it('should thow an error if receiver address is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.safeTransferFrom(constants_1.TEST_ADDRESS_1, '', 1, 10, '0x')).to.be.rejectedWith(Error);
        }));
        it('should thow an error if token id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.safeTransferFrom(constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS, '', 10, '0x')).to.be.rejectedWith(Error);
        }));
        it('should thow an error if amount is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.safeTransferFrom(constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS, 1, '', '0x')).to.be.rejectedWith(Error);
        }));
        it('should thow an error if data is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.safeTransferFrom(constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS, 1, 10, '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.safeTransferFrom('', '', 0, 0, '')).to.be.rejectedWith(Error);
        }));
    }));
});
//# sourceMappingURL=hrc1155.spec.js.map