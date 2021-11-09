import { OperationContentsAndResult, OperationContentsAndResultRegisterGlobalConstant } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import {
    FeeConsumingOperation,
    ForgedBytes,
    GasConsumingOperation,
    RPCRegisterGlobalConstantOperation,
    StorageConsumingOperation,
} from './types';

/**
 * @description RegisterGlobalConstantOperation provides utility functions to fetch a newly issued operation of kind register_global_constant
 */
export class RegisterGlobalConstantOperation extends Operation
    implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation {

    /**
     * @description Global address of the newly registered constant
     */
    public readonly globalAddress?: string;
    constructor(
        hash: string,
        private readonly params: RPCRegisterGlobalConstantOperation,
        public readonly source: string,
        raw: ForgedBytes,
        results: OperationContentsAndResult[],
        context: Context
    ) {
        super(hash, raw, results, context);

        this.globalAddress = this.operationResults && this.operationResults.global_address;
    }

    get operationResults() {
        const registerGlobalConstantOp =
            Array.isArray(this.results) &&
            (this.results.find(op => op.kind === 'register_global_constant') as OperationContentsAndResultRegisterGlobalConstant);
        const result = registerGlobalConstantOp && registerGlobalConstantOp.metadata && registerGlobalConstantOp.metadata.operation_result;
        return result ? result : undefined;
    }

    get status() {
        const operationResults = this.operationResults;
        if (operationResults) {
            return operationResults.status;
        } else {
            return 'unknown';
        }
    }

    get registeredExpression() {
        return this.params.value;
    }

    get fee() {
        return this.params.fee;
    }

    get gasLimit() {
        return this.params.gas_limit;
    }

    get storageLimit() {
        return this.params.storage_limit;
    }

    get errors() {
        return this.operationResults && this.operationResults.errors;
    }
}
