import {
  OperationContents,
  OperationContentsAndResult,
  OperationObject,
  OpKind,
  PreapplyResponse,
  RpcClient,
  RPCRunOperationParam,
} from '@taquito/rpc';
import { Protocols } from '../constants';
import { Context } from '../context';
import { Estimate } from '../contract/estimate';
import { flattenErrors, TezosOperationError, TezosPreapplyFailureError } from './operation-errors';
import {
  ForgedBytes,
  isOpRequireReveal,
  ParamsWithKind,
  PrepareOperationParams,
  RPCOperation,
  RPCOpWithFee,
  RPCOpWithSource,
} from './types';

// RPC requires a signature but does not verify it
export const SIGNATURE_STUB =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: OperationContents[];
    protocol: string;
  };
  counter: number;
}

export interface PreparedOperationSimulation {
  opOb: {
    branch: string;
    contents: OperationContents[];
  };
  counter: number;
}

export interface PreparedOpAndSimulation {
  preparedOp: PreparedOperation;
  preparedOpSimulation?: PreparedOperationSimulation;
}

export abstract class OperationEmitter {
  get rpc(): RpcClient {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  constructor(protected context: Context) {}

  protected async isRevealOpNeeded(op: RPCOperation[] | ParamsWithKind[], pkh: string) {
    return !(await this.isAccountRevealRequired(pkh)) || !this.isRevealRequiredForOpType(op)
      ? false
      : true;
  }

  protected async isAccountRevealRequired(publicKeyHash: string) {
    const manager = await this.rpc.getManagerKey(publicKeyHash);
    const haveManager = manager && typeof manager === 'object' ? !!manager.key : !!manager;
    return !haveManager;
  }

  protected isRevealRequiredForOpType(op: RPCOperation[] | ParamsWithKind[]) {
    let opRequireReveal = false;
    for (const operation of op) {
      if (isOpRequireReveal(operation)) {
        opRequireReveal = true;
      }
    }
    return opRequireReveal;
  }

  private constructOps = (
    cOps: RPCOperation[],
    publicKeyHash: string,
    headCounter: number,
    counterFunction: (
      publicKeyHash: string,
      counter: number,
      counterScope: { [key: string]: number }
    ) => { counter: string },
    source?: string
  ): OperationContents[] => {
    const counters = {};
    // tslint:disable strict-type-predicates
    return cOps.map((op: RPCOperation) => {
      switch (op.kind) {
        case OpKind.ACTIVATION:
          return {
            ...op,
          };
        case OpKind.REVEAL:
          return {
            ...op,
            ...this.getSource(op, publicKeyHash, source),
            ...counterFunction(publicKeyHash, headCounter, counters),
            ...this.getFee(op),
          };
        case OpKind.ORIGINATION:
          return {
            ...op,
            balance: typeof op.balance !== 'undefined' ? `${op.balance}` : '0',
            ...this.getSource(op, publicKeyHash, source),
            ...counterFunction(publicKeyHash, headCounter, counters),
            ...this.getFee(op),
          };
        case OpKind.TRANSACTION:
          const cops = {
            ...op,
            amount: typeof op.amount !== 'undefined' ? `${op.amount}` : '0',
            ...this.getSource(op, publicKeyHash, source),
            ...counterFunction(publicKeyHash, headCounter, counters),
            ...this.getFee(op),
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
            ...this.getSource(op, publicKeyHash, source),
            ...counterFunction(publicKeyHash, headCounter, counters),
            ...this.getFee(op),
          };
        default:
          throw new Error('Unsupported operation');
      }
    });
  };

  private getFee = (op: RPCOpWithFee) => {
    return {
      // tslint:disable-next-line: strict-type-predicates
      fee: typeof op.fee === 'undefined' ? '0' : `${op.fee}`,
      // tslint:disable-next-line: strict-type-predicates
      gas_limit: typeof op.gas_limit === 'undefined' ? '0' : `${op.gas_limit}`,
      // tslint:disable-next-line: strict-type-predicates
      storage_limit: typeof op.storage_limit === 'undefined' ? '0' : `${op.storage_limit}`,
    };
  };

  private getSource = (op: RPCOpWithSource, publicKeyHash: string, source?: string) => {
    return {
      source: typeof op.source === 'undefined' ? source || publicKeyHash : op.source,
    };
  };

  protected async prepareOpAndSimulation({
    operation,
    source
  }: PrepareOperationParams): Promise<PreparedOpAndSimulation> {
    let ops: RPCOperation[] = [];

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    // Implicit account who emit the operation
    const publicKeyHash = await this.signer.publicKeyHash();

    const { counter, hash, protocol } = await this.getCounterHashAndProtocol(ops, publicKeyHash);

    if (!this.context.counters[publicKeyHash] || this.context.counters[publicKeyHash] < counter) {
      this.context.counters[publicKeyHash] = counter;
    }

    let preparedOpSimulation;
    // This is a work around to the counter_in_the_future error returned by the RPC when calling the run_operation
    // The preparedOpSimulation will be used to prevalidate the operation instead of the preparedOp
    // The counter of an operation in preparedOpSimulation will be the head counter + 1
    // The counter in preparedOp will be incremented accordingly if sending many operations in a row by keeping it on the context
    if (counter !== this.context.counters[publicKeyHash]) {
      preparedOpSimulation = {
        opOb: {
          branch: hash,
          contents: this.constructOps(ops, publicKeyHash, counter, this.getScopeCounter, source),
        },
        counter,
      };
    }

    const preparedOp = {
      opOb: {
        branch: hash,
        contents: this.constructOps(ops, publicKeyHash, counter, this.getContextCounter, source),
        protocol: protocol,
      },
      counter,
    };

    return {
      preparedOp,
      preparedOpSimulation,
    };
  }

  private async getCounterHashAndProtocol(ops: RPCOperation[], publicKeyHash: string) {
    const blockHeaderPromise = this.rpc.getBlockHeader();
    const blockMetaPromise = this.rpc.getBlockMetadata();
    let counterPromise: Promise<string | undefined> = Promise.resolve(undefined);

    for (let i = 0; i < ops.length; i++) {
      if (isOpRequireReveal(ops[i]) || ops[i].kind === 'reveal') {
        const { counter } = await this.rpc.getContract(publicKeyHash);
        counterPromise = Promise.resolve(counter);
        break;
      }
    }

    const [header, metadata, headCounter] = await Promise.all([
      blockHeaderPromise,
      blockMetaPromise,
      counterPromise,
    ]);

    if (!header) {
      throw new Error('Unable to fetch latest block header');
    }

    if (!metadata) {
      throw new Error('Unable to fetch latest metadata');
    }

    const counter = parseInt(headCounter || '0', 10);
    return {
      counter,
      hash: header.hash,
      protocol: metadata.next_protocol,
    };
  }

  private getContextCounter = (publicKeyHash: string, headCounter: number) => {
    if (
      !this.context.counters[publicKeyHash] ||
      this.context.counters[publicKeyHash] < headCounter
    ) {
      this.context.counters[publicKeyHash] = headCounter;
    }
    const opCounter = ++this.context.counters[publicKeyHash];
    return {
      counter: `${opCounter}`,
    };
  };

  private getScopeCounter = (
    publicKeyHash: string,
    headCounter: number,
    countersScope: { [key: string]: number }
  ) => {
    if (!countersScope[publicKeyHash] || countersScope[publicKeyHash] < headCounter) {
      countersScope[publicKeyHash] = headCounter;
    }
    return {
      counter: `${++countersScope[publicKeyHash]}`,
    };
  };

  protected async prepareOperationEstimation({
    operation,
    source
  }: PrepareOperationParams): Promise<PreparedOperationSimulation> {
    const countersScope: { [key: string]: number } = {};
    let ops: RPCOperation[] = [];

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    const publicKeyHash = source? source: await this.signer.publicKeyHash();

    const { counter, hash } = await this.getCounterHashAndProtocol(ops, publicKeyHash);

    if (!countersScope[publicKeyHash] || countersScope[publicKeyHash] < counter) {
      countersScope[publicKeyHash] = counter;
    }

    return {
      opOb: {
        branch: hash,
        contents: this.constructOps(ops, publicKeyHash, counter, this.getScopeCounter, source),
      },
      counter,
    };
  }

  protected async preValidate(prepared: PreparedOpAndSimulation, forgedOperation: ForgedBytes) {
    return prepared.preparedOpSimulation
      ? // If we want to inject many operations in a same block
        // we call runOperation instead of preapply
        // to avoid having to produce 2 signatures (op with incremented counter and op used for simulation)
        this.runOperation({
          operation: {
            signature: SIGNATURE_STUB,
            ...prepared.preparedOpSimulation.opOb,
          },
          chain_id: await this.rpc.getChainId(),
        })
      : this.preapplyOperation(forgedOperation.opOb);
  }

  protected async forgeOperation({
    opOb: { branch, contents },
  }: PreparedOperation | PreparedOperationSimulation) {
    return this.context.forger.forge({ branch, contents });
  }

  protected async forge({
    opOb: { branch, contents, protocol },
    counter,
  }: PreparedOperation): Promise<ForgedBytes> {
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

  protected async signOperation(forgedBytes: ForgedBytes) {
    const signed = await this.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));
    forgedBytes.opbytes = signed.sbytes;
    forgedBytes.opOb.signature = signed.prefixSig;
    return forgedBytes;
  }

  protected async runOperation(op: RPCRunOperationParam) {
    const opResponse: OperationContentsAndResult[] = [];
    const results = await this.rpc.runOperation(op);

    for (let j = 0; j < results.contents.length; j++) {
      opResponse.push(results.contents[j]);
    }
    const errors = flattenErrors(results);

    if (errors.length) {
      // @ts-ignore
      throw new TezosOperationError(errors);
    }

    return opResponse;
  }

  protected async preapplyOperation(opOb: OperationObject) {
    const opResponse: OperationContentsAndResult[] = [];
    const results = await this.rpc.preapplyOperations([opOb]);

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
    return opResponse;
  }

  protected async injectOperation(signedOperationBytes: string) {
    return this.context.injector.inject(signedOperationBytes);
  }
}
