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
import { isBNish } from './utils';
export class HRC721 extends BaseToken {
    constructor(address, abi, provider, options) {
        super(address, abi, provider, options);
    }
    balanceOf(address, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getBalance(address, undefined, txOptions);
        });
    }
    ownerOf(tokenId, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isBNish(tokenId)) {
                throw new ContractError('You must provide a tokenId', 'ownerOf');
            }
            const address = yield this.call('ownerOf', [tokenId], txOptions);
            return this.sanitizeAddress(address);
        });
    }
    safeTransferFrom(from, to, tokenId, data, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const args = [from, to, tokenId];
            if (data) {
                args.push(data);
            }
            return this.send('safeTransferFrom', args, txOptions);
        });
    }
    transferFrom(from, to, tokenId, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send('transferFrom', [from, to, tokenId], txOptions);
        });
    }
    approve(to, tokenId, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send('approve', [to, tokenId], txOptions);
        });
    }
    getApproved(tokenId, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!isBNish(tokenId)) {
                throw new ContractError('You must provide a tokenId', 'getApproved');
            }
            const address = yield this.call('getApproved', [tokenId], txOptions);
            return this.sanitizeAddress(address);
        });
    }
}
//# sourceMappingURL=hrc721.js.map