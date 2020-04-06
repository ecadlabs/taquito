import {
  BlockHeaderResponse,
  ManagerKeyResponse,
  OperationContents,
  OperationContentsAndResult,
  OpKind,
  RpcClient,
  RPCRunOperationParam,
} from '@taquito/rpc';
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT, Protocols } from '../constants';
import { Context } from '../context';
import { Estimate } from '../contract/estimate';
import { flattenErrors, TezosOperationError, TezosPreapplyFailureError } from './operation-errors';
import {
  ForgedBytes,
  isOpRequireReveal,
  PrepareOperationParams,
  RPCOperation,
  RPCOpWithFee,
  RPCOpWithSource,
  RPCRevealOperation,
} from './types';

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: OperationContents[];
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

  // Originally from sotez (Copyright (c) 2018 Andrew Kishino)
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
      if (isOpRequireReveal(ops[i])) {
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
      managerPromise as any,
    ]);

    if (!header) {
      throw new Error('Unable to fetch latest block header');
    }

    if (!metadata) {
      throw new Error('Unable to fetch latest metadata');
    }

    head = header;

    if (requiresReveal) {
      const haveManager = manager && typeof manager === 'object' ? !!manager.key : !!manager;
      if (!haveManager) {
        const reveal: RPCRevealOperation = {
          kind: OpKind.REVEAL,
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

    const getFee = (op: RPCOpWithFee) => {
      const opCounter = ++counters[publicKeyHash];
      return {
        counter: `${opCounter}`,
        // tslint:disable-next-line: strict-type-predicates
        fee: typeof op.fee === 'undefined' ? '0' : `${op.fee}`,
        // tslint:disable-next-line: strict-type-predicates
        gas_limit: typeof op.gas_limit === 'undefined' ? '0' : `${op.gas_limit}`,
        // tslint:disable-next-line: strict-type-predicates
        storage_limit: typeof op.storage_limit === 'undefined' ? '0' : `${op.storage_limit}`,
      };
    };

    const getSource = (op: RPCOpWithSource) => {
      return {
        source: typeof op.source === 'undefined' ? source || publicKeyHash : op.source,
      };
    };

    const constructOps = (cOps: RPCOperation[]): OperationContents[] =>
      // tslint:disable strict-type-predicates
      cOps.map((op: RPCOperation) => {
        switch (op.kind) {
          case OpKind.ACTIVATION:
            return {
              ...op,
            };
          case OpKind.REVEAL:
            return {
              ...op,
              ...getSource(op),
              ...getFee(op),
            };
          case OpKind.ORIGINATION:
            return {
              ...op,
              balance: typeof op.balance !== 'undefined' ? `${op.balance}` : '0',
              ...getSource(op),
              ...getFee(op),
            };
          case OpKind.TRANSACTION:
            const cops = {
              ...op,
              amount: typeof op.amount !== 'undefined' ? `${op.amount}` : '0',
              ...getSource(op),
              ...getFee(op),
            };
            if (cops.source.toLowerCase().startsWith('kt1')) {
              throw new Error(
                `KT1 addresses are not supported as source since ${Protocols.PsBabyM1}`
              );
            }
            return cops;
          case OpKind.DELEGATION:
            return {
              ...op,
              ...getSource(op),
              ...getFee(op),
            };
          default:
            throw new Error('Unsupported operation');
        }
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

  protected async estimate<T extends { fee?: number; gasLimit?: number; storageLimit?: number }>(
    { fee, gasLimit, storageLimit, ...rest }: T,
    estimator: (param: T) => Promise<Estimate>
  ) {
    let calculatedFee = fee;
    let calculatedGas = gasLimit;
    let calculatedStorage = storageLimit;

    if (fee === undefined || gasLimit === undefined || storageLimit === undefined) {
      const estimation = await estimator({ fee, gasLimit, storageLimit, ...(rest as any) });

      if (calculatedFee === undefined) {
        calculatedFee = estimation.suggestedFeeMutez;
      }

      if (calculatedGas === undefined) {
        calculatedGas = estimation.gasLimit;
      }

      if (calculatedStorage === undefined) {
        calculatedStorage = estimation.storageLimit;
      }
    }

    return {
      fee: calculatedFee!,
      gasLimit: calculatedGas!,
      storageLimit: calculatedStorage!,
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
