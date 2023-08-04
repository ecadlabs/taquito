import { OpKind } from '@taquito/rpc';

/**
 * @description FailingNoopOperation interface that contains information about a signed failing_noop operation
 */
export interface FailingNoopOperation {
  signedContent: {
    branch: string;
    contents: [
      {
        kind: OpKind.FAILING_NOOP;
        arbitrary: string;
      }
    ];
  };
  bytes: string;
  signature: string;
}
