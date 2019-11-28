import { RPCOperation } from "../operations/types";
import { ConstructedOperation } from "@taquito/rpc";
import { PreparerContext } from "./types";
import { Context } from "../context";
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT, protocols } from "../constants";

interface Preparer {
  prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperation[]>
}

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

const counterProvider = new CounterProvider();

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

export class CounterPreparer implements Preparer {
  async prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperation[]> {
    if (unPreparedOps.some((x) => x.kind === 'activate_account')) {
      return unPreparedOps;
    }

    const it = counterProvider.for(await context.source, context.context)
    for (const op of unPreparedOps as any) {
      if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
        Object.assign(op, { counter: String((await it.next()).value) })
      }
    }

    return unPreparedOps
  }
}

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

export class CombinedPreparer {

  constructor(private context: Context) { }

  private isValidConstructed(_op: any): _op is ConstructedOperation {
    return true;
  }

  private preparers: Preparer[] = [new RevealPreparer(), new SourcePreparer(), new CounterPreparer(), new FeeOpPreparer(), new ProtoPreparer()];

  async createContext(source: string): Promise<PreparerContext> {
    return {
      header: this.context.rpc.getBlockHeader(),
      metadata: this.context.rpc.getBlockMetadata(),
      context: this.context,
      source: Promise.resolve(source)
    }
  }

  async prepare(unPreparedOps: RPCOperation[], source: string) {
    const prepContext = await this.createContext(source);
    let constOps: RPCOperation[] = unPreparedOps;
    for (const prep of this.preparers) {
      constOps = await prep.prepare(unPreparedOps, prepContext);
    }

    if (!constOps.every((x) => this.isValidConstructed(x))) {
      throw new Error('Invalid ops');
    }

    const metadata = await prepContext.metadata;
    const header = await prepContext.header;

    const branch = header.hash;
    const contents = constOps as ConstructedOperation[];
    const protocol = metadata.next_protocol;

    return {
      branch,
      contents,
      protocol,
    };
  }
}
