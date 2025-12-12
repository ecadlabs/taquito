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
  | withKind<SmartRollupExecuteOutboxMessageParams, OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE>
  | withKind<RevealParams, OpKind.REVEAL>;

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

const feeConsumingOpKinds = [
  OpKind.TRANSACTION,
  OpKind.DELEGATION,
  OpKind.ORIGINATION,
  OpKind.REVEAL,
  OpKind.REGISTER_GLOBAL_CONSTANT,
  OpKind.INCREASE_PAID_STORAGE,
  OpKind.TRANSFER_TICKET,
  OpKind.UPDATE_CONSENSUS_KEY,
  OpKind.UPDATE_COMPANION_KEY,
  OpKind.SMART_ROLLUP_ADD_MESSAGES,
  OpKind.SMART_ROLLUP_ORIGINATE,
  OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
] as const;

type FeeConsumingOpKind = (typeof feeConsumingOpKinds)[number];

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
): op is Extract<T, { kind: FeeConsumingOpKind }> =>
  feeConsumingOpKinds.includes(op.kind as FeeConsumingOpKind);

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
  /**
   * Initial contract balance.
   *
   * Interpreted as tez by default. Set `mutez: true` to pass this value in mutez.
   */
  balance?: string | number;
  /**
   * Contract code in Micheline JSON (`object[]`) or Michelson string.
   */
  code: string | object[];
  /**
   * Optional delegate for the originated contract.
   */
  delegate?: string;
  /**
   * Fee in mutez.
   *
   * If omitted, Taquito estimates and fills a fee.
   */
  fee?: number;
  /**
   * Gas limit.
   *
   * If omitted, Taquito derives it from protocol constants and simulation.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   *
   * If omitted, Taquito derives it from protocol constants and simulation.
   */
  storageLimit?: number;
  /**
   * When `true`, `balance` is interpreted as mutez.
   */
  mutez?: boolean;
};

/**
 * Parameters for originate method
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
 * RPC origination operation
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
 * RPC reveal operation
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
  /**
   * Reveal fee in mutez.
   */
  fee?: number;
  /**
   * Reveal gas limit.
   */
  gasLimit?: number;
  /**
   * Reveal storage limit.
   */
  storageLimit?: number;
  /**
   * Proof of possession for BLS (`tz4`) reveal.
   *
   * Required for BLS reveal and ignored for non-BLS sources.
   */
  proof?: string;
}

/**
 * Result of a forge operation contains the operation plus its encoded version
 */
export interface ForgedBytes {
  opbytes: string;
  opOb: OperationObject;
  counter: number;
}

/**
 * Parameters for setDelegate method
 */
export interface DelegateParams {
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Delegate address.
   *
   * Omit to clear delegation.
   */
  delegate?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
}

/**
 * Parameters for registerDelegate method
 */
export interface RegisterDelegateParams {
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
}

/**
 * RPC delegation operation
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
 * Parameters for transfer method
 */
export interface TransferParams {
  /**
   * Destination account or contract address.
   */
  to: string;
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Transfer amount.
   *
   * Interpreted as tez by default. Set `mutez: true` to pass mutez.
   */
  amount: number;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Optional transaction parameter for contract calls.
   */
  parameter?: TransactionOperationParameter;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * When `true`, `amount` is interpreted as mutez.
   */
  mutez?: boolean;
}

/**
 * RPC Stake pseudo operation params
 */
export interface StakeParams {
  /**
   * Destination staking contract/account.
   *
   * Defaults to source when omitted.
   */
  to?: string;
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Amount to stake.
   *
   * Interpreted as tez by default. Set `mutez: true` to pass mutez.
   */
  amount: number;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Optional RPC-level parameter override.
   */
  parameter?: TransactionOperationParameter;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * When `true`, `amount` is interpreted as mutez.
   */
  mutez?: boolean;
}

/**
 * RPC unstake pseudo operation params
 */
export interface UnstakeParams {
  /**
   * Destination staking contract/account.
   *
   * Defaults to source when omitted.
   */
  to?: string;
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Amount to unstake.
   *
   * Interpreted as tez by default. Set `mutez: true` to pass mutez.
   */
  amount: number;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Optional RPC-level parameter override.
   */
  parameter?: TransactionOperationParameter;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * When `true`, `amount` is interpreted as mutez.
   */
  mutez?: boolean;
}

/**
 * RPC finalize_unstake pseudo operation params
 */
export interface FinalizeUnstakeParams {
  /**
   * Destination account for finalized funds.
   *
   * Defaults to source when omitted.
   */
  to?: string;
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Transaction amount in mutez for the underlying `finalize_unstake` transaction.
   *
   * Protocol requires this to be `0` when present. Non-zero values are rejected with
   * `operations.invalid_nonzero_transaction_amount`.
   */
  amount?: number;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Optional RPC-level parameter override.
   */
  parameter?: TransactionOperationParameter;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * When `true`, numeric amounts are interpreted as mutez.
   */
  mutez?: boolean;
}

/**
 * RPC register global constant operation
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
 * Parameters for the `registerGlobalConstant` method
 */
export interface RegisterGlobalConstantParams {
  /**
   * Micheline expression to register.
   */
  value: MichelsonV1Expression;
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
}

/**
 * RPC transfer operation
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
 * RPC activate account operation
 */
export interface RPCActivateOperation {
  kind: OpKind.ACTIVATION;
  pkh: string;
  secret: string;
}

/**
 * Parameters for the transferTicket contract provider
 */
export interface TransferTicketParams {
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * Ticket payload.
   */
  ticketContents: MichelsonV1Expression;
  /**
   * Ticket Micheline type.
   */
  ticketTy: MichelsonV1Expression;
  /**
   * Ticket ticketer contract address.
   */
  ticketTicketer: string;
  /**
   * Quantity of tickets to transfer.
   */
  ticketAmount: number;
  /**
   * Destination contract or implicit account.
   */
  destination: string;
  /**
   * Destination entrypoint name (1-31 bytes).
   *
   * For implicit destinations (`tz...`), this must be `default`; otherwise protocol
   * rejects with `michelson_v1.no_such_entrypoint`.
   */
  entrypoint: string;
}

/**
 * Rpc transfer-ticket operation
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
 * Parameters for the increasePaidStorage method
 */
export interface IncreasePaidStorageParams {
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * Additional storage bytes to pre-pay for the target contract.
   *
   * Must be a positive integer. Burn cost is `amount * cost_per_byte`.
   */
  amount: number;
  /**
   * Destination contract address.
   */
  destination: string;
}

/**
 * RPC IncreasePaidStorage operation
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
 * Parameters for the DrainDelegate method
 */
export interface DrainDelegateParams {
  consensus_key: string;
  delegate: string;
  destination: string;
}

/**
 * RPC DrainDelegate operation
 */
export interface RPCDrainDelegateOperation {
  kind: OpKind.DRAIN_DELEGATE;
  consensus_key: string;
  delegate: string;
  destination: string;
}

/**
 * Ballot operation params
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
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * New consensus public key.
   */
  pk: string;
  /**
   * BLS proof-of-possession for `pk`.
   *
   * Required when `pk` is a BLS (`tz4`) key, otherwise validation fails with
   * `validate.operation.missing_bls_proof`. Invalid proofs fail with
   * `validate.operation.incorrect_bls_proof`. Must be omitted for non-BLS keys.
   */
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
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * New companion public key (BLS).
   */
  pk: string;
  /**
   * BLS proof-of-possession for the companion key.
   *
   * Companion keys must be `tz4`; non-BLS keys fail with
   * `validate.operation.update_companion_key_not_tz4`.
   * Missing proof fails with `validate.operation.missing_bls_proof` and invalid proof
   * fails with `validate.operation.incorrect_bls_proof`.
   */
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
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * Hex-encoded message bytes posted to the global smart-rollup inbox.
   *
   * At least one message is required. Each message is limited to 4096 bytes after decoding.
   */
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
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * PVM kind for the rollup.
   */
  pvmKind: PvmKind;
  /**
   * Hex-encoded boot sector binary for the selected PVM.
   *
   * Effective size is constrained by the operation data size limit.
   */
  kernel: string;
  /**
   * Micheline type for L1-to-rollup deposited values.
   *
   * Must be a valid Michelson type accepted by protocol rollup parameter typing rules.
   */
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
  /**
   * Operation source. Defaults to the active signer pkh.
   */
  source?: string;
  /**
   * Fee in mutez.
   */
  fee?: number;
  /**
   * Gas limit.
   */
  gasLimit?: number;
  /**
   * Storage limit.
   */
  storageLimit?: number;
  /**
   * Target smart-rollup address (`sr1...`).
   */
  rollup: string;
  /**
   * Cemented commitment hash (`src1...`) referenced by the outbox proof.
   *
   * Must still be present in the chain of stored cemented commitments.
   */
  cementedCommitment: string;
  /**
   * Hex-encoded PVM outbox proof bytes produced by a rollup node.
   */
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
 * RPC failing noop operation
 */
export interface RPCFailingNoopOperation {
  kind: OpKind.FAILING_NOOP;
  arbitrary: string;
}

/**
 * Parameters for the `failingNoop` method
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
