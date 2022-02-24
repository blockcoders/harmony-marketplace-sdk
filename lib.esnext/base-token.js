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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseToken = exports.ContractError = void 0;
const contract_1 = require("@harmony-js/contract");
const utils_1 = require("@harmony-js/utils");
const constants_1 = require("./constants");
const utils_2 = require("./utils");
class Contract extends contract_1.Contract {
    constructor(abi, address, provider, options) {
        super(abi, address, options, provider);
        this.wallet = provider;
    }
}
class ContractError extends Error {
    constructor(message, type) {
        super(message);
        this.name = ContractError.name;
        this.type = type;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ContractError = ContractError;
class BaseToken {
    constructor(address, abi, provider, options) {
        this._contract = new Contract(abi, address, provider, options);
    }
    get contract() {
        return this._contract;
    }
    get address() {
        return this._contract.address;
    }
    estimateGas(method, args = [], options = {
        gasPrice: constants_1.DEFAULT_GAS_PRICE,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            let gasLimit = options.gasLimit;
            if (!gasLimit) {
                const hexValue = yield this._contract.methods[method](...args).estimateGas({
                    gasPrice: new utils_1.Unit(options.gasPrice).asGwei().toHex(),
                });
                gasLimit = (0, utils_1.hexToNumber)(hexValue);
            }
            return { gasPrice: new utils_1.Unit(options.gasPrice).asGwei().toWeiString(), gasLimit };
        });
    }
    call(method, args = [], txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.estimateGas(method, args, txOptions);
            const result = yield this._contract.methods[method](...args).call(options);
            return result;
        });
    }
    send(method, args = [], txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.estimateGas(method, args, txOptions);
            const response = yield this._contract.methods[method](...args).send(options);
            if (!response.transaction) {
                throw new ContractError('Invalid transaction response', method);
            }
            return response.transaction;
        });
    }
    getBalance(address, id, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!address || address === constants_1.AddressZero) {
                throw new ContractError('Invalid address provided', '_getBalance');
            }
            const args = [address];
            if ((0, utils_2.isBNish)(id)) {
                args.push(id);
            }
            return this.call('balanceOf', args, txOptions);
        });
    }
    sanitizeAddress(address) {
        return address.toLowerCase();
    }
    setApprovalForAll(addressOperator, approved, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!addressOperator) {
                throw new Error('You must provide an addressOperator');
            }
            return this.send('setApprovalForAll', [addressOperator, approved], txOptions);
        });
    }
    isApprovedForAll(owner, operator, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!owner || owner === constants_1.AddressZero) {
                throw new ContractError('Invalid owner provided', 'isApprovedForAll');
            }
            if (!operator || operator === constants_1.AddressZero) {
                throw new ContractError('Invalid operator provided', 'isApprovedForAll');
            }
            return this.call('isApprovedForAll', [owner, operator], txOptions);
        });
    }
    setSignerByPrivateKey(privateKey) {
        const account = this._contract.wallet.addByPrivateKey(privateKey);
        if (account.address) {
            this._contract.wallet.setSigner(account.address);
        }
        return account;
    }
    setSignerByMnemonic(mnemonic, index = 0) {
        const account = this._contract.wallet.addByMnemonic(mnemonic, index);
        if (account.address) {
            this._contract.wallet.setSigner(account.address);
        }
        return account;
    }
    setSignerByKey(key) {
        this._contract.connect(key);
    }
}
exports.BaseToken = BaseToken;
//# sourceMappingURL=base-token.js.map