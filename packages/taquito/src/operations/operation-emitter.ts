import {
  OperationContents,
  OperationContentsAndResult,
  OperationObject,
  OpKind,
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
  RPCOpWithAmount,
  RPCOpWithBalance,
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

  private constructOps = async (
    cOps: RPCOperation[],
    publicKeyHash: string,
    headCounter: number,
    counterFunction: (
      publicKeyHash: string,
      counter: number,
      counterScope: { [key: string]: number }
    ) => Promise<{ counter: string }>,
    source?: string
  ): Promise<OperationContents[]> => {
    const counters = {};
    const opArray: OperationContents[] = [];
    await Promise.all(
      cOps.map(async (op: RPCOperation) => {
        switch (op.kind) {
          case OpKind.ACTIVATION:
            opArray.push({
              ...op
            });
            return;
          case OpKind.REVEAL:
            opArray.push({
              ...op,
              ...this.getSource(op as RPCOpWithSource, publicKeyHash, source),
              ...await counterFunction(publicKeyHash, headCounter, counters),
              ...this.getFee(op as RPCOpWithFee)
            });
            return;
          case OpKind.ORIGINATION:
            opArray.push({
              ...op,
              ...this.formatBalance(op as RPCOpWithBalance),
              ...this.getSource(op as RPCOpWithSource, publicKeyHash, source),
              ...await counterFunction(publicKeyHash, headCounter, counters),
              ...this.getFee(op as RPCOpWithFee)
            });
            return;
          case OpKind.TRANSACTION:
            const cops = {
              ...op,
              ...this.formatAmount(op as RPCOpWithAmount),
              ...this.getSource(op as RPCOpWithSource, publicKeyHash, source),
              ...await counterFunction(publicKeyHash, headCounter, counters),
              ...this.getFee(op as RPCOpWithFee)
            };
            if (cops.source.toLowerCase().startsWith('kt1')) {
              throw new Error(`KT1 addresses are not supported as source since ${Protocols.PsBabyM1}`);
            }
            opArray.push(cops);
            return;
          case OpKind.DELEGATION:
            opArray.push({
              ...op,
              ...this.getSource(op as RPCOpWithSource, publicKeyHash, source),
              ...await counterFunction(publicKeyHash, headCounter, counters),
              ...this.getFee(op as RPCOpWithFee)
            });
            return;
          default:
            throw new Error('Unsupported operation');
        }
      })
    );
    return opArray;
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
  private formatBalance = (op: RPCOpWithBalance) => {
    return {
      balance: typeof op.balance !== 'undefined' ? `${op.balance}` : '0'
    }
  };
  private formatAmount = (op: RPCOpWithAmount) => {
    return {
      amount: typeof op.amount !== 'undefined' ? `${op.amount}` : '0'
    }
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

    const { hash, protocol } = await this.getHashAndProtocol();

    const counterFromProvider = await this.context.counterProvider.getCounters(publicKeyHash);
    let preparedOpSimulation;
    // The last counter from the RPC will be inferior to the last counter from the provider when sending more than one operation per block from the same account.
    // Pre-validation of an operation cannot be done with a counter greater than the RpcCounter+1, or a counter_in_the_future error is raised by the RPC.
    // Thus, the pre-validation step must to be performed using the rpcCounter+1, while the injection step requires the appropriate incremented counter.
    if (counterFromProvider.rpcCounter < counterFromProvider.lastUsedCounter) {
      preparedOpSimulation = {
        opOb: {
          branch: hash,
          contents: await (this.constructOps(ops, publicKeyHash, counterFromProvider.rpcCounter, this.getScopeCounter, source)),
        },
        counter: counterFromProvider.rpcCounter,
      };
    }

    const preparedOp = {
      opOb: {
        branch: hash,
        contents: await (this.constructOps(ops, publicKeyHash, counterFromProvider.rpcCounter, this.getContextCounter, source)),
        protocol: protocol,
      },
      counter: counterFromProvider.rpcCounter,
    };

    return {
      preparedOp,
      preparedOpSimulation,
    };
  }

  private async getHashAndProtocol() {
    const blockHeaderPromise = this.rpc.getBlockHeader();
    const blockMetaPromise = this.rpc.getBlockMetadata();

    const [header, metadata] = await Promise.all([
      blockHeaderPromise,
      blockMetaPromise,
    ]);

    if (!header) {
      throw new Error('Unable to fetch latest block header');
    }

    if (!metadata) {
      throw new Error('Unable to fetch latest metadata');
    }

    return {
      hash: header.hash,
      protocol: metadata.next_protocol,
    };
  }

  private getContextCounter = async (
    publicKeyHash: string, 
    headCounter: number,
    countersScope: { [key: string]: number }) => {
    let opCounter = await this.context.counterProvider.getNextCounter(publicKeyHash);
    const { counter } = await this.getScopeCounter(publicKeyHash, headCounter, countersScope);
    if (opCounter < Number(counter)) {
      opCounter = Number(counter);
    }
    return {
      counter: `${opCounter}`,
    };
  };

  // Used for estimation and to properly increment the counter of operations in a batch
  private getScopeCounter = async (
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
    let ops: RPCOperation[] = [];

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    const publicKeyHash = source? source: await this.signer.publicKeyHash();

    const { hash } = await this.getHashAndProtocol();
    const rpcCounter = await this.context.counterProvider.getRpcCounter(publicKeyHash)

    return {
      opOb: {
        branch: hash,
        contents: await (this.constructOps(ops, publicKeyHash, rpcCounter, this.getScopeCounter, source)),
      },
      counter: rpcCounter,
    };
  }

  protected async preValidate(prepared: PreparedOpAndSimulation, forgedOperation: ForgedBytes) {
    return prepared.preparedOpSimulation
      ? // If we want to inject many operations in the same block
        // operations with a counter greater than `RpcCounter+1` will use the `runOperation` instead of `preapplyOperation`
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
