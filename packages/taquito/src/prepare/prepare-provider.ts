import {
  RpcClientInterface,
  OperationContents,
  OpKind,
  VotingPeriodBlockResult,
} from '@taquito/rpc';
import {
  PrepareOperationParams,
  RPCOperation,
  RPCOpWithFee,
  RPCOpWithSource,
} from '../operations/types';
import { Preparation, PreparedOperation } from './interface';
import { Protocols } from '../constants';
import { InvalidOperationKindError, DeprecationError } from '@taquito/utils';
import { RPCResponseError, InvalidPrepareParamsError } from '../error';
import { Context } from '../context';

const validateOpKindParams = (operations: RPCOperation[], opKind: string) => {
  return operations.some((x) => {
    return x.kind === opKind;
  });
};

export class PrepareProvider implements Preparation {
  #counters: { [key: string]: number };
  // context: Context
  constructor(protected context: Context) {
    this.#counters = {};
    // this.context = context;
  }

  get rpc(): RpcClientInterface {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  private async getPkh() {
    return await this.context.signer.publicKeyHash();
  }

  private async getBlockHash() {
    return this.context.readProvider.getBlockHash('head~2');
  }

  private async getProtocolHash() {
    return this.context.readProvider.getNextProtocol('head');
  }

  private async getHeadCounter(pkh: string): Promise<string> {
    return this.context.readProvider.getCounter(pkh, 'head') ?? '0';
  }

  private getFee(op: RPCOpWithFee, pkh: string, headCounter: number) {
    if (!this.#counters[pkh] || this.#counters[pkh] < headCounter) {
      this.#counters[pkh] = headCounter;
    }
    const opCounter = ++this.#counters[pkh];

    return {
      counter: `${opCounter}`,
      fee: typeof op.fee === 'undefined' ? '0' : `${op.fee}`,
      gas_limit: typeof op.gas_limit === 'undefined' ? '0' : `${op.gas_limit}`,
      storage_limit: typeof op.storage_limit === 'undefined' ? '0' : `${op.storage_limit}`,
    };
  }

  private getSource(op: RPCOpWithSource, pkh: string, source: string | undefined) {
    return { source: typeof op.source === 'undefined' ? source || pkh : op.source };
  }

  private convertIntoArray(op: RPCOperation | RPCOperation[]): RPCOperation[] {
    if (Array.isArray(op)) {
      return [...op];
    } else {
      return [op];
    }
  }

  private constructOpContents(
    ops: RPCOperation[],
    headCounter: number,
    pkh: string,
    source?: string | undefined,
    currentVotingPeriod?: VotingPeriodBlockResult
  ): OperationContents[] {
    return ops.map((op: RPCOperation) => {
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
            ...this.getSource(op, pkh, source),
            ...this.getFee(op, pkh, headCounter),
          };
        case OpKind.TRANSACTION: {
          const cops = {
            ...op,
            amount: typeof op.amount !== 'undefined' ? `${op.amount}` : '0',
            ...this.getSource(op, pkh, source),
            ...this.getFee(op, pkh, headCounter),
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
          return {
            ...op,
            ...this.getSource(op, pkh, source),
            ...this.getFee(op, pkh, headCounter),
          };
        case OpKind.TRANSFER_TICKET:
          return {
            ...op,
            ticket_amount: `${op.ticket_amount}`,
            ...this.getSource(op, pkh, source),
            ...this.getFee(op, pkh, headCounter),
          };
        case OpKind.INCREASE_PAID_STORAGE:
          return {
            ...op,
            amount: `${op.amount}`,
            ...this.getSource(op, pkh, source),
            ...this.getFee(op, pkh, headCounter),
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
  }

  async reveal({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.REVEAL)) {
      throw new InvalidPrepareParamsError(OpKind.REVEAL);
    }

    const pkh = await this.signer.publicKeyHash();

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async originate({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);
    console.log(ops);
    if (!validateOpKindParams(ops, OpKind.ORIGINATION)) {
      throw new InvalidPrepareParamsError(OpKind.ORIGINATION);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async transaction({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.TRANSACTION)) {
      throw new InvalidPrepareParamsError(OpKind.TRANSACTION);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async activation({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.ACTIVATION)) {
      throw new InvalidPrepareParamsError(OpKind.ACTIVATION);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async delegation({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.DELEGATION)) {
      throw new InvalidPrepareParamsError(OpKind.DELEGATION);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async registerGlobalConstant({
    operation,
    source,
  }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.REGISTER_GLOBAL_CONSTANT)) {
      throw new InvalidPrepareParamsError(OpKind.REGISTER_GLOBAL_CONSTANT);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async txRollupOrigination({
    operation,
    source,
  }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.TX_ROLLUP_ORIGINATION)) {
      throw new InvalidPrepareParamsError(OpKind.TX_ROLLUP_ORIGINATION);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async txRollupSubmitBatch({
    operation,
    source,
  }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.TX_ROLLUP_SUBMIT_BATCH)) {
      throw new InvalidPrepareParamsError(OpKind.TX_ROLLUP_SUBMIT_BATCH);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async updateConsensusKey({
    operation,
    source,
  }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.UPDATE_CONSENSUS_KEY)) {
      throw new InvalidPrepareParamsError(OpKind.UPDATE_CONSENSUS_KEY);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async transferTicket({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.TRANSFER_TICKET)) {
      throw new InvalidPrepareParamsError(OpKind.TRANSFER_TICKET);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async increasePaidStorage({
    operation,
    source,
  }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.INCREASE_PAID_STORAGE)) {
      throw new InvalidPrepareParamsError(OpKind.INCREASE_PAID_STORAGE);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, source);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async ballot({ operation }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.BALLOT)) {
      throw new InvalidPrepareParamsError(OpKind.BALLOT);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);
    let currentVotingPeriod: VotingPeriodBlockResult;

    try {
      currentVotingPeriod = await this.rpc.getCurrentPeriod();
    } catch (e) {
      throw new RPCResponseError('Failed to get the current voting period index');
    }

    const contents = this.constructOpContents(
      ops,
      headCounter,
      pkh,
      undefined,
      currentVotingPeriod
    );

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async proposals({ operation }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.PROPOSALS)) {
      throw new InvalidPrepareParamsError(OpKind.PROPOSALS);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);
    let currentVotingPeriod: VotingPeriodBlockResult;

    try {
      currentVotingPeriod = await this.rpc.getCurrentPeriod();
    } catch (e) {
      throw new RPCResponseError('Failed to get the current voting period index');
    }

    const contents = this.constructOpContents(
      ops,
      headCounter,
      pkh,
      undefined,
      currentVotingPeriod
    );

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }

  async drainDelegate({ operation }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.DRAIN_DELEGATE)) {
      throw new InvalidPrepareParamsError(OpKind.DRAIN_DELEGATE);
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh);

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter: headCounter,
    };
  }
}
