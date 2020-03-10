import {
  OperationObject,
  InternalOperationResultKindEnum,
  OpKind,
  TransactionOperationParameter,
} from '@taquito/rpc';

export { OpKind } from '@taquito/rpc';

export type withKind<T, K extends OpKind> = T & { kind: K };

export type ParamsWithKind =
  | withKind<OriginateParams, OpKind.ORIGINATION>
  | withKind<DelegateParams, OpKind.DELEGATION>
  | withKind<TransferParams, OpKind.TRANSACTION>
  | withKind<ActivationParams, OpKind.ACTIVATION>;

export const findWithKind = <T extends { kind: OpKind }, K extends OpKind>(
  arr: T[],
  kind: K
): (T & { kind: K }) | undefined => {
  if (Array.isArray(arr)) {
    const found = arr.find(op => op.kind === kind);

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
  | RPCRevealOperation;
export type RPCOpWithSource =
  | RPCTransferOperation
  | RPCOriginationOperation
  | RPCDelegateOperation
  | RPCRevealOperation;

export const isOpWithFee = <T extends { kind: OpKind }>(
  op: T
): op is withKind<T, InternalOperationResultKindEnum> => {
  return ['transaction', 'delegation', 'origination', 'reveal'].indexOf(op.kind) !== -1;
};

export const isOpRequireReveal = <T extends { kind: OpKind }>(
  op: T
): op is withKind<T, Exclude<InternalOperationResultKindEnum, OpKind.REVEAL>> => {
  return ['transaction', 'delegation', 'origination'].indexOf(op.kind) !== -1;
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
  balance?: string;
  code: string | object[];
  delegate?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
};

/**
 * @description Parameters for originate method
 */
export type OriginateParams = OriginateParamsBase &
  (
    | {
        init?: never;
        storage: any;
      }
    | {
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
  delegate: string;
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
  delegate: string;
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

export type RPCOperation =
  | RPCOriginationOperation
  | RPCTransferOperation
  | RPCDelegateOperation
  | RPCRevealOperation
  | RPCActivateOperation;

export type PrepareOperationParams = {
  operation: RPCOperation | RPCOperation[];
  source?: string;
};
