import { BlockHeaderResponse, RpcClient, BlockMetadata, ManagerKeyResponse } from '@taquito/rpc';
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT } from '../constants';
import { Context } from '../context';
import { ForgedBytes, PrepareOperationParams, RPCOperation, RPCRevealOperation } from './types';

export abstract class OperationEmitter {
  get rpc(): RpcClient {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  constructor(protected context: Context) {}

  protected async prepareOperation({
    operation,
    source,
  }: PrepareOperationParams): Promise<ForgedBytes> {
    let counter;
    const counters: { [key: string]: number } = {};
    const promises: [
      Promise<BlockHeaderResponse>,
      Promise<BlockMetadata>,
      Promise<string>,
      Promise<ManagerKeyResponse | undefined>
    ] = [] as any;
    let requiresReveal = false;
    let ops: RPCOperation[] = [];
    let head: BlockHeaderResponse;

    promises.push(this.rpc.getBlockHeader());
    promises.push(this.rpc.getBlockMetadata());

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    const publicKeyHash = source || (await this.signer.publicKeyHash());

    for (let i = 0; i < ops.length; i++) {
      if (['transaction', 'origination', 'delegation'].includes(ops[i].kind)) {
        requiresReveal = true;
        const { counter } = await this.rpc.getContract(publicKeyHash);
        promises.push(Promise.resolve(counter));
        promises.push(this.rpc.getManagerKey(publicKeyHash));
        break;
      }
    }

    const [header, metadata, headCounter, manager] = await Promise.all(promises);
    head = header;

    if (requiresReveal) {
      const haveManager = typeof manager === 'object' ? !!manager.key : !!manager;
      if (!haveManager) {
        const reveal: RPCRevealOperation = {
          kind: 'reveal',
          fee: DEFAULT_FEE.REVEAL,
          public_key: await this.signer.publicKey(),
          source: publicKeyHash,
          gas_limit: DEFAULT_GAS_LIMIT.REVEAL,
          storage_limit: DEFAULT_STORAGE_LIMIT.REVEAL,
        };

        ops.unshift(reveal);
      }
    }

    counter = parseInt(headCounter, 10);
    if (!counters[publicKeyHash] || counters[publicKeyHash] < counter) {
      counters[publicKeyHash] = counter;
    }

    const constructOps = (cOps: RPCOperation[]) =>
      cOps.map((op: any) => {
        // @ts-ignore
        const constructedOp = { ...op };
        if (['transaction', 'origination', 'delegation'].includes(op.kind)) {
          if (typeof op.source === 'undefined') {
            constructedOp.source = publicKeyHash;
          }
        }
        if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
          if (typeof op.fee === 'undefined') {
            constructedOp.fee = '0';
          } else {
            constructedOp.fee = `${op.fee}`;
          }
          if (typeof op.gas_limit === 'undefined') {
            constructedOp.gas_limit = '0';
          } else {
            constructedOp.gas_limit = `${op.gas_limit}`;
          }
          if (typeof op.storage_limit === 'undefined') {
            constructedOp.storage_limit = '0';
          } else {
            constructedOp.storage_limit = `${op.storage_limit}`;
          }
          if (typeof op.balance !== 'undefined') {
            constructedOp.balance = `${constructedOp.balance}`;
          }
          if (typeof op.amount !== 'undefined') {
            constructedOp.amount = `${constructedOp.amount}`;
          }
          const opCounter = ++counters[publicKeyHash];
          constructedOp.counter = `${opCounter}`;
        }
        return constructedOp;
      });

    const branch = head.hash;
    const contents = constructOps(ops);
    const protocol = metadata.nextProtocol;

    let remoteForgedBytes = await this.rpc.forgeOperations({ branch, contents });

    return {
      opbytes: remoteForgedBytes,
      opOb: {
        branch,
        contents,
        protocol,
      },
      counter,
    };
  }
  protected async signAndInject(forgedBytes: ForgedBytes) {
    const signed = await this.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));
    forgedBytes.opbytes = signed.sbytes;
    forgedBytes.opOb.signature = signed.prefixSig;

    const opResponse: any[] = [];
    let errors: any[] = [];

    const results = await this.rpc.preapplyOperations([forgedBytes.opOb]);

    if (!Array.isArray(results)) {
      throw new Error(`RPC Fail: ${JSON.stringify(results)}`);
    }
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

    if (errors.length) {
      // @ts-ignore
      throw new Error(JSON.stringify({ error: 'Operation Failed', errors }));
    }

    return {
      hash: await this.rpc.injectOperation(forgedBytes.opbytes),
      forgedBytes,
      opResponse,
      context: this.context.clone(),
    };
  }
}
