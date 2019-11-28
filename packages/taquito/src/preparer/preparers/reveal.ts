import { Preparer, PreparerContext } from "../types";

import { RPCOperation } from "../../operations/types";

import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT } from "../../constants";

export class RevealPreparer implements Preparer {
  async prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperation[]> {
    const revealOp = unPreparedOps.some((x) => ['transaction', 'origination', 'delegation'].includes(x.kind))
    if (!revealOp) {
      return unPreparedOps;
    }

    const manager = await context.context.rpc.getManagerKey(await context.source)
    const haveManager = manager && typeof manager === 'object' ? !!manager.key : !!manager;

    if (haveManager) {
      return unPreparedOps;
    }

    const reveal = {
      kind: 'reveal' as 'reveal',
      fee: DEFAULT_FEE.REVEAL,
      public_key: await context.context.signer.publicKey(),
      source: await context.source,
      gas_limit: DEFAULT_GAS_LIMIT.REVEAL,
      storage_limit: DEFAULT_STORAGE_LIMIT.REVEAL,
    }
    return [reveal, ...unPreparedOps];
  }
}
