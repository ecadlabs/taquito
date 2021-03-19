import { TransactionOperationParameter } from '@taquito/rpc';
import { Context, ContractAbstraction, ContractProvider, TransactionWalletOperation, Wallet } from '@taquito/taquito';
import { TezosToolkit } from '@taquito/taquito';
import { OriginationOperation } from '@taquito/taquito/dist/types/operations/origination-operation';
import { TransactionOperation } from '@taquito/taquito/dist/types/operations/transaction-operation';
import { OriginateParams } from '@taquito/taquito/dist/types/operations/types';
import { address, mutez, nat, tez } from './type-aliases';

type ContractTypeBase = {
    storage: unknown;
    methods: unknown;
};
type TypedContractOf<T extends ContractTypeBase> = Omit<ContractAbstraction<ContractProvider>, 'storage' | 'methods'> & {
    storage: () => Promise<T['storage']>;
    methods: { [M in keyof T['methods']]:
        T['methods'][M] extends (...args: infer A) => Promise<void>
        ? (...args: A) => TypedContractMethod
        : never
    };
};
type TypedWalletContractOf<T extends ContractTypeBase> = {
    storage: () => Promise<T['storage']>;
    methods: { [M in keyof T['methods']]:
        T['methods'][M] extends (...args: infer A) => Promise<void>
        ? (...args: A) => TypedWalletContractMethod
        : never
    };
};
type TypedContractProviderOf<T extends ContractTypeBase> = Omit<ContractProvider, 'at' | 'originate'> & {
    at: (address: string) => Promise<TypedContractOf<T>>;
    originate(contract: OriginateParams): Promise<Omit<OriginationOperation, 'contract'> & {
        contract: (confirmations?: number, interval?: number, timeout?: number) => Promise<TypedContractOf<T>>;
    }>;
};
type TypedWalletOf<T extends ContractTypeBase> = Omit<Wallet, 'at' | 'originate'> & {
    at: (address: string) => Promise<TypedWalletContractOf<T>>;
    originate(contract: OriginateParams): Promise<Omit<OriginationOperation, 'contract'> & {
        contract: (confirmations?: number, interval?: number, timeout?: number) => Promise<TypedWalletContractOf<T>>;
    }>;
};

type TypedSentParams = ({
    mutez?: false;
    amount: tez;
} | {
    mutez: true;
    amount: mutez;
}) & {
    fee?: mutez;
    gasLimit?: nat;
    source?: address;
    storageLimit?: nat;
};

type TypedTransferParams = TypedSentParams & {
    to: address;
    parameter?: TransactionOperationParameter;
};


type TypedContractMethod = {
    send(params?: Partial<TypedSentParams>): Promise<TransactionOperation>;
    toTransferParams({ fee, gasLimit, storageLimit, source, amount, mutez }?: Partial<TypedSentParams>): TypedTransferParams;
};

type TypedWalletContractMethod = {
    send(params?: Partial<TypedSentParams>): Promise<TransactionWalletOperation>;
    toTransferParams({ fee, gasLimit, storageLimit, source, amount, mutez }?: Partial<TypedSentParams>): TypedTransferParams;
};

export type TezosToolkitTyped<T extends ContractTypeBase> = Omit<TezosToolkit, 'contract' | 'wallet'> & {
    contract: TypedContractProviderOf<T>;
    wallet: TypedWalletOf<T>;
};


// Contract abstraction provider
export type TypedContractAbstractionOf<T extends ContractTypeBase> = ContractAbstraction<ContractProvider> & {
    storage: () => Promise<T['storage']>;
    methods: { [M in keyof T['methods']]:
        T['methods'][M] extends (...args: infer A) => Promise<void>
        ? (...args: A) => TypedContractMethod
        : never
    };
};
export const createContractAbstractionComposer = <TContract extends ContractTypeBase>() => (abs: ContractAbstraction<ContractProvider>, context: Context): TypedContractAbstractionOf<TContract> => {
    return abs as unknown as TypedContractAbstractionOf<TContract>;
};