import { Preparer, PreparerContext } from "../types";

import { RPCOperation } from "../../operations/types";

export class SourcePreparer implements Preparer {
  async prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperation[]> {
    for (const op of unPreparedOps) {
      if (['transaction', 'origination', 'delegation'].includes(op.kind)) {
        if (!('source' in op && typeof op.source !== 'undefined')) {
          Object.assign(op, { source: context.source })
        }
      }
    }

    return unPreparedOps;
  }
}
