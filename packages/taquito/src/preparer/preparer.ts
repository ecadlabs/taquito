import { ConstructedOperation } from '@taquito/rpc';
import { Context } from '../context';
import { RPCOperation } from '../operations/types';
import { CounterPreparer } from './preparers/counter';
import { FeeOpPreparer } from './preparers/fee-op';
import { ProtoPreparer } from './preparers/proto';
import { RevealPreparer } from './preparers/reveal';
import { SourcePreparer } from './preparers/source';
import { PreparerContext, RootPreparer } from './types';

export const DEFAULT_PREPARERS = [
  new RevealPreparer(),
  new SourcePreparer(),
  new CounterPreparer(),
  new FeeOpPreparer(),
  new ProtoPreparer(),
];

export class CombinedPreparer implements RootPreparer {
  constructor(private context: Context, private preparers = DEFAULT_PREPARERS) {}

  async createContext(source: string): Promise<PreparerContext> {
    return {
      header: this.context.rpc.getBlockHeader(),
      metadata: this.context.rpc.getBlockMetadata(),
      context: this.context,
      source,
    };
  }

  async prepare(unPreparedOps: RPCOperation[]) {
    const prepContext = await this.createContext(await this.context.signer.publicKeyHash());
    const constOps = await this.preparers.reduce(async (prev, prep) => {
      return prep.prepare(await prev, prepContext) as Promise<RPCOperation[]>;
    }, Promise.resolve(unPreparedOps));

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
