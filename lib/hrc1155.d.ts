import { AbiItemModel } from '@harmony-js/contract/dist/models/types';
import { ContractOptions } from '@harmony-js/contract/dist/utils/options';
import { Transaction } from '@harmony-js/transaction';
import BN from 'bn.js';
import { BaseToken } from './base-token';
import { BNish, ContractProviderType, ITransactionOptions } from './interfaces';
export declare class HRC1155 extends BaseToken {
    constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions);
    balanceOf(address: string, id: BNish, txOptions?: ITransactionOptions): Promise<BN>;
    balanceOfBatch(accounts: string[], ids: BNish[], txOptions?: ITransactionOptions): Promise<BN[]>;
    safeTransferFrom(from: string, to: string, id: BNish, amount: BNish, data: any, txOptions?: ITransactionOptions): Promise<Transaction>;
    safeBatchTransferFrom(from: string, to: string, ids: BNish[], amounts: BNish[], data: any, txOptions?: ITransactionOptions): Promise<Transaction>;
}
//# sourceMappingURL=hrc1155.d.ts.map