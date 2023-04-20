import {
  MichelsonV1ExpressionBase,
  OperationResultDelegation,
  OperationResultOrigination,
  OperationResultRegisterGlobalConstant,
  OperationResultReveal,
  OperationResultSmartRollupOriginate,
  OperationResultTransaction,
  OperationResultTransferTicket,
  OperationResultTxRollupOrigination,
  OperationResultTxRollupSubmitBatch,
  PreapplyResponse,
  TezosGenericOperationError,
} from '@taquito/rpc';
import {
  hasMetadata,
  hasMetadataWithInternalOperationResult,
  hasMetadataWithResult,
} from './types';

export interface TezosOperationErrorWithMessage extends TezosGenericOperationError {
  with: MichelsonV1ExpressionBase;
}

const isErrorWithMessage = (error: any): error is TezosOperationErrorWithMessage => {
  return 'with' in error;
};

/**
 *  @category Error
 *  @description Generic tezos error that will be thrown when a mistake occurs when doing an operation; more details here https://tezos.gitlab.io/api/errors.html
 */
export class TezosOperationError extends Error {
  name = 'TezosOperationError';
  id: string;
  kind: string;

  constructor(public errors: TezosGenericOperationError[], public errorDetails?: string) {
    super();
    // Last error is 'often' the one with more detail
    const lastError = errors[errors.length - 1];
    this.id = lastError.id;
    this.kind = lastError.kind;

    this.message = `(${this.kind}) ${this.id}`;

    if (isErrorWithMessage(lastError)) {
      if (lastError.with.string) {
        this.message = lastError.with.string;
      } else if (lastError.with.int) {
        this.message = lastError.with.int;
      } else {
        this.message = JSON.stringify(lastError.with);
      }
    }
  }
}

/**
 *  @category Error
 *  @description Tezos error that will be thrown when a mistake happens during the preapply stage
 */
export class TezosPreapplyFailureError extends Error {
  name = 'TezosPreapplyFailureError';

  constructor(public result: any) {
    super('Preapply returned an unexpected result');
  }
}

export type MergedOperationResult = OperationResultTransaction &
  OperationResultOrigination &
  OperationResultDelegation &
  OperationResultRegisterGlobalConstant &
  OperationResultTxRollupOrigination &
  OperationResultTxRollupSubmitBatch &
  OperationResultTransferTicket &
  Partial<OperationResultSmartRollupOriginate> &
  OperationResultReveal & {
    fee?: string;
  };

// Flatten all operation content results and internal operation results into a single array
// Some cases where we can have multiple operation results or internal operation results are:
// - When an operation includes a reveal operation
// - When an operation is made using the batch API
// - Smart contract call can contains internal operation results when they call other smart contract internally or originate contracts
export const flattenOperationResult = (response: PreapplyResponse | PreapplyResponse[]) => {
  const results = Array.isArray(response) ? response : [response];

  const returnedResults: MergedOperationResult[] = [];
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i].contents.length; j++) {
      const content = results[i].contents[j];
      if (hasMetadataWithResult(content)) {
        returnedResults.push({
          fee: content.fee,
          ...content.metadata.operation_result,
        });

        if (Array.isArray(content.metadata.internal_operation_results)) {
          content.metadata.internal_operation_results.forEach((x) =>
            returnedResults.push(x.result)
          );
        }
      }
    }
  }

  return returnedResults;
};

/***
 * @description Flatten all error from preapply response (including internal error)
 */
export const flattenErrors = (
  response: PreapplyResponse | PreapplyResponse[],
  status = 'failed'
) => {
  const results = Array.isArray(response) ? response : [response];

  let errors: TezosGenericOperationError[] = [];
  // Transaction that do not fail will be backtracked in case one failure occur
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i].contents.length; j++) {
      const content = results[i].contents[j];
      if (hasMetadata(content)) {
        if (hasMetadataWithResult(content) && content.metadata.operation_result.status === status) {
          errors = errors.concat(content.metadata.operation_result.errors || []);
        }
        if (
          hasMetadataWithInternalOperationResult(content) &&
          Array.isArray(content.metadata.internal_operation_results)
        ) {
          for (const internalResult of content.metadata.internal_operation_results) {
            if ('result' in internalResult && internalResult.result.status === status) {
              errors = errors.concat(internalResult.result.errors || []);
            }
          }
        }
      }
    }
  }

  return errors;
};

/**
 *  @category Error
 *  @description Error that indicates a general failure happening during an origination operation
 */
export class OriginationOperationError extends Error {
  public name = 'OriginationOperationError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid estimate value being passed
 */
export class InvalidEstimateValueError extends Error {
  public name = 'InvalidEstimateValueError';
  constructor(public message: string) {
    super(message);
  }
}
