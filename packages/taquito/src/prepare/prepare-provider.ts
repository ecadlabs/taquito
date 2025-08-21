import {
  OperationContents,
  OpKind,
  VotingPeriodBlockResult,
  PreapplyParams,
  ConstantsResponse,
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
  UpdateConsensusKeyParams,
  UpdateCompanionKeyParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  BallotParams,
  ProposalsParams,
  DrainDelegateParams,
  ParamsWithKind,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
  SmartRollupExecuteOutboxMessageParams,
  isOpWithFee,
  RegisterDelegateParams,
  ActivationParams,
  StakeParams,
  UnstakeParams,
  FinalizeUnstakeParams,
} from '../operations/types';
import { PreparationProvider, PreparedOperation } from './interface';
import { REVEAL_STORAGE_LIMIT, Protocols, getRevealFee, getRevealGasLimit } from '../constants';
import { RPCResponseError } from '../errors';
import {
  PublicKeyNotFoundError,
  InvalidOperationKindError,
  DeprecationError,
  InvalidProofError,
  ProhibitedActionError,
} from '@taquito/core';
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
  createUpdateConsensusKeyOperation,
  createUpdateCompanionKeyOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  createBallotOperation,
  createProposalsOperation,
  createDrainDelegateOperation,
  DefaultContractType,
  ContractStorageType,
  createSmartRollupAddMessagesOperation,
  createSmartRollupOriginateOperation,
  createSmartRollupExecuteOutboxMessageOperation,
  createRegisterDelegateOperation,
  createActivationOperation,
} from '../contract';
import { Estimate } from '../estimate';
import { ForgeParams } from '@taquito/local-forging';
import { Provider } from '../provider';
import BigNumber from 'bignumber.js';
import { BlockIdentifier } from '../read-provider/interface';
import {
  b58DecodeAndCheckPrefix,
  PrefixV2,
  publicKeyHashPrefixes,
  publicKeyPrefixes,
} from '@taquito/utils';

interface Limits {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
}

const mergeLimits = (
  userDefinedLimit: Limits,
  defaultLimits: Required<Limits>
): Required<Limits> => {
  return {
    fee: userDefinedLimit.fee ?? defaultLimits.fee,
    gasLimit: userDefinedLimit.gasLimit ?? defaultLimits.gasLimit,
    storageLimit: userDefinedLimit.storageLimit ?? defaultLimits.storageLimit,
  };
};

/**
 * @description PrepareProvider is a utility class to output the prepared format of an operation
 */
export class PrepareProvider extends Provider implements PreparationProvider {
  #counters: { [key: string]: number };

  constructor(protected context: Context) {
    super(context);
    this.#counters = {};
  }

  private async getBlockHash(block?: BlockIdentifier) {
    return this.context.readProvider.getBlockHash(block ?? 'head~2');
  }

  private async getProtocolHash() {
    return this.context.readProvider.getNextProtocol('head');
  }

  private async getHeadCounter(pkh: string): Promise<string> {
    return this.context.readProvider.getCounter(pkh, 'head') ?? '0';
  }

  private adjustGasForBatchOperation(
    gasLimitBlock: BigNumber,
    gaslimitOp: BigNumber,
    numberOfOps: number
  ) {
    return BigNumber.min(gaslimitOp, gasLimitBlock.div(numberOfOps + 1));
  }

  private async getOperationLimits(
    constants: Pick<
      ConstantsResponse,
      | 'hard_gas_limit_per_operation'
      | 'hard_gas_limit_per_block'
      | 'hard_storage_limit_per_operation'
    >,
    numberOfOps?: number
  ) {
    const {
      hard_gas_limit_per_operation,
      hard_gas_limit_per_block,
      hard_storage_limit_per_operation,
    } = constants;
    return {
      fee: 0,
      gasLimit: numberOfOps
        ? Math.floor(
            this.adjustGasForBatchOperation(
              hard_gas_limit_per_block,
              hard_gas_limit_per_operation,
              numberOfOps
            ).toNumber()
          )
        : hard_gas_limit_per_operation.toNumber(),
      storageLimit: hard_storage_limit_per_operation.toNumber(),
    };
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

  private async addRevealOperationIfNeeded(operation: RPCOperation, publicKeyHash: string) {
    if (isOpRequireReveal(operation)) {
      const ops: RPCOperation[] = [operation];
      const { publicKey, pkh } = await this.getKeys();
      if (await this.isAccountRevealRequired(publicKeyHash)) {
        if (!publicKey) {
          throw new PublicKeyNotFoundError(pkh);
        }
        const [, pkhPrefix] = b58DecodeAndCheckPrefix(pkh, publicKeyHashPrefixes);
        ops.unshift(
          await createRevealOperation(
            {
              fee: getRevealFee(pkh),
              storageLimit: REVEAL_STORAGE_LIMIT,
              gasLimit: getRevealGasLimit(pkh),
              proof:
                pkhPrefix === PrefixV2.BLS12_381PublicKeyHash
                  ? (await this.signer.provePossession!()).prefixSig
                  : undefined,
            },
            publicKeyHash,
            publicKey
          )
        );
        return ops;
      }
    }
    return operation;
  }

  private async getKeys(): Promise<{
    pkh: string;
    publicKey?: string;
  }> {
    const isSignerConfigured = this.context.isAnySignerConfigured();
    return {
      pkh: isSignerConfigured
        ? await this.signer.publicKeyHash()
        : await this.context.walletProvider.getPKH(),
      publicKey: isSignerConfigured ? await this.signer.publicKey() : undefined,
    };
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
        case OpKind.UPDATE_CONSENSUS_KEY:
        case OpKind.UPDATE_COMPANION_KEY:
        case OpKind.SMART_ROLLUP_ADD_MESSAGES:
        case OpKind.SMART_ROLLUP_ORIGINATE:
        case OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE:
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
   * @description Method to prepare an activation operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async activate({ pkh, secret }: ActivationParams): Promise<PreparedOperation> {
    const op = await createActivationOperation({
      pkh,
      secret,
    });

    const ops = this.convertIntoArray(op);
    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
   * @description Method to prepare a reveal operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async reveal({ fee, gasLimit, storageLimit, proof }: RevealParams): Promise<PreparedOperation> {
    const { pkh, publicKey } = await this.getKeys();

    if (!publicKey) {
      throw new PublicKeyNotFoundError(pkh);
    }

    const [, pkhPrefix] = b58DecodeAndCheckPrefix(pkh, publicKeyHashPrefixes);
    if (pkhPrefix === PrefixV2.BLS12_381PublicKeyHash) {
      if (proof) {
        b58DecodeAndCheckPrefix(proof, [PrefixV2.BLS12_381Signature]); // validate proof to be a bls signature
      } else {
        const { prefixSig } = await this.signer.provePossession!();
        proof = prefixSig;
      }
    } else {
      if (proof) {
        throw new ProhibitedActionError('Proof field is only allowed to reveal a bls account ');
      }
    }
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);
    const mergedEstimates = mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS);

    const op = await createRevealOperation(
      {
        fee: mergedEstimates.fee,
        gasLimit: mergedEstimates.gasLimit,
        storageLimit: mergedEstimates.storageLimit,
        proof,
      },
      pkh,
      publicKey
    );

    const ops = this.convertIntoArray(op);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
   * @description Method to prepare an origination operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async originate<TContract extends DefaultContractType = DefaultContractType>(
    { fee, storageLimit, gasLimit, ...rest }: OriginateParams<ContractStorageType<TContract>>,
    source?: string
  ): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createOriginationOperation(
      await this.context.parser.prepareCodeOrigination({
        ...rest,
        ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
      })
    );

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
  async transaction({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: TransferParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);
    const op = await createTransferOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
   * @description Method to prepare a stake pseudo-operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async stake({ fee, storageLimit, gasLimit, ...rest }: StakeParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);
    const op = await createTransferOperation({
      ...rest,
      to: pkh,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
      parameter: {
        entrypoint: 'stake',
        value: {
          prim: 'Unit',
        },
      },
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);
    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
   * @description Method to prepare a unstake pseudo-operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async unstake({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: UnstakeParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);
    const op = await createTransferOperation({
      ...rest,
      to: pkh,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
      parameter: {
        entrypoint: 'unstake',
        value: { prim: 'Unit' },
      },
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);
    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
   * @description Method to prepare a finalize_unstake pseudo-operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async finalizeUnstake({
    fee,
    storageLimit,
    gasLimit,
    to,
    ...rest
  }: FinalizeUnstakeParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);
    const op = await createTransferOperation({
      ...rest,
      to: to ? to : pkh,
      amount: 0,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
      parameter: {
        entrypoint: 'finalize_unstake',
        value: { prim: 'Unit' },
      },
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);
    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
  async delegation({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: DelegateParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createSetDelegateOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
   * @description Method to prepare a register delegate operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async registerDelegate(
    { fee, storageLimit, gasLimit }: RegisterDelegateParams,
    source?: string
  ): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);
    const mergedEstimates = mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS);

    const op = await createRegisterDelegateOperation(
      {
        fee: mergedEstimates.fee,
        storageLimit: mergedEstimates.storageLimit,
        gasLimit: mergedEstimates.gasLimit,
      },
      pkh
    );

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
  async registerGlobalConstant({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: RegisterGlobalConstantParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createRegisterGlobalConstantOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
    { fee, storageLimit, gasLimit, ...rest }: UpdateConsensusKeyParams,
    source?: string
  ): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const [, pkPrefix] = b58DecodeAndCheckPrefix(rest.pk, publicKeyPrefixes);
    if (pkPrefix === PrefixV2.BLS12_381PublicKey) {
      if (!rest.proof) {
        throw new InvalidProofError('Proof is required to set a bls account as consensus key ');
      }
    } else {
      if (rest.proof) {
        throw new ProhibitedActionError(
          'Proof field is only allowed for a bls account as consensus key'
        );
      }
    }
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createUpdateConsensusKeyOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
   * @description Method to prepare an update_companion_key operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async updateCompanionKey(
    { fee, storageLimit, gasLimit, ...rest }: UpdateCompanionKeyParams,
    source?: string
  ): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const [, pkPrefix] = b58DecodeAndCheckPrefix(rest.pk, publicKeyPrefixes);
    if (pkPrefix !== PrefixV2.BLS12_381PublicKey) {
      throw new ProhibitedActionError('companion key must be a bls account');
    }
    if (!rest.proof) {
      throw new InvalidProofError('Proof is required to set a bls account as companion key ');
    }
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createUpdateCompanionKeyOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
  async increasePaidStorage({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: IncreasePaidStorageParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createIncreasePaidStorageOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
    const { pkh } = await this.getKeys();

    const op = await createBallotOperation({
      ...params,
    });

    const ops = this.convertIntoArray(op);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
    const { pkh } = await this.getKeys();

    const op = await createProposalsOperation({
      ...params,
    });

    const ops = this.convertIntoArray(op);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
    const { pkh } = await this.getKeys();

    const op = await createDrainDelegateOperation({
      ...params,
    });

    const ops = this.convertIntoArray(op);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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
  async transferTicket({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: TransferTicketParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createTransferTicketOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
  async smartRollupAddMessages({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: SmartRollupAddMessagesParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createSmartRollupAddMessagesOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);
    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
  async smartRollupOriginate({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: SmartRollupOriginateParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createSmartRollupOriginateOperation({
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
      ...rest,
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);
    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
   * @description Method to prepare a smart_rollup_execute_outbox_message operation
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  async smartRollupExecuteOutboxMessage({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: SmartRollupExecuteOutboxMessageParams): Promise<PreparedOperation> {
    const { pkh } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const op = await createSmartRollupExecuteOutboxMessageOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);
    const contents = this.constructOpContents(ops, headCounter, pkh, rest.source);

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
  async batch(batchParams: ParamsWithKind[], estimates?: Estimate[]): Promise<PreparedOperation> {
    const { pkh, publicKey } = await this.getKeys();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants, batchParams.length);
    const revealNeeded = await this.isRevealOpNeeded(batchParams, pkh);

    const ops: RPCOperation[] = [];
    if (!estimates) {
      for (const op of batchParams) {
        if (isOpWithFee(op)) {
          const limits = mergeLimits(op, DEFAULT_PARAMS);

          ops.push(await this.getRPCOp({ ...op, ...limits }));
        } else {
          ops.push({ ...op });
        }
      }
    } else {
      for (const op of batchParams) {
        if (isOpWithFee(op)) {
          const e = estimates.shift();
          const limits = mergeLimits(op, {
            fee: e!.suggestedFeeMutez,
            storageLimit: e!.storageLimit,
            gasLimit: e!.gasLimit,
          });
          ops.push(await this.getRPCOp({ ...op, ...limits }));
        } else {
          ops.push({ ...op });
        }
      }
    }

    if (revealNeeded) {
      if (!publicKey) {
        throw new PublicKeyNotFoundError(pkh);
      }
      const [, pkhPrefix] = b58DecodeAndCheckPrefix(pkh, publicKeyHashPrefixes);
      ops.unshift(
        await createRevealOperation(
          {
            fee: getRevealFee(pkh),
            storageLimit: REVEAL_STORAGE_LIMIT,
            gasLimit: getRevealGasLimit(pkh),
            proof:
              pkhPrefix === PrefixV2.BLS12_381PublicKeyHash
                ? (await this.signer.provePossession!()).prefixSig
                : undefined,
          },
          pkh,
          publicKey
        )
      );
    }

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();

    this.#counters = {};
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

    const { pkh } = await this.getKeys();

    this.#counters = {};
    const headCounter = parseInt(await this.getHeadCounter(pkh), 10);

    const params = contractMethod.toTransferParams();

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getOperationLimits(protocolConstants);

    const estimateLimits = mergeLimits(
      {
        fee: params.fee,
        storageLimit: params.storageLimit,
        gasLimit: params.gasLimit,
      },
      DEFAULT_PARAMS
    );

    const op = {
      kind: OpKind.TRANSACTION,
      fee: params.fee ?? estimateLimits.fee,
      gas_limit: params.gasLimit ?? estimateLimits.gasLimit,
      storage_limit: params.storageLimit ?? estimateLimits.storageLimit,
      amount: String(params.amount),
      destination: params.to,
      parameters: params.parameter,
    } as RPCOperation;

    const operation = await this.addRevealOperationIfNeeded(op, pkh);
    const ops = this.convertIntoArray(operation);

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
   * @description Method to convert a PreparedOperation to the params needed for the preapplyOperation method
   * @param prepared a Prepared Operation
   * @returns a PreapplyParams object
   */
  async toPreapply(prepared: PreparedOperation): Promise<PreapplyParams> {
    const {
      opOb: { contents, branch, protocol },
    } = prepared;
    const forgeParams = this.toForge(prepared);
    const forged = await this.context.forger.forge(forgeParams);
    const sig = await this.context.signer.sign(forged, new Uint8Array([3]));

    return [{ contents, branch, protocol, signature: sig.prefixSig }];
  }

  /**
   *
   * @description Method to convert a PreparedOperation to the params needed for forging
   * @param param a Prepared Operation
   * @returns a ForgeParams object
   */
  toForge({ opOb: { contents, branch } }: PreparedOperation): ForgeParams {
    return {
      branch,
      contents,
    };
  }
}
