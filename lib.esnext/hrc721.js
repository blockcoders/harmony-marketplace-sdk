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
exports.HRC721 = void 0;
const base_token_1 = require("./base-token");
const utils_1 = require("./utils");
class HRC721 extends base_token_1.BaseToken {
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
            if (!(0, utils_1.isBNish)(tokenId)) {
                throw new base_token_1.ContractError('You must provide a tokenId', 'ownerOf');
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
            if (!(0, utils_1.isBNish)(tokenId)) {
                throw new base_token_1.ContractError('You must provide a tokenId', 'getApproved');
            }
            const address = yield this.call('getApproved', [tokenId], txOptions);
            return this.sanitizeAddress(address);
        });
    }
}
exports.HRC721 = HRC721;
//# sourceMappingURL=hrc721.js.map