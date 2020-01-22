import {
  PreapplyResponse,
  MichelsonV1ExpressionBase,
  TezosGenericOperationError,
} from '@taquito/rpc';

export interface TezosOperationErrorWithMessage extends TezosGenericOperationError {
  with: MichelsonV1ExpressionBase;
}

const isErrorWithMessage = (error: any): error is TezosOperationErrorWithMessage => {
  return 'with' in error;
};

export class TezosOperationError implements Error {
  name: string = 'TezosOperationError';
  id: string;
  kind: string;
  message: string;

  constructor(public errors: TezosGenericOperationError[]) {
    // Last error is 'often' the one with more detail
    const lastError = errors[errors.length - 1];

    this.id = lastError.id;
    this.kind = lastError.kind;

    this.message = `(${this.kind}) ${this.id}`;

    if (isErrorWithMessage(lastError) && lastError.with.string) {
      this.message = lastError.with.string;
    }
  }
}

export class TezosPreapplyFailureError implements Error {
  name: string = 'TezosPreapplyFailureError';
  message: string = 'Preapply returned an unexpected result';

  constructor(public result: any) {}
}

/***
 * @description Flatten all error from preapply response (including internal error)
 */
export const flattenErrors = (
  response: PreapplyResponse | PreapplyResponse[],
  status = 'failed'
) => {
  let results = Array.isArray(response) ? response : [response];

  let errors: TezosGenericOperationError[] = [];
  // Transaction that do not fail will be backtracked in case one failure occur
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i].contents.length; j++) {
      const content = results[i].contents[j];
      if ('metadata' in content) {
        if (
          typeof content.metadata.operation_result !== 'undefined' &&
          content.metadata.operation_result.status === status
        ) {
          errors = errors.concat(content.metadata.operation_result.errors || []);
        }
        if (Array.isArray(content.metadata.internal_operation_results)) {
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
