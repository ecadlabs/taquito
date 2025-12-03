import { Context } from '../context';
import { ContractStorageType, DefaultContractType } from '../contract/contract';
import { ContractMethod } from '../contract/contract-methods/contract-method-flat-param';
import { SendParams } from '../contract/contract-methods/contract-method-interface';
import { ContractProvider } from '../contract/interface';
import {
  createOriginationOperation,
  createRegisterGlobalConstantOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  createSmartRollupAddMessagesOperation,
  createSmartRollupOriginateOperation,
  createSmartRollupExecuteOutboxMessageOperation,
  createUpdateConsensusKeyOperation,
  createUpdateCompanionKeyOperation,
} from '../contract/prepare';
import { BatchOperation } from '../operations/batch-operation';
import {
  ActivationParams,
  DelegateParams,
  OriginateParams,
  TransferParams,
  ParamsWithKind,
  RegisterGlobalConstantParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
  SmartRollupExecuteOutboxMessageParams,
  UpdateConsensusKeyParams,
  UpdateCompanionKeyParams,
} from '../operations/types';
import { OpKind } from '@taquito/rpc';
import { ContractMethodObject } from '../contract/contract-methods/contract-method-object-param';
import {
  b58DecodeAndCheckPrefix,
  PrefixV2,
  publicKeyPrefixes,
  validateAddress,
  validateKeyHash,
  ValidationResult,
} from '@taquito/utils';
import { EstimationProvider } from '../estimate/estimate-provider-interface';
import {
  InvalidAddressError,
  InvalidKeyHashError,
  InvalidOperationKindError,
  InvalidAmountError,
  InvalidProofError,
  ProhibitedActionError,
} from '@taquito/core';
import { Provider } from '../provider';
import { PrepareProvider } from '../prepare';

export const BATCH_KINDS = [
  OpKind.ACTIVATION,
  OpKind.ORIGINATION,
  OpKind.TRANSACTION,
  OpKind.DELEGATION,
];
export type BatchKinds =
  | OpKind.ACTIVATION
  | OpKind.ORIGINATION
  | OpKind.TRANSACTION
  | OpKind.DELEGATION;

export class OperationBatch extends Provider {
  private operations: ParamsWithKind[] = [];

  constructor(
    context: Context,
    private estimator: EstimationProvider
  ) {
    super(context);
  }

  private prepare = new PrepareProvider(this.context);

  /**
   *
   * @description Add a transaction operation to the batch
   *
   * @param params Transfer operation parameter
   */
  withTransfer(params: TransferParams) {
    const toValidation = validateAddress(params.to);
    if (params.amount < 0) {
      throw new InvalidAmountError(params.amount.toString());
    }
    if (toValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.to, toValidation);
    }
    this.operations.push({ kind: OpKind.TRANSACTION, ...params });
    return this;
  }

  /**
   *
   * @description Transfer tickets from a Tezos address (tz1,tz2 or tz3) to a smart contract address( KT1)
   *
   * @param params Transfer operation parameter
   */
  withTransferTicket(params: TransferTicketParams) {
    const destinationValidation = validateAddress(params.destination);
    if (destinationValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.destination, destinationValidation);
    }
    this.operations.push({ kind: OpKind.TRANSFER_TICKET, ...params });
    return this;
  }

  /**
   *
   * @description Add a contract call to the batch
   *
   * @param params Call a contract method
   * @param options Generic operation parameters
   */
  withContractCall(
    params: ContractMethod<ContractProvider> | ContractMethodObject<ContractProvider>,
    options: Partial<SendParams> = {}
  ) {
    return this.withTransfer(params.toTransferParams(options));
  }

  /**
   *
   * @description Add a delegation operation to the batch
   *
   * @param params Delegation operation parameter
   */
  withDelegation(params: DelegateParams) {
    const sourceValidation = validateAddress(params.source ?? '');
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }
    const delegateValidation = validateAddress(params.delegate ?? '');
    if (params.delegate && delegateValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.delegate, delegateValidation);
    }
    this.operations.push({ kind: OpKind.DELEGATION, ...params });
    return this;
  }

  /**
   *
   * @description Add an activation operation to the batch
   *
   * @param params Activation operation parameter
   * @throws {@link InvalidKeyHashError}
   */
  withActivation({ pkh, secret }: ActivationParams) {
    const pkhValidation = validateKeyHash(pkh);
    if (pkhValidation !== ValidationResult.VALID) {
      throw new InvalidKeyHashError(pkh, pkhValidation);
    }
    this.operations.push({ kind: OpKind.ACTIVATION, pkh, secret });
    return this;
  }

  /**
   *
   * @description Add an origination operation to the batch
   *
   * @param params Origination operation parameter
   */
  withOrigination<TContract extends DefaultContractType = DefaultContractType>(
    params: OriginateParams<ContractStorageType<TContract>>
  ) {
    this.operations.push({ kind: OpKind.ORIGINATION, ...params });
    return this;
  }

  /**
   *
   * @description Add a register a global constant operation to the batch
   *
   * @param params RegisterGlobalConstant operation parameter
   */
  withRegisterGlobalConstant(params: RegisterGlobalConstantParams) {
    this.operations.push({ kind: OpKind.REGISTER_GLOBAL_CONSTANT, ...params });
    return this;
  }

  /**
   *
   * @description Add an increase paid storage operation to the batch
   *
   * @param params IncreasePaidStorage operation parameter
   */
  withIncreasePaidStorage(params: IncreasePaidStorageParams) {
    this.operations.push({ kind: OpKind.INCREASE_PAID_STORAGE, ...params });
    return this;
  }

  /**
   *
   * @description Add a update consensus key operation to the batch
   *
   * @param params UpdateConsensusKey operation parameter
   */
  withUpdateConsensusKey(params: UpdateConsensusKeyParams) {
    const [, pkPrefix] = b58DecodeAndCheckPrefix(params.pk, publicKeyPrefixes);
    if (pkPrefix === PrefixV2.BLS12_381PublicKey) {
      if (!params.proof) {
        throw new InvalidProofError('Proof is required to set a bls account as consensus key ');
      }
    } else {
      if (params.proof) {
        throw new ProhibitedActionError(
          'Proof field is only allowed for a bls account as consensus key'
        );
      }
    }
    this.operations.push({ kind: OpKind.UPDATE_CONSENSUS_KEY, ...params });
    return this;
  }

  /**
   *
   * @description Add a update companion key operation to the batch
   *
   * @param params UpdateCompanionKey operation parameter
   */
  withUpdateCompanionKey(params: UpdateCompanionKeyParams) {
    const [, pkPrefix] = b58DecodeAndCheckPrefix(params.pk, publicKeyPrefixes);
    if (pkPrefix !== PrefixV2.BLS12_381PublicKey) {
      throw new ProhibitedActionError('companion key must be a bls account');
    }
    if (!params.proof) {
      throw new InvalidProofError('Proof is required to set a bls account as companion key ');
    }
    this.operations.push({ kind: OpKind.UPDATE_COMPANION_KEY, ...params });
    return this;
  }

  /**
   *
   * @description Add a smart rollup add messages operation to the batch
   *
   * @param params Rollup origination operation parameter
   */
  withSmartRollupAddMessages(params: SmartRollupAddMessagesParams) {
    this.operations.push({ kind: OpKind.SMART_ROLLUP_ADD_MESSAGES, ...params });
    return this;
  }

  /**
   *
   * @description Add a smart rollup originate operation to the batch
   *
   * @param params Smart Rollup Originate operation parameter
   */
  withSmartRollupOriginate(params: SmartRollupOriginateParams) {
    this.operations.push({ kind: OpKind.SMART_ROLLUP_ORIGINATE, ...params });
    return this;
  }

  /**
   *
   * @description Add a smart rollup execute outbox message to the batch
   *
   * @param params Smart Rollup Execute Outbox Message operation parameter
   */
  withSmartRollupExecuteOutboxMessage(params: SmartRollupExecuteOutboxMessageParams) {
    this.operations.push({ kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE, ...params });
    return this;
  }

  async getRPCOp(param: ParamsWithKind) {
    switch (param.kind) {
      case OpKind.TRANSACTION:
        return createTransferOperation({
          ...param,
        });
      case OpKind.ORIGINATION:
        return createOriginationOperation(
          await this.context.parser.prepareCodeOrigination({
            ...param,
          })
        );
      case OpKind.DELEGATION:
        return createSetDelegateOperation({
          ...param,
        });
      case OpKind.REGISTER_GLOBAL_CONSTANT:
        return createRegisterGlobalConstantOperation({
          ...param,
        });
      case OpKind.INCREASE_PAID_STORAGE:
        return createIncreasePaidStorageOperation({
          ...param,
        });
      case OpKind.UPDATE_CONSENSUS_KEY:
        return createUpdateConsensusKeyOperation({
          ...param,
        });
      case OpKind.UPDATE_COMPANION_KEY:
        return createUpdateCompanionKeyOperation({
          ...param,
        });
      case OpKind.TRANSFER_TICKET:
        return createTransferTicketOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_ADD_MESSAGES:
        return createSmartRollupAddMessagesOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_ORIGINATE:
        return createSmartRollupOriginateOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE:
        return createSmartRollupExecuteOutboxMessageOperation({
          ...param,
        });
      default:
        throw new InvalidOperationKindError(JSON.stringify((param as any).kind));
    }
  }

  /**
   *
   * @description Add a group operation to the batch. Operation will be applied in the order they are in the params array
   *
   * @param params Operations parameter
   * @throws {@link InvalidOperationKindError}
   */
  with(params: ParamsWithKind[]) {
    for (const param of params) {
      switch (param.kind) {
        case OpKind.TRANSACTION:
          this.withTransfer(param);
          break;
        case OpKind.ORIGINATION:
          this.withOrigination(param);
          break;
        case OpKind.DELEGATION:
          this.withDelegation(param);
          break;
        case OpKind.ACTIVATION:
          this.withActivation(param);
          break;
        case OpKind.REGISTER_GLOBAL_CONSTANT:
          this.withRegisterGlobalConstant(param);
          break;
        case OpKind.INCREASE_PAID_STORAGE:
          this.withIncreasePaidStorage(param);
          break;
        case OpKind.TRANSFER_TICKET:
          this.withTransferTicket(param);
          break;
        case OpKind.SMART_ROLLUP_ADD_MESSAGES:
          this.withSmartRollupAddMessages(param);
          break;
        case OpKind.SMART_ROLLUP_ORIGINATE:
          this.withSmartRollupOriginate(param);
          break;
        case OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE:
          this.withSmartRollupExecuteOutboxMessage(param);
          break;
        default:
          throw new InvalidOperationKindError(JSON.stringify((param as any).kind));
      }
    }

    return this;
  }

  /**
   *
   * @description Forge and Inject the operation batch
   *
   * @param params Optionally specify the source of the operation
   */
  async send(params?: { source?: string }) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const source = (params && params.source) || publicKeyHash;
    const estimates = await this.estimator.batch(this.operations);

    if (estimates.length !== this.operations.length) {
      estimates.shift();
    }
    const preparedOp = await this.prepare.batch(this.operations, estimates);

    const opBytes = await this.forge(preparedOp);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new BatchOperation(
      hash,
      preparedOp.opOb.contents,
      source,
      forgedBytes,
      opResponse,
      context
    );
  }
}

export class RPCBatchProvider {
  constructor(
    private context: Context,
    private estimator: EstimationProvider
  ) {}

  /***
   *
   * @description Batch a group of operation together. Operations will be applied in the order in which they are added to the batch
   *
   * @param params List of operation to batch together
   */
  batch(params?: ParamsWithKind[]) {
    const batch = new OperationBatch(this.context, this.estimator);

    if (Array.isArray(params)) {
      batch.with(params);
    }

    return batch;
  }
}
