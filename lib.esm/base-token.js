var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Contract as BaseContract } from '@harmony-js/contract';
import { hexToNumber, Unit } from '@harmony-js/utils';
import { AddressZero, DEFAULT_GAS_PRICE } from './constants';
import { isBNish } from './utils';
class Contract extends BaseContract {
    constructor(abi, address, provider, options) {
        super(abi, address, options, provider);
        this.wallet = provider;
    }
}
export class ContractError extends Error {
    constructor(message, type) {
        super(message);
        this.name = ContractError.name;
        this.type = type;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BaseToken {
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
        gasPrice: DEFAULT_GAS_PRICE,
    }) {
        return __awaiter(this, void 0, void 0, function* () {
            let gasLimit = options.gasLimit;
            if (!gasLimit) {
                const hexValue = yield this._contract.methods[method](...args).estimateGas({
                    gasPrice: new Unit(options.gasPrice).asGwei().toHex(),
                });
                gasLimit = hexToNumber(hexValue);
            }
            return { gasPrice: new Unit(options.gasPrice).asGwei().toWeiString(), gasLimit };
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
            if (!address || address === AddressZero) {
                throw new ContractError('Invalid address provided', '_getBalance');
            }
            const args = [address];
            if (isBNish(id)) {
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
            if (!owner || owner === AddressZero) {
                throw new ContractError('Invalid owner provided', 'isApprovedForAll');
            }
            if (!operator || operator === AddressZero) {
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
//# sourceMappingURL=base-token.js.map