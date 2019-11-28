import { Preparer, PreparerContext } from "../types";

import { RPCOperation } from "../../operations/types";

import { protocols } from "../../constants";

export class ProtoPreparer implements Preparer {
  async prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperation[]> {
    const proto005 = await context.context.isAnyProtocolActive(protocols['005']);

    // Protocol 005 remove these from operations content
    if (proto005) {
      for (const op of unPreparedOps as any[]) {
        delete op.manager_pubkey;
        delete op.spendable;
        delete op.delegatable;
      }
    }

    return unPreparedOps;
  }
}
