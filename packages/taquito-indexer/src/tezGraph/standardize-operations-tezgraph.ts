import { castToBigNumber } from "@taquito/rpc";
import { 
    OperationContents,
    OperationContentsDelegation, 
    OperationContentsEndorsement, 
    OperationContentsOrigination, 
    OperationContentsReveal, 
    OperationContentsTransaction, 
    OpKind 
} from "../types-indexers";
import {
    TezGraphOperationContentsDelegation,
    TezGraphOperationContentsEndorsement,
    TezGraphOperationContentsOrigination,
    TezGraphOperationContentsReveal,
    TezGraphOperationsContent,
    TezGraphOperationContentsTransaction
} from "./types-tezgraph";
import BigNumber from 'bignumber.js';
import { OperationKindNotRecognized } from "../errors";

export function operationsStandardizerFactory(operation: TezGraphOperationsContent): OperationContents {
    switch (operation.kind.toLocaleLowerCase()) {
        case OpKind.ORIGINATION: {
            return standardizeOrigination(operation as TezGraphOperationContentsOrigination);
        }
        case OpKind.DELEGATION: {
            return standardizeDelegation(operation as TezGraphOperationContentsDelegation);
        }
        case OpKind.REVEAL: {
            return standardizeReveal(operation as TezGraphOperationContentsReveal);
        }
        case OpKind.TRANSACTION: {
            return standardizeTransaction(operation as TezGraphOperationContentsTransaction);
        }
        case OpKind.ENDORSEMENT: {
            return standardizeEndorsement(operation as TezGraphOperationContentsEndorsement);
        }
        default: {
            throw new OperationKindNotRecognized(operation.kind);
        }
    }
}

function renameKeysAndRemoveNulls(newKeys: {
    [key: string]: string,
}, operation: {
    [key: string]: any,
}) {
    const keyValues = Object.keys(operation).map(key => {
        const newKey = newKeys[key] || key;
        if (!operation[key]) { return }
        return { [newKey]: operation[key] };
    });
    return Object.assign({}, ...keyValues);
}

function standardizeOrigination(operation: TezGraphOperationContentsOrigination): OperationContentsOrigination {
    const newKeys = {
        origination_consumed_milligas: 'consumed_gas'
    }

    const renamedOperation = renameKeysAndRemoveNulls(newKeys, operation);

    const castedResponse: any = castToBigNumber(renamedOperation, [
        'fee',
        'counter',
        'gas_limit',
        'consumed_gas',
        'storage_limit',
    ]);

    return {
        ...renamedOperation,
        ...(castedResponse as OperationContentsOrigination),
        kind: OpKind.ORIGINATION,
        sender: renamedOperation.sender.address,
        consumed_gas: castedResponse.consumed_gas ? (castedResponse.consumed_gas as BigNumber).dividedBy(1000) : undefined
    }
}

function standardizeDelegation(operation: TezGraphOperationContentsDelegation): OperationContentsDelegation {
    const newKeys = {
        delegation_consumed_milligas: 'consumed_gas'
    }

    const renamedOperation = renameKeysAndRemoveNulls(newKeys, operation);

    const castedResponse: any = castToBigNumber(renamedOperation, [
        'fee',
        'counter',
        'gas_limit',
        'consumed_gas'
    ]);

    return {
        ...renamedOperation,
        ...(castedResponse as OperationContentsDelegation),
        kind: OpKind.DELEGATION,
        sender: renamedOperation.sender.address,
        consumed_gas: castedResponse.consumed_gas ? (castedResponse.consumed_gas as BigNumber).dividedBy(1000) : undefined
    }
}

function standardizeReveal(operation: TezGraphOperationContentsReveal): OperationContentsReveal {
    const newKeys = {
        reveal_consumed_milligas: 'consumed_gas'
    }

    const renamedOperation = renameKeysAndRemoveNulls(newKeys, operation);

    const castedResponse: any = castToBigNumber(renamedOperation, [
        'fee',
        'counter',
        'gas_limit',
        'consumed_gas'
    ]);

    return {
        ...renamedOperation,
        ...(castedResponse as OperationContentsReveal),
        kind: OpKind.REVEAL,
        sender: renamedOperation.sender.address,
        consumed_gas: castedResponse.consumed_gas ? (castedResponse.consumed_gas as BigNumber).dividedBy(1000) : undefined
    }
}

function formatParameters(operation: TezGraphOperationContentsTransaction) {
    if (operation.parameters && operation.entrypoint) {
        return {
            entrypoint: operation.entrypoint,
            value: JSON.parse(operation.parameters)
        }
    } else {
        return undefined;
    }
}

function standardizeTransaction(operation: TezGraphOperationContentsTransaction): OperationContentsTransaction {
    const parameters = formatParameters(operation);

    const { ['entrypoint']: removeEntrypoint, ...rest } = operation;

    const newKeys = {
        transaction_consumed_milligas: 'consumed_gas'
    }

    const renamedOperation = renameKeysAndRemoveNulls(newKeys, rest);

    const castedResponse: any = castToBigNumber(renamedOperation, [
        'fee',
        'counter',
        'gas_limit',
        'storage_limit',
        'amount',
        'consumed_gas'
    ]);

    return {
        ...renamedOperation,
        ...(castedResponse as OperationContentsTransaction),
        kind: OpKind.TRANSACTION,
        sender: renamedOperation.sender.address,
        parameters,
        consumed_gas: castedResponse.consumed_gas ? (castedResponse.consumed_gas as BigNumber).dividedBy(1000) : undefined
    }
}

function standardizeEndorsement(operation: TezGraphOperationContentsEndorsement): OperationContentsEndorsement {
    const { ['status']: removeStatus, ...rest } = operation;
    return {
        ...rest,
        kind: OpKind.ENDORSEMENT,
        sender: operation.sender.address,
        slots: operation.slots.length,
        delegate: operation.delegate ? operation.delegate : undefined
    }
}
