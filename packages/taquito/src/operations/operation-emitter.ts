import {
  OperationContentsAndResult,
  PreapplyResponse,
  RpcClient,
  RPCRunOperationParam,
} from '@taquito/rpc';
import { Context } from '../context';
import { CombinedPreparer } from '../preparer/preparer';
import { PreparedOperation } from '../preparer/types';
import { ForgedBytes, PrepareOperationParams } from './types';

export const flattenOperationContent = (results: PreapplyResponse[]) => {
  const opResponse: OperationContentsAndResult[] = [];
  let errors: any[] = [];

  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i].contents.length; j++) {
      opResponse.push(results[i].contents[j]);
      const content = results[i].contents[j];
      if (
        'metadata' in content &&
        typeof content.metadata.operation_result !== 'undefined' &&
        content.metadata.operation_result.status === 'failed'
      ) {
        errors = errors.concat(content.metadata.operation_result.errors);
      }
    }
  }

  return {
    opResponse,
    errors,
  };
};

export abstract class OperationEmitter {
  protected readonly preparer: CombinedPreparer;

  get rpc(): RpcClient {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  constructor(protected context: Context) {
    this.preparer = new CombinedPreparer(context);
  }

  protected async prepareAndForge(params: PrepareOperationParams) {
    const prepared = await this.preparer.prepare(
      Array.isArray(params.operation) ? params.operation : [params.operation]
    );
    const forged = await this.forge(prepared);
    return {
      opOb: prepared,
      opbytes: forged,
    };
  }

  protected async forge({ branch, contents }: PreparedOperation) {
    return this.context.forger.forge({ branch, contents });
  }

  protected async simulate(op: RPCRunOperationParam) {
    return {
      opResponse: await this.rpc.runOperation(op),
      op,
      context: this.context.clone(),
    };
  }

  protected async signAndInject(forgedBytes: ForgedBytes) {
    const signed = await this.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));
    forgedBytes.opbytes = signed.sbytes;
    forgedBytes.opOb.signature = signed.prefixSig;
    const results = await this.rpc.preapplyOperations([forgedBytes.opOb]);

    if (!Array.isArray(results)) {
      throw new Error(`RPC Fail: ${JSON.stringify(results)}`);
    }

    const { opResponse, errors } = flattenOperationContent(results);

    if (errors.length) {
      // @ts-ignore
      throw new Error(JSON.stringify({ error: 'Operation Failed', errors }));
    }

    return {
      hash: await this.context.injector.inject(forgedBytes.opbytes),
      forgedBytes,
      opResponse,
      context: this.context.clone(),
    };
  }
}
