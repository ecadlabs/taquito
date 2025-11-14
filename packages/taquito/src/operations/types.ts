import {
  OperationObject,
  InternalOperationResultKindEnum,
  OpKind,
  TransactionOperationParameter,
  MichelsonV1Expression,
  BallotVote,
  PvmKind,
} from '@taquito/rpc';
import { BlockIdentifier } from '../read-provider/interface';

export { OpKind } from '@taquito/rpc';

export type withKind<T, K extends OpKind> = T & { kind: K };

export type ParamsWithKind =
  | withKind<OriginateParams, OpKind.ORIGINATION>
  | withKind<DelegateParams, OpKind.DELEGATION>
  | withKind<TransferParams, OpKind.TRANSACTION>
  | withKind<ActivationParams, OpKind.ACTIVATION>
  | withKind<RegisterGlobalConstantParams, OpKind.REGISTER_GLOBAL_CONSTANT>
  | withKind<IncreasePaidStorageParams, OpKind.INCREASE_PAID_STORAGE>
  | withKind<TransferTicketParams, OpKind.TRANSFER_TICKET>
  | withKind<UpdateConsensusKeyParams, OpKind.UPDATE_CONSENSUS_KEY>
  | withKind<UpdateCompanionKeyParams, OpKind.UPDATE_COMPANION_KEY>
  | withKind<SmartRollupAddMessagesParams, OpKind.SMART_ROLLUP_ADD_MESSAGES>
  | withKind<FailingNoopParams, OpKind.FAILING_NOOP>
  | withKind<SmartRollupOriginateParams, OpKind.SMART_ROLLUP_ORIGINATE>
  | withKind<SmartRollupExecuteOutboxMessageParams, OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE>;

export type ParamsWithKindExtended = ParamsWithKind | withKind<RevealParams, OpKind.REVEAL>;

export const attachKind = <T, K extends OpKind>(op: T, kind: K) => {
  return { ...op, kind } as withKind<T, K>;
};

export const findWithKind = <T extends { kind: OpKind }, K extends OpKind>(
  arr: T[],
  kind: K
): (T & { kind: K }) | undefined => {
  if (Array.isArray(arr)) {
    const found = arr.find((op) => op.kind === kind);

    if (found && isKind(found, kind)) {
      return found;
    }
  }
};

export const isKind = <T extends { kind: OpKind }, K extends OpKind>(
  op: T,
  kind: K
): op is withKind<T, K> => {
  return op.kind === kind;
};

export type RPCOpWithFee =
  | RPCTransferOperation
  | RPCOriginationOperation
  | RPCDelegateOperation
  | RPCRevealOperation
  | RPCRegisterGlobalConstantOperation
  | RPCIncreasePaidStorageOperation
  | RPCTransferTicketOperation
  | RPCUpdateConsensusKeyOperation
  | RPCUpdateCompanionKeyOperation
  | RPCSmartRollupAddMessagesOperation
  | RPCSmartRollupOriginateOperation
  | RPCSmartRollupOutboxMessageOperation;

export type RPCOpWithSource =
  | RPCTransferOperation
  | RPCOriginationOperation
  | RPCDelegateOperation
  | RPCRevealOperation
  | RPCRegisterGlobalConstantOperation
  | RPCIncreasePaidStorageOperation
  | RPCTransferTicketOperation
  | RPCUpdateConsensusKeyOperation
  | RPCUpdateCompanionKeyOperation
  | RPCSmartRollupAddMessagesOperation
  | RPCSmartRollupOriginateOperation
  | RPCSmartRollupOutboxMessageOperation
  | RPCBallotOperation
  | RPCProposalsOperation;

export const isOpWithGasBuffer = <T extends { kind: OpKind; destination?: string }>(
  op: T
): boolean => {
  if (op.kind === OpKind.TRANSACTION && op.destination?.startsWith('KT1')) {
    return true;
  } else {
    return (
      [
        'origination',
        'register_global_constant',
        'transfer_ticket',
        'update_consensus_key',
        'update_companion_key',
        'smart_rollup_add_messages',
        'smart_rollup_originate',
      ].indexOf(op.kind) !== -1
    );
  }
};

export const isOpWithFee = <T extends { kind: OpKind }>(
  op: T
): op is withKind<T, Exclude<Exclude<OpKind, OpKind.ACTIVATION>, OpKind.FAILING_NOOP>> => {
  return (
    [
      'transaction',
      'delegation',
      'origination',
      'reveal',
      'register_global_constant',
      'increase_paid_storage',
      'transfer_ticket',
      'update_consensus_key',
      'update_companion_key',
      'smart_rollup_add_messages',
      'smart_rollup_originate',
      'smart_rollup_execute_outbox_message',
    ].indexOf(op.kind) !== -1
  );
};

export const isOpRequireReveal = <T extends { kind: OpKind }>(
  op: T
): op is withKind<T, Exclude<InternalOperationResultKindEnum, OpKind.REVEAL>> => {
  return (
    [
      'transaction',
      'delegation',
      'origination',
      'register_global_constant',
      'increase_paid_storage',
      'transfer_ticket',
      'update_consensus_key',
      'update_companion_key',
      'smart_rollup_add_messages',
      'smart_rollup_originate',
      'smart_rollup_execute_outbox_message',
    ].indexOf(op.kind) !== -1
  );
};

export type SourceKinds = InternalOperationResultKindEnum;

export const isSourceOp = <T extends { kind: OpKind }>(op: T): op is withKind<T, SourceKinds> => {
  return ['transaction', 'delegation', 'origination', 'reveal', 'ballot'].indexOf(op.kind) !== -1;
};

export const hasMetadata = <T extends { kind: OpKind }, K>(
  op: T
): op is T & {
  metadata: K;
} => {
  return 'metadata' in op;
};

export const hasMetadataWithResult = <T extends { kind: OpKind }, K>(
  op: T
): op is T & {
  metadata: {
    operation_result: K;
  };
} => {
  return hasMetadata<T, any>(op) && 'operation_result' in op.metadata;
};

export const hasMetadataWithInternalOperationResult = <T extends { kind: OpKind }, K>(
  op: T
): op is T & {
  metadata: {
    internal_operation_results?: K;
  };
} => {
  return hasMetadata<T, any>(op) && 'internal_operation_results' in op.metadata;
};

export interface GasConsumingOperation {
  consumedGas?: string;
  gasLimit: number;
}

export interface StorageConsumingOperation {
  storageDiff?: string;
  storageSize?: string;
  storageLimit: number;
}

export interface FeeConsumingOperation {
  fee: number;
}

export type OriginateParamsBase = {
  balance?: string | number;
  code: string | object[];
  delegate?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  mutez?: boolean;
};

/**
 * @description Parameters for originate method
 */
export type OriginateParams<TStorage = any> = OriginateParamsBase &
  (
    | {
        init?: never;
        /** JS representation of a storage object */
        storage: TStorage;
      }
    | {
        /** Initial storage object value. Either Micheline or JSON encoded */
        init: string | object;
        storage?: never;
      }
  );

export interface ActivationParams {
  pkh: string;
  secret: string;
}

/**
 * @description RPC origination operation
 */
export interface RPCOriginationOperation {
  kind: OpKind.ORIGINATION;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  balance: string;
  delegate?: string;
  source?: string;
  script: {
    code: any;
    storage: any;
  };
}

/**
 * @description RPC reveal operation
 */
export interface RPCRevealOperation {
  kind: OpKind.REVEAL;
  fee: number;
  public_key: string;
  source?: string;
  gas_limit: number;
  storage_limit: number;
  proof?: string;
}

export interface RevealParams {
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  proof?: string;
}

/**
 * @description Result of a forge operation contains the operation plus its encoded version
 */
export interface ForgedBytes {
  opbytes: string;
  opOb: OperationObject;
  counter: number;
}

/**
 * @description Parameters for setDelegate method
 */
export interface DelegateParams {
  source: string;
  delegate?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
}

/**
 * @description Parameters for registerDelegate method
 */
export interface RegisterDelegateParams {
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
}

/**
 * @description RPC delegation operation
 */
export interface RPCDelegateOperation {
  kind: OpKind.DELEGATION;
  source?: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  delegate?: string;
}

/**
 * @description Parameters for transfer method
 */
export interface TransferParams {
  to: string;
  source?: string;
  amount: number;
  fee?: number;
  parameter?: TransactionOperationParameter;
  gasLimit?: number;
  storageLimit?: number;
  mutez?: boolean;
}

/**
 * @description RPC Stake pseudo operation params
 */
export interface StakeParams {
  to?: string;
  source?: string;
  amount: number;
  fee?: number;
  parameter?: TransactionOperationParameter;
  gasLimit?: number;
  storageLimit?: number;
  mutez?: boolean;
}

/**
 * @description RPC unstake pseudo operation params
 */
export interface UnstakeParams {
  to?: string;
  source?: string;
  amount: number;
  fee?: number;
  parameter?: TransactionOperationParameter;
  gasLimit?: number;
  storageLimit?: number;
  mutez?: boolean;
}

/**
 * @description RPC finalize_unstake pseudo operation params
 */
export interface FinalizeUnstakeParams {
  to?: string;
  source?: string;
  amount?: number;
  fee?: number;
  parameter?: TransactionOperationParameter;
  gasLimit?: number;
  storageLimit?: number;
  mutez?: boolean;
}

/**
 * @description RPC register global constant operation
 */
export interface RPCRegisterGlobalConstantOperation {
  kind: OpKind.REGISTER_GLOBAL_CONSTANT;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  source: string;
  value: MichelsonV1Expression;
}

/**
 * @description Parameters for the `registerGlobalConstant` method
 */
export interface RegisterGlobalConstantParams {
  value: MichelsonV1Expression;
  source?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
}

/**
 * @description RPC transfer operation
 */
export interface RPCTransferOperation {
  kind: OpKind.TRANSACTION;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  amount: string;
  source?: string;
  destination: string;
  parameters?: TransactionOperationParameter;
}

/**
 * @description RPC activate account operation
 */
export interface RPCActivateOperation {
  kind: OpKind.ACTIVATION;
  pkh: string;
  secret: string;
}

/**
 * @description Parameters for the transferTicket contract provider
 */
export interface TransferTicketParams {
  source?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  ticketContents: MichelsonV1Expression;
  ticketTy: MichelsonV1Expression;
  ticketTicketer: string;
  ticketAmount: number;
  destination: string;
  entrypoint: string;
}

/**
 * @description Rpc transfer-ticket operation
 */
export interface RPCTransferTicketOperation {
  kind: OpKind.TRANSFER_TICKET;
  source?: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  ticket_contents: MichelsonV1Expression;
  ticket_ty: MichelsonV1Expression;
  ticket_ticketer: string;
  ticket_amount: number;
  destination: string;
  entrypoint: string;
}

/**
 * @description Parameters for the increasePaidStorage method
 */
export interface IncreasePaidStorageParams {
  source?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  amount: number;
  destination: string;
}

/**
 * @description RPC IncreasePaidStorage operation
 */
export interface RPCIncreasePaidStorageOperation {
  kind: OpKind.INCREASE_PAID_STORAGE;
  source: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  amount: number;
  destination: string;
}

/**
 * @description Parameters for the DrainDelegate method
 */
export interface DrainDelegateParams {
  consensus_key: string;
  delegate: string;
  destination: string;
}

/**
 * @description RPC DrainDelegate operation
 */
export interface RPCDrainDelegateOperation {
  kind: OpKind.DRAIN_DELEGATE;
  consensus_key: string;
  delegate: string;
  destination: string;
}

/**
 * @description Ballot operation params
 */
export interface BallotParams {
  source?: string;
  proposal: string;
  ballot: BallotVote;
}

export interface RPCBallotOperation {
  kind: OpKind.BALLOT;
  source: string;
  period: number;
  proposal: string;
  ballot: BallotVote;
}

export interface ProposalsParams {
  source?: string;
  proposals: string[];
}

export interface RPCProposalsOperation {
  kind: OpKind.PROPOSALS;
  source: string;
  period: number;
  proposals: string[];
}

export interface UpdateConsensusKeyParams {
  source?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  pk: string;
  proof?: string;
}

export interface RPCUpdateConsensusKeyOperation {
  kind: OpKind.UPDATE_CONSENSUS_KEY;
  source: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  pk: string;
  proof?: string;
}

export interface UpdateCompanionKeyParams {
  source?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  pk: string;
  proof?: string;
}

export interface RPCUpdateCompanionKeyOperation {
  kind: OpKind.UPDATE_COMPANION_KEY;
  source: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  pk: string;
  proof?: string;
}

export interface SmartRollupAddMessagesParams {
  source?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  message: string[];
}

export interface RPCSmartRollupAddMessagesOperation {
  kind: OpKind.SMART_ROLLUP_ADD_MESSAGES;
  source: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  message: string[];
}

export interface SmartRollupOriginateParams {
  source?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  pvmKind: PvmKind;
  kernel: string;
  parametersType: MichelsonV1Expression;
}

export interface RPCSmartRollupOriginateOperation {
  kind: OpKind.SMART_ROLLUP_ORIGINATE;
  source: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  pvm_kind: PvmKind;
  kernel: string;
  parameters_ty: MichelsonV1Expression;
}

export interface SmartRollupExecuteOutboxMessageParams {
  source?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
  rollup: string;
  cementedCommitment: string;
  outputProof: string;
}

export interface RPCSmartRollupOutboxMessageOperation {
  kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE;
  source: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  rollup: string;
  cemented_commitment: string;
  output_proof: string;
}

/**
 * @description RPC failing noop operation
 */
export interface RPCFailingNoopOperation {
  kind: OpKind.FAILING_NOOP;
  arbitrary: string;
}

/**
 * @description Parameters for the `failingNoop` method
 */
export interface FailingNoopParams {
  arbitrary: string;
  basedOnBlock: BlockIdentifier;
}

export type RPCOperation =
  | RPCOriginationOperation
  | RPCTransferOperation
  | RPCDelegateOperation
  | RPCRevealOperation
  | RPCActivateOperation
  | RPCRegisterGlobalConstantOperation
  | RPCTransferTicketOperation
  | RPCIncreasePaidStorageOperation
  | RPCDrainDelegateOperation
  | RPCBallotOperation
  | RPCProposalsOperation
  | RPCUpdateConsensusKeyOperation
  | RPCUpdateCompanionKeyOperation
  | RPCSmartRollupAddMessagesOperation
  | RPCSmartRollupOriginateOperation
  | RPCSmartRollupOutboxMessageOperation
  | RPCFailingNoopOperation;

export type PrepareOperationParams = {
  operation: RPCOperation | RPCOperation[];
  source?: string;
};

export type ParamsWithOptionalFees = {
  fee?: number | string;
  storageLimit?: number | string;
  gasLimit?: number | string;
};
