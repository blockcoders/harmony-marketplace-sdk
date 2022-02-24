var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChainID } from '@harmony-js/utils';
import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { BaseToken } from './base-token';
import { AddressZero } from './constants';
import { HarmonyShards } from './interfaces';
import { PrivateKey } from './private-key';
import { TEST_ADDRESS_1, EMPTY_TEST_ADDRESS, TEST_ACCOUNT_2, TEST_ACCOUNT_1 } from './tests/constants';
import { ABI } from './tests/contracts/HR721/abi';
class TestToken extends BaseToken {
    constructor() {
        super('0x', ABI, new PrivateKey(HarmonyShards.SHARD_0_TESTNET, TEST_ACCOUNT_1.privateKey, ChainID.HmyTestnet));
    }
    balanceOf(address, id, txOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getBalance(address, id, txOptions);
        });
    }
}
describe('Base Token Provider', () => {
    let contract;
    use(chaiAsPromised);
    before(() => {
        contract = new TestToken();
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        sinon.restore();
    }));
    it('should be defined', () => {
        expect(contract).to.not.be.undefined;
    });
    describe('balanceOf', () => {
        it('should throw an error if address is not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOf('', 1)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if address is not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOf('')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if provided address is zero-address in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOf(AddressZero, 1)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if provided address is zero-address in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.balanceOf(AddressZero)).to.be.rejectedWith(Error);
        }));
    });
    describe('setApprovalForAll', () => {
        it('should throw an error if addressOperator is not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOperator is not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.setApprovalForAll('', true)).to.be.rejectedWith(Error);
        }));
    });
    describe('isApprovedForAll', () => {
        it('should throw an error if addressOwner is not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOwner is not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll('', EMPTY_TEST_ADDRESS)).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOperator is not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if addressOperator is not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll(TEST_ADDRESS_1, '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided in HRC1155', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
            expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if params are not provided in HRC721', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(contract.isApprovedForAll('', '')).to.be.rejectedWith(Error);
        }));
    });
    describe('setSignerByPrivateKey', () => {
        it('should throw an error if privateKey is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey');
            stub.withArgs('').onCall(0).rejects();
            expect(contract.setSignerByPrivateKey('')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if privateKey is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey');
            stub.withArgs('This is a test').onCall(0).rejects();
            expect(contract.setSignerByPrivateKey('This is a test')).to.be.rejectedWith(Error);
        }));
        it('should throw an error if type is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon.stub(BaseToken.prototype, 'setSignerByPrivateKey');
            stub.withArgs(TEST_ACCOUNT_2.privateKey).onCall(0).rejects();
            expect(contract.setSignerByPrivateKey(TEST_ACCOUNT_2.privateKey)).to.be.rejectedWith(Error);
        }));
    });
});
//# sourceMappingURL=base-token.spec.js.map