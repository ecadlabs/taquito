import {
  BlockHeaderResponse,
  ConstructedOperation,
  ManagerKeyResponse,
  OperationContentsAndResult,
  RpcClient,
  RPCRunOperationParam,
} from '@taquito/rpc';
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT, Protocols } from '../constants';
import { Context } from '../context';
import { flattenErrors, TezosOperationError, TezosPreapplyFailureError } from './operation-errors';
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

  constructor(protected context: Context) { }

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
    | RPCRevealOperation
  ) & { source?: string } {
    return ['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind);
  }

  protected async prepareOperation({
    operation,
    source,
  }: PrepareOperationParams): Promise<PreparedOperation> {
    let counter;
    const counters: { [key: string]: number } = {};
    let requiresReveal = false;
    let ops: RPCOperation[] = [];
    let head: BlockHeaderResponse;

    const blockHeaderPromise = this.rpc.getBlockHeader();
    const blockMetaPromise = this.rpc.getBlockMetadata();

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    // Implicit account who emit the operation
    const publicKeyHash = await this.signer.publicKeyHash();

    let counterPromise: Promise<string | undefined> = Promise.resolve(undefined);
    let managerPromise: Promise<ManagerKeyResponse | undefined> = Promise.resolve(undefined);
    for (let i = 0; i < ops.length; i++) {
      if (['transaction', 'origination', 'delegation'].includes(ops[i].kind)) {
        requiresReveal = true;
        const { counter } = await this.rpc.getContract(publicKeyHash);
        counterPromise = Promise.resolve(counter);
        managerPromise = this.rpc.getManagerKey(publicKeyHash);
        break;
      }
    }

    const [header, metadata, headCounter, manager] = await Promise.all([
      blockHeaderPromise,
      blockMetaPromise,
      counterPromise,
      managerPromise,
    ]);

    if (!header) {
      throw new Error('Unable to latest block header');
    }

    if (!metadata) {
      throw new Error('Unable to fetch latest metadata');
    }

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

    counter = parseInt(headCounter || '0', 10);
    if (!counters[publicKeyHash] || counters[publicKeyHash] < counter) {
      counters[publicKeyHash] = counter;
    }

    const constructOps = (cOps: RPCOperation[]): ConstructedOperation[] =>
      // tslint:disable strict-type-predicates
      cOps.map((op: RPCOperation) => {
        const constructedOp = { ...op } as ConstructedOperation;
        if (this.isSourceOp(op)) {
          if (typeof op.source === 'undefined') {
            constructedOp.source = source || publicKeyHash;
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
          if (constructedOp.source.toLowerCase().startsWith('kt1')) {
            throw new Error(
              `KT1 addresses are not supported as source since ${Protocols.PsBabyM1}`
            );
          }

          if (typeof op.amount !== 'undefined') constructedOp.amount = `${constructedOp.amount}`;
        }
        // tslint:enable strict-type-predicates

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
    let forgedBytes = await this.context.forger.forge({ branch, contents });

    return {
      opbytes: forgedBytes,
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
    const results = await this.rpc.preapplyOperations([forgedBytes.opOb]);

    if (!Array.isArray(results)) {
      throw new TezosPreapplyFailureError(results);
    }

    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].contents.length; j++) {
        opResponse.push(results[i].contents[j]);
      }
    }

    const errors = flattenErrors(results);

    if (errors.length) {
      // @ts-ignore
      throw new TezosOperationError(errors);
    }

    return {
      hash: await this.context.injector.inject(forgedBytes.opbytes),
      forgedBytes,
      opResponse,
      context: this.context.clone(),
    };
  }
}
