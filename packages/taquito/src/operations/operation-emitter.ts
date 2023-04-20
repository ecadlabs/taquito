import {
  OperationContents,
  OperationContentsAndResult,
  OpKind,
  RpcClientInterface,
  RPCRunOperationParam,
  VotingPeriodBlockResult,
} from '@taquito/rpc';
import { Protocols } from '../constants';
import { Context } from '../context';
import { Estimate } from '../estimate/estimate';
import { RPCResponseError } from '../error';
import {
  flattenErrors,
  TezosOperationError,
  TezosPreapplyFailureError,
  InvalidEstimateValueError,
} from './operation-errors';
import { InvalidOperationKindError, DeprecationError } from '@taquito/utils';
import {
  ForgedBytes,
  isOpRequireReveal,
  ParamsWithKind,
  PrepareOperationParams,
  RPCOperation,
  RPCOpWithFee,
  RPCOpWithSource,
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
  get rpc(): RpcClientInterface {
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
    return !(await this.context.readProvider.isAccountRevealed(publicKeyHash, 'head'));
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

  // Originally from sotez (Copyright (c) 2018 Andrew Kishino)
  protected async prepareOperation(
    { operation, source }: PrepareOperationParams,
    pkh?: string
  ): Promise<PreparedOperation> {
    const counters: { [key: string]: number } = {};
    let ops: RPCOperation[] = [];

    const blockHashPromise = this.context.readProvider.getBlockHash('head~2');
    const blockProtoPromise = this.context.readProvider.getNextProtocol('head');

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    // Implicit account who emit the operation
    const publicKeyHash = pkh ? pkh : await this.signer.publicKeyHash();
    let counterPromise: Promise<string | undefined> = Promise.resolve(undefined);

    // initializes a currentVotingPeriod if the operation is a ballot op
    let currentVotingPeriodPromise: Promise<VotingPeriodBlockResult | undefined> =
      Promise.resolve(undefined);
    ops.find(async (op) => {
      if (op.kind === 'ballot' || op.kind === 'proposals') {
        try {
          currentVotingPeriodPromise = this.rpc.getCurrentPeriod();
        } catch (e) {
          throw new RPCResponseError(
            `Failed to get the current voting period index: ${JSON.stringify(e)}`
          );
        }
      }
    });

    for (let i = 0; i < ops.length; i++) {
      if (isOpRequireReveal(ops[i]) || ops[i].kind === 'reveal') {
        counterPromise = this.context.readProvider.getCounter(publicKeyHash, 'head');
        break;
      }
    }

    const [hash, protocol, headCounter, currentVotingPeriod] = await Promise.all([
      blockHashPromise,
      blockProtoPromise,
      counterPromise,
      currentVotingPeriodPromise,
    ]);

    const counter = parseInt(headCounter || '0', 10);
    if (!counters[publicKeyHash] || counters[publicKeyHash] < counter) {
      counters[publicKeyHash] = counter;
    }

    const getFee = (op: RPCOpWithFee) => {
      const opCounter = ++counters[publicKeyHash];
      return {
        counter: `${opCounter}`,
        fee: typeof op.fee === 'undefined' ? '0' : `${op.fee}`,
        gas_limit: typeof op.gas_limit === 'undefined' ? '0' : `${op.gas_limit}`,
        storage_limit: typeof op.storage_limit === 'undefined' ? '0' : `${op.storage_limit}`,
      };
    };

    const getSource = (op: RPCOpWithSource) => {
      return {
        source: typeof op.source === 'undefined' ? source || publicKeyHash : op.source,
      };
    };

    const constructOps = (cOps: RPCOperation[]): OperationContents[] =>
      cOps.map((op: RPCOperation) => {
        switch (op.kind) {
          case OpKind.ACTIVATION:
          case OpKind.DRAIN_DELEGATE:
            return {
              ...op,
            };
          case OpKind.ORIGINATION:
            return {
              ...op,
              balance: typeof op.balance !== 'undefined' ? `${op.balance}` : '0',
              ...getSource(op),
              ...getFee(op),
            };
          case OpKind.TRANSACTION: {
            const cops = {
              ...op,
              amount: typeof op.amount !== 'undefined' ? `${op.amount}` : '0',
              ...getSource(op),
              ...getFee(op),
            };
            if (cops.source.toLowerCase().startsWith('kt1')) {
              throw new DeprecationError(
                `KT1 addresses are not supported as source since ${Protocols.PsBabyM1}`
              );
            }
            return cops;
          }
          case OpKind.REVEAL:
          case OpKind.DELEGATION:
          case OpKind.REGISTER_GLOBAL_CONSTANT:
          case OpKind.TX_ROLLUP_ORIGINATION:
          case OpKind.TX_ROLLUP_SUBMIT_BATCH:
          case OpKind.UPDATE_CONSENSUS_KEY:
          case OpKind.SMART_ROLLUP_ADD_MESSAGES:
          case OpKind.SMART_ROLLUP_ORIGINATE:
            return {
              ...op,
              ...getSource(op),
              ...getFee(op),
            };
          case OpKind.TRANSFER_TICKET:
            return {
              ...op,
              ticket_amount: `${op.ticket_amount}`,
              ...getSource(op),
              ...getFee(op),
            };
          case OpKind.INCREASE_PAID_STORAGE:
            return {
              ...op,
              amount: `${op.amount}`,
              ...getSource(op),
              ...getFee(op),
            };
          case OpKind.BALLOT:
            if (currentVotingPeriod === undefined) {
              throw new RPCResponseError(`Failed to get the current voting period index`);
            }
            return {
              ...op,
              period: currentVotingPeriod?.voting_period.index,
            };
          case OpKind.PROPOSALS:
            if (currentVotingPeriod === undefined) {
              throw new RPCResponseError(`Failed to get the current voting period index`);
            }
            return {
              ...op,
              period: currentVotingPeriod?.voting_period.index,
            };
          default:
            throw new InvalidOperationKindError((op as any).kind);
        }
      });

    const contents = constructOps(ops);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter,
    };
  }

  protected async forge({ opOb: { branch, contents, protocol }, counter }: PreparedOperation) {
    const forgedBytes = await this.context.forger.forge({ branch, contents });

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

    if (calculatedFee && calculatedFee % 1 !== 0) {
      throw new InvalidEstimateValueError(`Fee value must not be a decimal: ${calculatedFee}`);
    }
    if (calculatedGas && calculatedGas % 1 !== 0) {
      throw new InvalidEstimateValueError(
        `Gas Limit value must not be a decimal: ${calculatedGas}`
      );
    }
    if (calculatedStorage && calculatedStorage % 1 !== 0) {
      throw new InvalidEstimateValueError(
        `Storage Limit value must not be a decimal: ${calculatedStorage}`
      );
    }

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
      fee: calculatedFee,
      gasLimit: calculatedGas,
      storageLimit: calculatedStorage,
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
      throw new TezosOperationError(
        errors,
        'Error occurred during validation simulation of operation'
      );
    }

    return {
      hash: await this.context.injector.inject(forgedBytes.opbytes),
      forgedBytes,
      opResponse,
      context: this.context.clone(),
    };
  }
}
