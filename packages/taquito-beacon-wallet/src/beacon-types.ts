/**
 * @packageDocumentation
 * @module @taquito/beacon-wallet
 */

import { PartialTezosOperation, TezosOperationType } from "@airgap/beacon-dapp";
import { ScriptedContracts, PvmKind } from "@taquito/rpc";
import {
  ActivationParams,
  DelegateParams,
  FailingNoopParams,
  IncreasePaidStorageParams,
  OriginateParams,
  ParamsWithKind,
  RegisterGlobalConstantParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
  SmartRollupExecuteOutboxMessageParams,
  TransferParams,
  TransferTicketParams,
  UpdateConsensusKeyParams,
  OpKind,
  withKind,
} from "@taquito/taquito";

export function convertToPartialParamsWithKind(op: PartialTezosOperation): ParamsWithKind {
  switch (op.kind) {
    case TezosOperationType.ACTIVATE_ACCOUNT:
      return {
        kind: OpKind.ACTIVATION,
        pkh: op.pkh,
        secret: op.secret,
      } as withKind<ActivationParams, OpKind.ACTIVATION>;

    case TezosOperationType.DELEGATION:
      return {
        kind: OpKind.DELEGATION,
        source: op.source ?? "source not provided",
        delegate: op.delegate,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
      } as withKind<DelegateParams, OpKind.DELEGATION>;

    case TezosOperationType.FAILING_NOOP:
      return {
        kind: OpKind.FAILING_NOOP,
        arbitrary: op.arbitrary,
        basedOnBlock: 'head',
      } as withKind<FailingNoopParams, OpKind.FAILING_NOOP>;

    case TezosOperationType.INCREASE_PAID_STORAGE:
      return {
        kind: OpKind.INCREASE_PAID_STORAGE,
        source: op.source,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
        amount: Number(op.amount),
        destination: op.destination,
      } as withKind<IncreasePaidStorageParams, OpKind.INCREASE_PAID_STORAGE>;

    case TezosOperationType.ORIGINATION:
      return {
        kind: OpKind.ORIGINATION,
        balance: Number(op.balance),
        // script is a string by mistake. See https://github.com/airgap-it/beacon-sdk/pull/806
        code: (op.script as unknown as ScriptedContracts).code,
        init: (op.script as unknown as ScriptedContracts).storage,
        delegate: op.delegate,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
      } as withKind<OriginateParams, OpKind.ORIGINATION>;

    case TezosOperationType.REGISTER_GLOBAL_CONSTANT:
      return {
        kind: OpKind.REGISTER_GLOBAL_CONSTANT,
        source: op.source,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
        value: op.value,
      } as withKind<RegisterGlobalConstantParams, OpKind.REGISTER_GLOBAL_CONSTANT>;

    case TezosOperationType.SMART_ROLLUP_ADD_MESSAGES:
      return {
        kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
        source: op.source,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
        message: op.message,
      } as withKind<SmartRollupAddMessagesParams, OpKind.SMART_ROLLUP_ADD_MESSAGES>;

    case TezosOperationType.SMART_ROLLUP_ORIGINATE:
      if (!Object.values(PvmKind).includes(op.pvm_kind)) {
        throw new Error(`Invalid PvmKind: ${op.pvm_kind}`);
      }
      return {
        kind: OpKind.SMART_ROLLUP_ORIGINATE,
        source: op.source,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
        pvmKind: op.pvm_kind,
        kernel: op.kernel,
        parametersType: op.parameters_ty,
      } as withKind<SmartRollupOriginateParams, OpKind.SMART_ROLLUP_ORIGINATE>;

    case TezosOperationType.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE:
      return {
        kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
        source: op.source,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
        rollup: op.rollup,
        cementedCommitment: op.cemented_commitment,
        outputProof: op.output_proof,
      } as withKind<SmartRollupExecuteOutboxMessageParams, OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE>;

    case TezosOperationType.TRANSACTION:
      return {
        kind: OpKind.TRANSACTION,
        to: op.destination,
        amount: Number(op.amount),
        mutez: true,
        source: op.source,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
        parameter: op.parameters,
      } as withKind<TransferParams, OpKind.TRANSACTION>;

    case TezosOperationType.TRANSFER_TICKET:
      return {
        kind: OpKind.TRANSFER_TICKET,
        source: op.source,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
        ticketContents: op.ticket_contents,
        ticketTy: op.ticket_ty,
        ticketTicketer: op.ticket_ticketer,
        ticketAmount: Number(op.ticket_amount),
        destination: op.destination,
        entrypoint: op.entrypoint,
      } as withKind<TransferTicketParams, OpKind.TRANSFER_TICKET>;

    case TezosOperationType.UPDATE_CONSENSUS_KEY:
      return {
        kind: OpKind.UPDATE_CONSENSUS_KEY,
        source: op.source,
        fee: op.fee ? Number(op.fee) : undefined,
        gasLimit: op.gas_limit ? Number(op.gas_limit) : undefined,
        storageLimit: op.storage_limit ? Number(op.storage_limit) : undefined,
        pk: op.pk,
      } as withKind<UpdateConsensusKeyParams, OpKind.UPDATE_CONSENSUS_KEY>;

    default:
      throw new Error(`Operation kind is not part of ParamsWithKind: ${op.kind}`);
  }
}
