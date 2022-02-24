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
exports.HRC1155 = void 0;
const base_token_1 = require("./base-token");
const constants_1 = require("./constants");
class HRC1155 extends base_token_1.BaseToken {
    constructor(address, abi, provider, options) {
        super(address, abi, provider, options);
    }
    balanceOf(address, id, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getBalance(address, id, txOptions);
        });
    }
    balanceOfBatch(accounts, ids, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (accounts.length !== ids.length) {
                throw new base_token_1.ContractError('Accounts and ids must have the same length', 'balanceOfBatch');
            }
            return this.call('balanceOfBatch', [accounts, ids], txOptions);
        });
    }
    safeTransferFrom(from, to, id, amount, data, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (to === constants_1.AddressZero) {
                throw new base_token_1.ContractError(`The to cannot be the ${constants_1.AddressZero}`, 'safeTransferFrom');
            }
            return this.send('safeTransferFrom', [from, to, id, amount, data], txOptions);
        });
    }
    safeBatchTransferFrom(from, to, ids, amounts, data, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amounts.length !== ids.length) {
                throw new base_token_1.ContractError('amounts and ids must have the same length', 'safeBatchTransferFrom');
            }
            return this.send('safeBatchTransferFrom', [from, to, ids, amounts, data], txOptions);
        });
    }
}
exports.HRC1155 = HRC1155;
//# sourceMappingURL=hrc1155.js.map