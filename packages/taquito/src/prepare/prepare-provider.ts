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
import { PreparationProvider, PreparedOperation } from './interface';
import { Protocols } from '../constants';
import { InvalidOperationKindError, DeprecationError } from '@taquito/utils';
import { RPCResponseError, InvalidPrepareParamsError } from '../error';
import { Context } from '../context';
import { ContractMethod } from '../contract/contract-methods/contract-method-flat-param';
import { ContractMethodObject } from '../contract/contract-methods/contract-method-object-param';
import { ContractProvider } from '../contract/interface';

const validateOpKindParams = (operations: RPCOperation[], opKind: string) => {
  return operations.some((x) => {
    return x.kind === opKind;
  });
};

/**
 * @description PrepareProvider is a utility class to output the prepared format of an operation
 */
export class PrepareProvider implements PreparationProvider {
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

  get estimate() {
    return this.context.estimate;
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

  /**
   *
   * @description Method to prepare a reveal operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a origination operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  async originate({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);
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

  /**
   *
   * @description Method to prepare a transaction operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare an activation operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a delegation operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a register_global_constant operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a tx_rollup_origination operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a tx_rollup_submit_batch operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a update_consensus_key operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a transfer_ticket operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a increase_paid_storage operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a ballot operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a proposals operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
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

  /**
   *
   * @description Method to prepare a drain_delegate operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
  async drainDelegate({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

    if (!validateOpKindParams(ops, OpKind.DRAIN_DELEGATE)) {
      throw new InvalidPrepareParamsError(OpKind.DRAIN_DELEGATE);
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

  /**
   *
   * @description Method to prepare a batch operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
  async batch({ operation, source }: PrepareOperationParams): Promise<PreparedOperation> {
    const ops = this.convertIntoArray(operation);

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

  /**
   *
   * @description Method to prepare a batch operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
  async contractCall(
    contractMethod: ContractMethod<ContractProvider> | ContractMethodObject<ContractProvider>
  ): Promise<PreparedOperation> {
    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    const pkh = await this.signer.publicKeyHash();
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const params = contractMethod.toTransferParams();
    const estimate = await this.estimate.transfer(params);

    const ops = [
      {
        kind: OpKind.TRANSACTION,
        fee: params.fee ?? estimate.suggestedFeeMutez,
        gas_limit: params.gasLimit ?? estimate.gasLimit,
        storage_limit: params.storageLimit ?? estimate.storageLimit,
        amount: String(params.amount),
        destination: params.to,
      },
    ] as RPCOperation[];

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
