var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseToken, ContractError } from './base-token';
import { AddressZero } from './constants';
export class HRC1155 extends BaseToken {
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
                throw new ContractError('Accounts and ids must have the same length', 'balanceOfBatch');
            }
            return this.call('balanceOfBatch', [accounts, ids], txOptions);
        });
    }
    safeTransferFrom(from, to, id, amount, data, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (to === AddressZero) {
                throw new ContractError(`The to cannot be the ${AddressZero}`, 'safeTransferFrom');
            }
            return this.send('safeTransferFrom', [from, to, id, amount, data], txOptions);
        });
    }
    safeBatchTransferFrom(from, to, ids, amounts, data, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amounts.length !== ids.length) {
                throw new ContractError('amounts and ids must have the same length', 'safeBatchTransferFrom');
            }
            return this.send('safeBatchTransferFrom', [from, to, ids, amounts, data], txOptions);
        });
    }
}
//# sourceMappingURL=hrc1155.js.map