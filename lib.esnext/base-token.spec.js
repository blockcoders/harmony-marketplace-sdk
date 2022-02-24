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
const utils_1 = require("@harmony-js/utils");
const chai_1 = require("chai");
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const sinon_1 = __importDefault(require("sinon"));
const base_token_1 = require("./base-token");
const constants_1 = require("./constants");
const interfaces_1 = require("./interfaces");
const private_key_1 = require("./private-key");
const constants_2 = require("./tests/constants");
const abi_1 = require("./tests/contracts/HR721/abi");
class TestToken extends base_token_1.BaseToken {
    constructor() {
        super('0x', abi_1.ABI, new private_key_1.PrivateKey(interfaces_1.HarmonyShards.SHARD_0_TESTNET, constants_2.TEST_ACCOUNT_1.privateKey, utils_1.ChainID.HmyTestnet));
    }
    balanceOf(address, id, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getBalance(address, id, txOptions);
        });
    }
}
describe('Base Token Provider', () => {
    let contract;
    (0, chai_1.use)(chai_as_promised_1.default);
    before(() => {
        contract = new TestToken();
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        sinon_1.default.restore();
    }));
    it('should be defined', () => {
        (0, chai_1.expect)(contract).to.not.be.undefined;
    });
    describe('balanceOf', () => {
        it('should throw an error if address is not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOf('', 1)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if address is not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOf('')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if provided address is zero-address in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOf(constants_1.AddressZero, 1)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if provided address is zero-address in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.balanceOf(constants_1.AddressZero)).to.be.rejectedWith(Error);
        }));
    });
    describe('setApprovalForAll', () => {
        it('should throw an error if addressOperator is not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOperator is not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error);
        }));
    });
    describe('isApprovedForAll', () => {
        it('should throw an error if addressOwner is not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll('', constants_2.EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOwner is not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll('', constants_2.EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOperator is not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll(constants_2.TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOperator is not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll(constants_2.TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
            (0, chai_1.expect)(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
        }));
    });
    describe('setSignerByPrivateKey', () => {
        it('should throw an error if privateKey is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub(base_token_1.BaseToken.prototype, 'setSignerByPrivateKey');
            stub.withArgs('').onCall(0).rejects();
            (0, chai_1.expect)(contract.setSignerByPrivateKey('')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if privateKey is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub(base_token_1.BaseToken.prototype, 'setSignerByPrivateKey');
            stub.withArgs('This is a test').onCall(0).rejects();
            (0, chai_1.expect)(contract.setSignerByPrivateKey('This is a test')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if type is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub(base_token_1.BaseToken.prototype, 'setSignerByPrivateKey');
            stub.withArgs(constants_2.TEST_ACCOUNT_2.privateKey).onCall(0).rejects();
            (0, chai_1.expect)(contract.setSignerByPrivateKey(constants_2.TEST_ACCOUNT_2.privateKey)).to.be.rejectedWith(Error);
        }));
    });
});
//# sourceMappingURL=base-token.spec.js.map