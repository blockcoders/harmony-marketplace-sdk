import { Account, Wallet } from '@harmony-js/account';
import { Contract as BaseContract } from '@harmony-js/contract';
import { AbiItemModel } from '@harmony-js/contract/dist/models/types';
import { ContractOptions } from '@harmony-js/contract/dist/utils/options';
import { Transaction } from '@harmony-js/transaction';
import BN from 'bn.js';
import { BNish, ContractProviderType, ITransactionOptions } from './interfaces';
import { Key } from './key';
import { MnemonicKey } from './mnemonic-key';
import { PrivateKey } from './private-key';
declare class Contract extends BaseContract {
    readonly wallet: Wallet;
    constructor(abi: AbiItemModel[], address: string, provider: ContractProviderType, options?: ContractOptions);
}
export declare class ContractError extends Error {
    readonly type: string;
    constructor(message: string, type: string);
}
export declare abstract class BaseToken {
    private readonly _contract;
    constructor(address: string, abi: AbiItemModel[], provider: ContractProviderType, options?: ContractOptions);
    get contract(): Contract;
    get address(): string;
    protected estimateGas(method: string, args?: any[], options?: ITransactionOptions): Promise<ITransactionOptions>;
    protected call<T>(method: string, args?: any[], txOptions?: ITransactionOptions): Promise<T>;
    protected send(method: string, args?: any[], txOptions?: ITransactionOptions): Promise<Transaction>;
    protected getBalance(address: string, id?: BNish, txOptions?: ITransactionOptions): Promise<BN>;
    protected sanitizeAddress(address: string): string;
    setApprovalForAll(addressOperator: string, approved: boolean, txOptions?: ITransactionOptions): Promise<Transaction>;
    isApprovedForAll(owner: string, operator: string, txOptions?: ITransactionOptions): Promise<boolean>;
    setSignerByPrivateKey(privateKey: string): Account;
    setSignerByMnemonic(mnemonic: string, index?: number): Account;
    setSignerByKey(key: Key | PrivateKey | MnemonicKey): void;
}
export {};
//# sourceMappingURL=base-token.d.ts.map