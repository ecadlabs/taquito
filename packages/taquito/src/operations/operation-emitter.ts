import {
  BlockHeaderResponse,
  BlockMetadata,
  ConstructedOperation,
  ManagerKeyResponse,
  OperationContentsAndResult,
  RpcClient,
  RPCRunOperationParam,
} from '@taquito/rpc';
import {
  DEFAULT_FEE,
  DEFAULT_GAS_LIMIT,
  DEFAULT_STORAGE_LIMIT,
  protocols,
  Protocols,
} from '../constants';
import { Context } from '../context';
import {
  ForgedBytes,
  PrepareOperationParams,
  RPCDelegateOperation,
  RPCOperation,
  RPCOriginationOperation,
  RPCRevealOperation,
  RPCTransferOperation,
} from './types';

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: ConstructedOperation[];
    protocol: string;
  };
  counter: number;
}

export abstract class OperationEmitter {
  get rpc(): RpcClient {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  constructor(protected context: Context) {}

  private isSourceOp(
    op: RPCOperation
  ): op is (RPCTransferOperation | RPCOriginationOperation | RPCDelegateOperation) & {
    source?: string;
  } {
    return ['transaction', 'origination', 'delegation'].includes(op.kind);
  }

  private isFeeOp(
    op: RPCOperation
  ): op is (
    | RPCTransferOperation
    | RPCOriginationOperation
    | RPCDelegateOperation
    | RPCRevealOperation) & { source?: string } {
    return ['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind);
  }

  protected async prepareOperation({
    operation,
    source,
  }: PrepareOperationParams): Promise<PreparedOperation> {
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
      const haveManager = manager && typeof manager === 'object' ? !!manager.key : !!manager;
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

    const proto005 = await this.context.isAnyProtocolActive(protocols['005']);

    const constructOps = (cOps: RPCOperation[]): ConstructedOperation[] =>
      // tslint:disable strict-type-predicates
      cOps.map((op: RPCOperation) => {
        const constructedOp = { ...op } as ConstructedOperation;
        if (this.isSourceOp(op)) {
          if (typeof op.source === 'undefined') {
            constructedOp.source = publicKeyHash;
          }
        }
        if (this.isFeeOp(op)) {
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
          const opCounter = ++counters[publicKeyHash];
          constructedOp.counter = `${opCounter}`;
        }
        if (op.kind === 'origination') {
          if (typeof op.balance !== 'undefined') constructedOp.balance = `${constructedOp.balance}`;
        }

        if (op.kind === 'transaction') {
          if (proto005 && constructedOp.source.toLowerCase().startsWith('kt1')) {
            throw new Error(`KT1 addresses are not supported as source in ${Protocols.PsBabyM1}`);
          }

          if (typeof op.amount !== 'undefined') constructedOp.amount = `${constructedOp.amount}`;
        }
        // tslint:enable strict-type-predicates

        // Protocol 005 remove these from operations content
        if (proto005) {
          delete constructedOp.manager_pubkey;
          delete constructedOp.spendable;
          delete constructedOp.delegatable;
        }

        return constructedOp;
      });

    const branch = head.hash;
    const contents = constructOps(ops);
    const protocol = metadata.next_protocol;

    return {
      opOb: {
        branch,
        contents,
        protocol,
      },
      counter,
    };
  }

  protected async prepareAndForge(params: PrepareOperationParams) {
    const prepared = await this.prepareOperation(params);
    return this.forge(prepared);
  }

  protected async forge({ opOb: { branch, contents, protocol }, counter }: PreparedOperation) {
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

    const opResponse: OperationContentsAndResult[] = [];
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
