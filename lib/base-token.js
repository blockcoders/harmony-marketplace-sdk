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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseToken = exports.ContractError = void 0;
var contract_1 = require("@harmony-js/contract");
var utils_1 = require("@harmony-js/utils");
var constants_1 = require("./constants");
var utils_2 = require("./utils");
var Contract = (function (_super) {
    __extends(Contract, _super);
    function Contract(abi, address, provider, options) {
        var _this = _super.call(this, abi, address, options, provider) || this;
        _this.wallet = provider;
        return _this;
    }
    return Contract;
}(contract_1.Contract));
var ContractError = (function (_super) {
    __extends(ContractError, _super);
    function ContractError(message, type) {
        var _this = _super.call(this, message) || this;
        _this.name = ContractError.name;
        _this.type = type;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return ContractError;
}(Error));
exports.ContractError = ContractError;
var BaseToken = (function () {
    function BaseToken(address, abi, provider, options) {
        this._contract = new Contract(abi, address, provider, options);
    }
    Object.defineProperty(BaseToken.prototype, "contract", {
        get: function () {
            return this._contract;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseToken.prototype, "address", {
        get: function () {
            return this._contract.address;
        },
        enumerable: false,
        configurable: true
    });
    BaseToken.prototype.estimateGas = function (method, args, options) {
        if (args === void 0) { args = []; }
        if (options === void 0) { options = {
            gasPrice: constants_1.DEFAULT_GAS_PRICE,
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var gasLimit, hexValue;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        gasLimit = options.gasLimit;
                        if (!!gasLimit) return [3, 2];
                        return [4, (_a = this._contract.methods)[method].apply(_a, args).estimateGas({
                                gasPrice: new utils_1.Unit(options.gasPrice).asGwei().toHex(),
                            })];
                    case 1:
                        hexValue = _b.sent();
                        gasLimit = (0, utils_1.hexToNumber)(hexValue);
                        _b.label = 2;
                    case 2: return [2, { gasPrice: new utils_1.Unit(options.gasPrice).asGwei().toWeiString(), gasLimit: gasLimit }];
                }
            });
        });
    };
    BaseToken.prototype.call = function (method, args, txOptions) {
        if (args === void 0) { args = []; }
        return __awaiter(this, void 0, void 0, function () {
            var options, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.estimateGas(method, args, txOptions)];
                    case 1:
                        options = _b.sent();
                        return [4, (_a = this._contract.methods)[method].apply(_a, args).call(options)];
                    case 2:
                        result = _b.sent();
                        return [2, result];
                }
            });
        });
    };
    BaseToken.prototype.send = function (method, args, txOptions) {
        if (args === void 0) { args = []; }
        return __awaiter(this, void 0, void 0, function () {
            var options, response;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.estimateGas(method, args, txOptions)];
                    case 1:
                        options = _b.sent();
                        return [4, (_a = this._contract.methods)[method].apply(_a, args).send(options)];
                    case 2:
                        response = _b.sent();
                        if (!response.transaction) {
                            throw new ContractError('Invalid transaction response', method);
                        }
                        return [2, response.transaction];
                }
            });
        });
    };
    BaseToken.prototype.getBalance = function (address, id, txOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var args;
            return __generator(this, function (_a) {
                if (!address || address === constants_1.AddressZero) {
                    throw new ContractError('Invalid address provided', '_getBalance');
                }
                args = [address];
                if ((0, utils_2.isBNish)(id)) {
                    args.push(id);
                }
                return [2, this.call('balanceOf', args, txOptions)];
            });
        });
    };
    BaseToken.prototype.sanitizeAddress = function (address) {
        return address.toLowerCase();
    };
    BaseToken.prototype.setApprovalForAll = function (addressOperator, approved, txOptions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!addressOperator) {
                    throw new Error('You must provide an addressOperator');
                }
                return [2, this.send('setApprovalForAll', [addressOperator, approved], txOptions)];
            });
        });
    };
    BaseToken.prototype.isApprovedForAll = function (owner, operator, txOptions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!owner || owner === constants_1.AddressZero) {
                    throw new ContractError('Invalid owner provided', 'isApprovedForAll');
                }
                if (!operator || operator === constants_1.AddressZero) {
                    throw new ContractError('Invalid operator provided', 'isApprovedForAll');
                }
                return [2, this.call('isApprovedForAll', [owner, operator], txOptions)];
            });
        });
    };
    BaseToken.prototype.setSignerByPrivateKey = function (privateKey) {
        var account = this._contract.wallet.addByPrivateKey(privateKey);
        if (account.address) {
            this._contract.wallet.setSigner(account.address);
        }
        return account;
    };
    BaseToken.prototype.setSignerByMnemonic = function (mnemonic, index) {
        if (index === void 0) { index = 0; }
        var account = this._contract.wallet.addByMnemonic(mnemonic, index);
        if (account.address) {
            this._contract.wallet.setSigner(account.address);
        }
        return account;
    };
    BaseToken.prototype.setSignerByKey = function (key) {
        this._contract.connect(key);
    };
    return BaseToken;
}());
exports.BaseToken = BaseToken;
//# sourceMappingURL=base-token.js.map