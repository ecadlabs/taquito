import {
  RpcClientInterface,
  OperationContents,
  OpKind,
  VotingPeriodBlockResult,
} from '@taquito/rpc';
import {
  DelegateParams,
  RevealParams,
  RPCOperation,
  RPCOpWithFee,
  RPCOpWithSource,
  isOpRequireReveal,
  RegisterGlobalConstantParams,
  TransferParams,
  OriginateParams,
  TxRollupOriginateParams,
  TxRollupBatchParams,
  UpdateConsensusKeyParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  BallotParams,
  ProposalsParams,
  DrainDelegateParams,
  ParamsWithKind,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
} from '../operations/types';
import { PreparationProvider, PreparedOperation } from './interface';
import { Protocols } from '../constants';
import { InvalidOperationKindError, DeprecationError } from '@taquito/utils';
import { RPCResponseError } from '../error';
import { Context } from '../context';
import { ContractMethod } from '../contract/contract-methods/contract-method-flat-param';
import { ContractMethodObject } from '../contract/contract-methods/contract-method-object-param';
import { ContractProvider } from '../contract/interface';
import {
  createSetDelegateOperation,
  createTransferOperation,
  createRevealOperation,
  createRegisterGlobalConstantOperation,
  createOriginationOperation,
  RevealOperationError,
  createTxRollupOriginationOperation,
  createTxRollupBatchOperation,
  createUpdateConsensusKeyOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  createBallotOperation,
  createProposalsOperation,
  createDrainDelegateOperation,
  DefaultContractType,
  ContractStorageType,
  createSmartRollupAddMessagesOperation,
  createSmartRollupOriginateOperation,
} from '../contract';
import { Estimate } from '../estimate';
import { OperationBatch } from '../batch/rpc-batch-provider';

/**
 * @description PrepareProvider is a utility class to output the prepared format of an operation
 */
export class PrepareProvider implements PreparationProvider {
  #counters: { [key: string]: number };

  constructor(protected context: Context) {
    this.#counters = {};
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

  get parser() {
    return this.context.parser;
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

  private buildEstimates(estimate: Estimate) {
    return {
      fee: estimate.suggestedFeeMutez,
      gasLimit: estimate.gasLimit,
      storageLimit: estimate.storageLimit,
    };
  }

  private async addRevealOperationIfNeeded(operation: RPCOperation, publicKeyHash: string) {
    if (isOpRequireReveal(operation)) {
      const ops: RPCOperation[] = [operation];
      const publicKey = await this.signer.publicKey();
      const estimateReveal = await this.estimate.reveal();
      if (estimateReveal) {
        const estimatedReveal = this.buildEstimates(estimateReveal);
        ops.unshift(await createRevealOperation({ ...estimatedReveal }, publicKeyHash, publicKey));
        return ops;
      }
    }
    return operation;
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
        case OpKind.SMART_ROLLUP_ADD_MESSAGES:
        case OpKind.SMART_ROLLUP_ORIGINATE:
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
          throw new InvalidOperationKindError((op as RPCOperation).kind);
      }
    });
  }

  /**
   *
   * @description Method to prepare a reveal operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async reveal(params: RevealParams): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.reveal(params);
    if (estimate) {
      const estimates = this.buildEstimates(estimate);
      const op = await createRevealOperation(
        {
          ...estimates,
        },
        pkh,
        await this.signer.publicKey()
      );

      const ops = this.convertIntoArray(op);

      const hash = await this.getBlockHash();
      const protocol = await this.getProtocolHash();

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
    } else {
      throw new RevealOperationError(`The publicKeyHash '${pkh}' has already been revealed.`);
    }
  }

  /**
   *
   * @description Method to prepare an origination operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async originate<TContract extends DefaultContractType = DefaultContractType>(
    params: OriginateParams<ContractStorageType<TContract>>,
    source?: string
  ): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.originate(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createOriginationOperation(
      await this.context.parser.prepareCodeOrigination({
        ...params,
        ...estimates,
      })
    );

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare a transaction operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async transaction(params: TransferParams, source?: string): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.transfer(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createTransferOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare a delegation operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async delegation(params: DelegateParams, source?: string): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.setDelegate(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createSetDelegateOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare a register_global_constant operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async registerGlobalConstant(
    params: RegisterGlobalConstantParams,
    source?: string
  ): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.registerGlobalConstant(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createRegisterGlobalConstantOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare a tx_rollup_origination operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async txRollupOrigination(
    params?: TxRollupOriginateParams,
    source?: string
  ): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.txRollupOriginate(params);

    const estimates = this.buildEstimates(estimate);

    const op = await createTxRollupOriginationOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare a tx_rollup_submit_batch operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async txRollupSubmitBatch(
    params: TxRollupBatchParams,
    source?: string
  ): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.txRollupSubmitBatch(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createTxRollupBatchOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare an update_consensus_key operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async updateConsensusKey(
    params: UpdateConsensusKeyParams,
    source?: string
  ): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.updateConsensusKey(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createUpdateConsensusKeyOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare an increase_paid_storage operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async increasePaidStorage(
    params: IncreasePaidStorageParams,
    source?: string
  ): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.increasePaidStorage(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createIncreasePaidStorageOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare a ballot operation
   * @param operation RPCOperation object or RPCOperation array
   * @returns a PreparedOperation object
   */
  async ballot(params: BallotParams): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const op = await createBallotOperation({
      ...params,
    });

    const ops = this.convertIntoArray(op);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

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
   * @param operation RPCOperation object or RPCOperation array
   * @returns a PreparedOperation object
   */
  async proposals(params: ProposalsParams): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const op = await createProposalsOperation({
      ...params,
    });

    const ops = this.convertIntoArray(op);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

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
   * @param operation RPCOperation object or RPCOperation array
   * @returns a PreparedOperation object
   */
  async drainDelegate(params: DrainDelegateParams, source?: string): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const op = await createDrainDelegateOperation({
      ...params,
    });

    const ops = this.convertIntoArray(op);

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
   * @description Method to prepare a transfer_ticket operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async transferTicket(params: TransferTicketParams, source?: string): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.transferTicket(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createTransferTicketOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare a smart_rollup_add_messages operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async smartRollupAddMessages(
    params: SmartRollupAddMessagesParams,
    source?: string
  ): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();

    const estimate = await this.estimate.smartRollupAddMessages(params);
    const estimates = this.buildEstimates(estimate);

    const op = await createSmartRollupAddMessagesOperation({
      ...params,
      ...estimates,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to prepare a smart_rollup_originate operation
   * @param operation RPCOperation object or RPCOperation array
   * @returns a PreparedOperation object
   */
    async smartRollupOriginate(params: SmartRollupOriginateParams): Promise<PreparedOperation> {
      const pkh = await this.signer.publicKeyHash();

      const originationProof = await this.rpc.getOriginationProof({
        kind: params.pvmKind,
        kernel: params.kernel,
      });
      const completeParams = { ...params, originationProof };
      const estimate = await this.estimate.smartRollupOriginate(completeParams);
      const estimates = this.buildEstimates(estimate);

      const op = await createSmartRollupOriginateOperation({
        ...completeParams,
        ...estimates,
      });

      const operation = await this.addRevealOperationIfNeeded(op, pkh);
      const ops = this.convertIntoArray(operation);

      const hash = await this.getBlockHash();
      const protocol = await this.getProtocolHash();

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

  /**
   *
   * @description Method to prepare a batch operation
   * @param operation RPCOperation object or RPCOperation array
   * @returns a PreparedOperation object
   */
  async batch(batchParams: ParamsWithKind[]): Promise<PreparedOperation> {
    // const ops = this.convertIntoArray(operation);
    const pkh = await this.signer.publicKeyHash();
    const batch = new OperationBatch(this.context, this.estimate);

    if (Array.isArray(batchParams)) {
      batch.with(batchParams);
    }

    const ops = await batch.toPrepare();

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

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

  /**
   *
   * @description Method to prepare a batch operation
   * @param operation RPCOperation object or RPCOperation array
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
