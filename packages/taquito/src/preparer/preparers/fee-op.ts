import { PreparerContext, Preparer } from "../types";
import { RPCOperation, RPCActivateOperation, RPCOriginationOperation, RPCTransferOperation, RPCDelegateOperation, RPCRevealOperation } from "../../operations/types";


type RPCOperationWithFeeNumber = RPCOriginationOperation
  | RPCTransferOperation
  | RPCDelegateOperation
  | RPCRevealOperation;

type RPCOperationWithFee = RPCActivateOperation | (Omit<Omit<Omit<RPCOperationWithFeeNumber, 'fee'>, 'gas_limit'>, 'storage_limit'> & {
  fee: string;
  gas_limit: string;
  storage_limit: string;
})

export class FeeOpPreparer {
  async prepare(unPreparedOps: RPCOperation[], _context: PreparerContext): Promise<RPCOperationWithFee[]> {
    const results: RPCOperationWithFee[] = [];
    for (const op of unPreparedOps) {
      if (op.kind === 'reveal' || op.kind === 'transaction' || op.kind === 'origination' || op.kind === 'delegation') {
        let fee = '0'
        // tslint:disable-next-line: variable-name
        let gas_limit = '0';
        // tslint:disable-next-line: variable-name
        let storage_limit = '0';
        // tslint:disable-next-line: strict-type-predicates
        if (typeof op.fee !== 'undefined') {
          fee = `${op.fee}`;
        }
        // tslint:disable-next-line: strict-type-predicates
        if (typeof op.gas_limit !== 'undefined') {
          gas_limit = `${op.gas_limit}`;
        }
        // tslint:disable-next-line: strict-type-predicates
        if (typeof op.storage_limit !== 'undefined') {
          storage_limit = `${op.storage_limit}`;
        }

        results.push({ ...op, storage_limit, fee, gas_limit })
      } else {
        results.push(op)
      }
    }

    return results
  }
}
