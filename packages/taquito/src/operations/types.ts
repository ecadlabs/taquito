import { OperationObject } from '@taquito/rpc';

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
  // Proto 004
  spendable?: boolean;
  delegatable?: boolean;
} & ParamsWithCounter;

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

/**
 * @description RPC origination operation
 */
export interface RPCOriginationOperation {
  kind: 'origination';
  fee: number;
  gas_limit: number;
  storage_limit: number;
  balance: string;
  manager_pubkey: string;
  spendable: boolean;
  delegatable: boolean;
  delegate?: string;
  script: {
    code: any;
    storage: any;
  };
  counter?: string;
}

/**
 * @description RPC reveal operation
 */
export interface RPCRevealOperation {
  kind: 'reveal';
  fee: number;
  public_key: string;
  source: string;
  gas_limit: number;
  storage_limit: number;
  counter?: string;
}

/**
 * @description Result of a forge operation contains the operation plus its encoded version
 */
export interface ForgedBytes {
  opbytes: string;
  opOb: OperationObject;
  counter: number;
}

export interface ParamsWithCounter {
  counter?: number;
}

/**
 * @description Parameters for setDelegate method
 */
export interface DelegateParams extends ParamsWithCounter {
  source: string;
  delegate: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
}

/**
 * @description Parameters for registerDelegate method
 */
export interface RegisterDelegateParams extends ParamsWithCounter {
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
}

/**
 * @description RPC delegation operation
 */
export interface RPCDelegateOperation {
  kind: 'delegation';
  source?: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  delegate: string;
  counter?: string;
}

/**
 * @description Parameters for transfer method
 */
export interface TransferParams extends ParamsWithCounter {
  to: string;
  source?: string;
  amount: number;
  fee?: number;
  parameter?: string | object | { entrypoint: string; value: object };
  gasLimit?: number;
  storageLimit?: number;
  mutez?: boolean;
  rawParam?: boolean;
}

/**
 * @description RPC transfer operation
 */
export interface RPCTransferOperation {
  kind: 'transaction';
  fee: number;
  gas_limit: number;
  storage_limit: number;
  amount: string;
  destination: string;
  parameters?: any;
  counter?: string;
}

/**
 * @description RPC activate account operation
 */
export interface RPCActivateOperation {
  kind: 'activate_account';
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
