import { Preparer, PreparerContext } from "../types";

import { RPCOperation } from "../../operations/types";

export class SourcePreparer implements Preparer {
  async prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperation[]> {
    for (const op of unPreparedOps) {
      if (['transaction', 'origination', 'delegation'].includes(op.kind)) {
        Object.assign(op, { source: await context.source })
      }
    }

    return unPreparedOps;
  }
}
