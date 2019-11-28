import { Preparer, PreparerContext } from "../types";

import { RPCOperation } from "../../operations/types";
import { Context } from "../../context";

export class CounterProvider {
  private m: Map<string, AsyncIterator<number, number>> = new Map();

  for(pkh: string, context: Context) {
    if (!this.m.has(pkh)) {
      this.m.set(pkh, (async function* () {
        const contract = await context.rpc.getContract(pkh)

        let c = contract ? parseInt(contract.counter || '0', 10) : 0;
        yield ++c;

        while (true) {
          yield ++c;
        }
      })())
    }

    return this.m.get(pkh)!;
  }

  reset(pkh: string) {
    this.m.delete(pkh);
  }

  resetAll() {
    this.m = new Map();
  }
}


export class CounterPreparer implements Preparer {
  async prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperation[]> {
    const counterProvider = new CounterProvider();
    for (const op of unPreparedOps as any) {
      if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
        const it = counterProvider.for(await context.source, context.context)
        Object.assign(op, { counter: String((await it.next()).value) })
      }
    }

    return unPreparedOps
  }
}
