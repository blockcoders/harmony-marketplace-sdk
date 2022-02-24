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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var transaction_1 = require("@harmony-js/transaction");
var utils_1 = require("@harmony-js/utils");
var bn_js_1 = __importDefault(require("bn.js"));
var chai_1 = require("chai");
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var sinon_1 = __importDefault(require("sinon"));
var hrc721_1 = require("./hrc721");
var interfaces_1 = require("./interfaces");
var private_key_1 = require("./private-key");
var constants_1 = require("./tests/constants");
var abi_1 = require("./tests/contracts/HR721/abi");
describe('HRC721 Contract Interface', function () {
    (0, chai_1.use)(chai_as_promised_1.default);
    var contract;
    var provider;
    before(function () {
        provider = new private_key_1.PrivateKey(interfaces_1.HarmonyShards.SHARD_0_TESTNET, constants_1.TEST_ACCOUNT_1.privateKey, utils_1.ChainID.HmyTestnet);
        contract = new hrc721_1.HRC721(constants_1.HRC721_CONTRACT_ADDRESS, abi_1.ABI, provider);
    });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            sinon_1.default.restore();
            return [2];
        });
    }); });
    it('should be defined', function () {
        (0, chai_1.expect)(provider).to.not.be.undefined;
    });
    describe('balanceOf', function () {
        it('should get the number of tokens in the specified account', function () { return __awaiter(void 0, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, contract.balanceOf(constants_1.TEST_ADDRESS_1, constants_1.TX_OPTIONS)];
                    case 1:
                        balance = _a.sent();
                        (0, chai_1.expect)(balance).to.not.be.null;
                        (0, chai_1.expect)(balance).to.not.be.undefined;
                        (0, chai_1.expect)(balance).to.be.an.instanceof(bn_js_1.default);
                        (0, chai_1.expect)(balance.gt(new bn_js_1.default(0))).to.be.true;
                        return [2];
                }
            });
        }); });
        it('should throw an error if address is not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.balanceOf('')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
    describe('ownerOf', function () {
        it('should return the owner of the tokenId token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 1:
                        owner = _a.sent();
                        (0, chai_1.expect)(owner).to.not.be.null;
                        (0, chai_1.expect)(owner).to.not.be.undefined;
                        (0, chai_1.expect)(owner).to.be.equals(constants_1.TEST_ADDRESS_1);
                        return [2];
                }
            });
        }); });
        it('should return the owner of the tokenId token with tokenId as a string', function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, contract.ownerOf(constants_1.HRC721_TOKEN_GOLD.toString(), constants_1.TX_OPTIONS)];
                    case 1:
                        owner = _a.sent();
                        (0, chai_1.expect)(owner).to.exist;
                        (0, chai_1.expect)(owner).to.not.be.null;
                        (0, chai_1.expect)(owner).to.not.be.undefined;
                        (0, chai_1.expect)(owner).to.be.equals(constants_1.TEST_ADDRESS_1);
                        return [2];
                }
            });
        }); });
        it('should return the origin address of the tokenId token if the token has no owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 1:
                        owner = _a.sent();
                        (0, chai_1.expect)(owner).to.not.be.null;
                        (0, chai_1.expect)(owner).to.not.be.undefined;
                        (0, chai_1.expect)(owner).to.be.equals(constants_1.TEST_ADDRESS_1);
                        return [2];
                }
            });
        }); });
        it('should throw an error if tokenId is a non existent token', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.ownerOf('6')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if tokenId is not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.ownerOf('')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
    describe('transferFrom', function () {
        it('should throw if there is no signer', function () {
            (0, chai_1.expect)(contract.transferFrom(constants_1.TEST_ADDRESS_1, constants_1.TEST_ADDRESS_1, constants_1.HRC721_TOKEN_GOLD)).to.be.rejectedWith(Error);
        });
        it.skip('should transfer the ownership of a token from one address to another', function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner, result, newOwner, result2, oldOwner;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4, contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 1:
                        owner = _c.sent();
                        (0, chai_1.expect)(owner).to.equal(constants_1.TEST_ADDRESS_1);
                        (0, chai_1.expect)(owner).to.not.equal(constants_1.TEST_ADDRESS_2);
                        return [4, contract.transferFrom(constants_1.TEST_ADDRESS_1, constants_1.TEST_ADDRESS_2, constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 2:
                        result = _c.sent();
                        (0, chai_1.expect)(result.txStatus).to.eq(transaction_1.TxStatus.CONFIRMED);
                        (0, chai_1.expect)((_a = result.receipt) === null || _a === void 0 ? void 0 : _a.blockHash).to.be.string;
                        return [4, contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 3:
                        newOwner = _c.sent();
                        (0, chai_1.expect)(newOwner).to.equal(constants_1.TEST_ADDRESS_2);
                        (0, chai_1.expect)(newOwner).to.not.equal(constants_1.TEST_ADDRESS_1);
                        contract.setSignerByPrivateKey(constants_1.TEST_ACCOUNT_2.privateKey);
                        return [4, contract.transferFrom(constants_1.TEST_ADDRESS_2, constants_1.TEST_ADDRESS_1, constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 4:
                        result2 = _c.sent();
                        (0, chai_1.expect)(result2.txStatus).to.eq(transaction_1.TxStatus.CONFIRMED);
                        (0, chai_1.expect)((_b = result2.receipt) === null || _b === void 0 ? void 0 : _b.blockHash).to.be.string;
                        return [4, contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 5:
                        oldOwner = _c.sent();
                        (0, chai_1.expect)(oldOwner).to.equal(constants_1.TEST_ADDRESS_1);
                        (0, chai_1.expect)(oldOwner).to.not.equal(constants_1.TEST_ADDRESS_2);
                        return [2];
                }
            });
        }); });
    });
    describe.skip('safeTransferFrom', function () {
        it('should throw if there is no signer', function () {
            (0, chai_1.expect)(contract.safeTransferFrom(constants_1.TEST_ADDRESS_1, constants_1.TEST_ADDRESS_1, '1')).to.be.rejectedWith(Error);
        });
        it('should transfer the ownership of a token from one address to another', function () { return __awaiter(void 0, void 0, void 0, function () {
            var owner, ownerAccount, receiverAccount, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, contract.ownerOf(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 1:
                        owner = _b.sent();
                        (0, chai_1.expect)(owner).to.be.oneOf([constants_1.TEST_ACCOUNT_2.address, constants_1.TEST_ACCOUNT_3.address]);
                        ownerAccount = [constants_1.TEST_ACCOUNT_2, constants_1.TEST_ACCOUNT_3].find(function (account) { return account.address === owner; });
                        receiverAccount = [constants_1.TEST_ACCOUNT_2, constants_1.TEST_ACCOUNT_3].find(function (account) { return account.address !== owner; });
                        if (!ownerAccount || !receiverAccount)
                            throw new Error('Account not found');
                        contract.setSignerByPrivateKey(ownerAccount.privateKey);
                        return [4, contract.safeTransferFrom(ownerAccount.address, receiverAccount.address, '5')];
                    case 2:
                        result = _b.sent();
                        (0, chai_1.expect)(result.txStatus).to.eq(transaction_1.TxStatus.CONFIRMED);
                        (0, chai_1.expect)((_a = result.receipt) === null || _a === void 0 ? void 0 : _a.blockHash).to.be.string;
                        return [2];
                }
            });
        }); });
    });
    describe('getApproved', function () {
        it('should return the account approved for tokenId token', function () { return __awaiter(void 0, void 0, void 0, function () {
            var approved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, contract.getApproved(constants_1.HRC721_TOKEN_GOLD, constants_1.TX_OPTIONS)];
                    case 1:
                        approved = _a.sent();
                        (0, chai_1.expect)(approved).to.not.be.null;
                        (0, chai_1.expect)(approved).to.not.be.undefined;
                        (0, chai_1.expect)(approved).to.be.equals('0x0000000000000000000000000000000000000000');
                        return [2];
                }
            });
        }); });
        it('should throw an error if tokenId is not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.getApproved('')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
    describe('isApprovedForAll', function () {
        it('should return a boolean value if the operator is allowed to manage all of the assets of owner', function () { return __awaiter(void 0, void 0, void 0, function () {
            var approved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, contract.isApprovedForAll(constants_1.TEST_ADDRESS_1, constants_1.EMPTY_TEST_ADDRESS, constants_1.TX_OPTIONS)];
                    case 1:
                        approved = _a.sent();
                        (0, chai_1.expect)(approved).to.not.be.null;
                        (0, chai_1.expect)(approved).to.not.be.undefined;
                        (0, chai_1.expect)(approved).to.be.equals(false);
                        return [2];
                }
            });
        }); });
        it('should throw an error if addressOwner is not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll('', constants_1.EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if addressOperator is not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll(constants_1.TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if params are not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
    describe('setApprovalForAll', function () {
        it('should throw an error if params are not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.setApprovalForAll('', false)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
});
//# sourceMappingURL=hrc721.spec.js.map