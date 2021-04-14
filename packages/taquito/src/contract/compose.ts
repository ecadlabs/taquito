import { Wallet } from '../wallet/wallet';
import { Context } from '../context';
import { ContractAbstraction } from './contract';
import { ContractProvider } from './interface';

export function compose<
    ContractAbsComposer1 extends ContractAbstraction<ContractProvider<TContract> | Wallet<TContract>, TContract>,
    ContractAbsComposer2 extends ContractAbstraction<ContractProvider<TContract> | Wallet<TContract>, TContract>,
    ContractAbstractionComposed,
    TContract extends { methods: unknown, storage: unknown }
>(
    functioncomposer1: (abs: ContractAbsComposer1, context: Context) => ContractAbsComposer2,
    functioncomposer2: (abs: ContractAbsComposer2, context: Context) => ContractAbstractionComposed
): (abs: ContractAbsComposer1, context: Context) => ContractAbstractionComposed {
    return (contractAbstraction, context) =>
        functioncomposer2(functioncomposer1(contractAbstraction, context), context);
}
