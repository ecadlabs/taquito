import { PreparerContext, Preparer } from "../types";
import { RPCOperation } from "../../operations/types";

export class FeeOpPreparer implements Preparer {
  async prepare(unPreparedOps: RPCOperation[], _context: PreparerContext): Promise<RPCOperation[]> {
    for (const op of unPreparedOps as any) {
      if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
        if (typeof op.fee === 'undefined') {
          op.fee = '0';
        } else {
          op.fee = `${op.fee}`;
        }
        if (typeof op.gas_limit === 'undefined') {
          op.gas_limit = '0';
        } else {
          op.gas_limit = `${op.gas_limit}`;
        }
        if (typeof op.storage_limit === 'undefined') {
          op.storage_limit = '0';
        } else {
          op.storage_limit = `${op.storage_limit}`;
        }
      }
    }

    return unPreparedOps
  }
}
