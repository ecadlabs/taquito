import { TransactionOperation } from '../../operations/transaction-operation';
import { TransferParams } from '../../operations/types';
import { ContractProvider } from '../interface';
import { TransactionWalletOperation, Wallet } from '../../wallet';
import { ParameterSchema } from "@taquito/michelson-encoder";
import { ContractMethodInterface, ExplicitTransferParams, SendParams } from './contract-method-interface';
import { DEFAULT_SMART_CONTRACT_METHOD_NAME } from '../contract';

/**
 * @description Utility class to send smart contract operation
 * The format for the arguments is the object representation
 */
export class ContractMethodObject<T extends ContractProvider | Wallet> implements ContractMethodInterface {
    constructor(
        private provider: T,
        private address: string,
        private parameterSchema: ParameterSchema,
        private name: string,
        private args: any = 'unit',
        private isMultipleEntrypoint = true,
        private isAnonymous = false
    ) { }

    /**
     * @description Get the signature of the smart contract method
     */
    getSignature() {
        return this.isAnonymous
            ? this.parameterSchema.ExtractSchema()[this.name]
            : this.parameterSchema.ExtractSchema();
    }

    /**
     *
     * @description Send the smart contract operation
     *
     * @param Options generic operation parameter
     */
    send(
        params: Partial<SendParams> = {}
    ): Promise<T extends Wallet ? TransactionWalletOperation : TransactionOperation> {
        if (this.provider instanceof Wallet) {
            return (this.provider as unknown as Wallet).transfer(this.toTransferParams(params)).send() as any;
        } else {
            return this.provider.transfer(this.toTransferParams(params)) as any;
        }
    }

    /**
     *
     * @description Create transfer params to be used with TezosToolkit.contract.transfer methods
     *
     * @param Options generic transfer operation parameters
     */
    toTransferParams({
        fee,
        gasLimit,
        storageLimit,
        source,
        amount = 0,
        mutez = false,
    }: Partial<SendParams> = {}): TransferParams {
        const fullTransferParams: ExplicitTransferParams = {
            to: this.address,
            amount,
            fee,
            mutez,
            source,
            gasLimit,
            storageLimit,
            parameter: {
                entrypoint: this.isMultipleEntrypoint ? this.name : DEFAULT_SMART_CONTRACT_METHOD_NAME,
                value: this.isAnonymous
                    ? this.parameterSchema.EncodeObject({ [this.name]: this.args })
                    : this.parameterSchema.EncodeObject(this.args),
            },
        };
        return fullTransferParams;
    }
}