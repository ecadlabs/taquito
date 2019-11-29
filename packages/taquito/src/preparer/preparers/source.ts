import { Preparer, PreparerContext } from "../types";

import { RPCOperation, RPCActivateOperation, RPCRevealOperation, RPCOriginationOperation, RPCTransferOperation, RPCDelegateOperation } from "../../operations/types";

type RPCOperationWithSource = RPCActivateOperation | RPCRevealOperation | ((RPCOriginationOperation
  | RPCTransferOperation
  | RPCDelegateOperation) & { source: string });

export class SourcePreparer implements Preparer {
  async prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperationWithSource[]> {
    const results: RPCOperationWithSource[] = [];
    for (const op of unPreparedOps) {
      if (op.kind === 'origination' || op.kind === 'transaction' || op.kind === 'delegation') {
        if (!('source' in op && typeof op.source !== 'undefined')) {
          results.push(Object.assign(op, { source: context.source }))
        } else {
          results.push(op as RPCOperationWithSource);
        }
      } else {
        results.push(op);
      }
    }

    return results;
  }
}
