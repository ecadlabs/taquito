import { Wallet } from '../../wallet';
import { ContractProvider } from '../../contract';
import { ContractMethodObject } from './contract-method-object-param';
import { ContractMethod } from './contract-method-flat-param';
import { ParameterSchema } from '@taquito/michelson-encoder';

export class ContractMethodFactory<T extends ContractProvider | Wallet> {
    createContractMethodFlatParams(
        provider: T,
        address: string,
        smartContractMethodSchema: ParameterSchema,
        smartContractMethodName: string,
        args: any[],
        isMultipleEntrypoint = true,
        isAnonymous = false
    ) {
        return new ContractMethod<T>(
            provider,
            address,
            smartContractMethodSchema,
            smartContractMethodName,
            args,
            isMultipleEntrypoint,
            isAnonymous
        );
    }

    createContractMethodObjectParam(
        provider: T,
        address: string,
        smartContractMethodSchema: ParameterSchema,
        smartContractMethodName: string,
        args: any[],
        isMultipleEntrypoint = true,
        isAnonymous = false
    ) {
        return new ContractMethodObject<T>(
            provider,
            address,
            smartContractMethodSchema,
            smartContractMethodName,
            args,
            isMultipleEntrypoint,
            isAnonymous
        );
    }
}
