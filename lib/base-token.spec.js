"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var utils_1 = require("@harmony-js/utils");
var chai_1 = require("chai");
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var sinon_1 = __importDefault(require("sinon"));
var base_token_1 = require("./base-token");
var constants_1 = require("./constants");
var interfaces_1 = require("./interfaces");
var private_key_1 = require("./private-key");
var constants_2 = require("./tests/constants");
var abi_1 = require("./tests/contracts/HR721/abi");
var TestToken = (function (_super) {
    __extends(TestToken, _super);
    function TestToken() {
        return _super.call(this, '0x', abi_1.ABI, new private_key_1.PrivateKey(interfaces_1.HarmonyShards.SHARD_0_TESTNET, constants_2.TEST_ACCOUNT_1.privateKey, utils_1.ChainID.HmyTestnet)) || this;
    }
    TestToken.prototype.balanceOf = function (address, id, txOptions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getBalance(address, id, txOptions)];
            });
        });
    };
    return TestToken;
}(base_token_1.BaseToken));
describe('Base Token Provider', function () {
    var contract;
    (0, chai_1.use)(chai_as_promised_1.default);
    before(function () {
        contract = new TestToken();
    });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            sinon_1.default.restore();
            return [2];
        });
    }); });
    it('should be defined', function () {
        (0, chai_1.expect)(contract).to.not.be.undefined;
    });
    describe('balanceOf', function () {
        it('should throw an error if address is not provided in HRC1155', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.balanceOf('', 1)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if address is not provided in HRC721', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.balanceOf('')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if provided address is zero-address in HRC1155', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.balanceOf(constants_1.AddressZero, 1)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if provided address is zero-address in HRC721', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.balanceOf(constants_1.AddressZero)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
    describe('setApprovalForAll', function () {
        it('should throw an error if addressOperator is not provided in HRC1155', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if addressOperator is not provided in HRC721', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
    describe('isApprovedForAll', function () {
        it('should throw an error if addressOwner is not provided in HRC1155', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll('', constants_2.EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if addressOwner is not provided in HRC721', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll('', constants_2.EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if addressOperator is not provided in HRC1155', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll(constants_2.TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if addressOperator is not provided in HRC721', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll(constants_2.TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if params are not provided in HRC1155', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
                (0, chai_1.expect)(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if params are not provided in HRC721', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                (0, chai_1.expect)(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
    describe('setSignerByPrivateKey', function () {
        it('should throw an error if privateKey is not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var stub;
            return __generator(this, function (_a) {
                stub = sinon_1.default.stub(base_token_1.BaseToken.prototype, 'setSignerByPrivateKey');
                stub.withArgs('').onCall(0).rejects();
                (0, chai_1.expect)(contract.setSignerByPrivateKey('')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if privateKey is not valid', function () { return __awaiter(void 0, void 0, void 0, function () {
            var stub;
            return __generator(this, function (_a) {
                stub = sinon_1.default.stub(base_token_1.BaseToken.prototype, 'setSignerByPrivateKey');
                stub.withArgs('This is a test').onCall(0).rejects();
                (0, chai_1.expect)(contract.setSignerByPrivateKey('This is a test')).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
        it('should throw an error if type is not provided', function () { return __awaiter(void 0, void 0, void 0, function () {
            var stub;
            return __generator(this, function (_a) {
                stub = sinon_1.default.stub(base_token_1.BaseToken.prototype, 'setSignerByPrivateKey');
                stub.withArgs(constants_2.TEST_ACCOUNT_2.privateKey).onCall(0).rejects();
                (0, chai_1.expect)(contract.setSignerByPrivateKey(constants_2.TEST_ACCOUNT_2.privateKey)).to.be.rejectedWith(Error);
                return [2];
            });
        }); });
    });
});
//# sourceMappingURL=base-token.spec.js.map