import { AbiItemModel } from '@harmony-js/contract/dist/models/types';
import { ContractOptions } from '@harmony-js/contract/dist/utils/options';
import { Transaction } from '@harmony-js/transaction';
import BN from 'bn.js';
import { BaseToken } from './base-token';
import { BNish, ContractProviderType, ITransactionOptions } from './interfaces';
export declare class HRC721 extends BaseToken {
    constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions);
    balanceOf(address: string, txOptions?: ITransactionOptions): Promise<BN>;
    ownerOf(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string>;
    safeTransferFrom(from: string, to: string, tokenId: BNish, data?: any, txOptions?: ITransactionOptions): Promise<Transaction>;
    transferFrom(from: string, to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction>;
    approve(to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise<Transaction>;
    getApproved(tokenId: BNish, txOptions?: ITransactionOptions): Promise<string>;
}
//# sourceMappingURL=hrc721.d.ts.map