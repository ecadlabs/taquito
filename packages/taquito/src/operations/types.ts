import { OperationObject } from '@taquito/rpc';

/**
 * @description Parameters for originate method
 */
export interface OriginateParams {
  balance?: string;
  code: string | object[];
  init?: string | object;
  storage?: any;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
}

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
 * @description Parameters for setDelegate and registerDelegate method
 */
export interface DelegateParams {
  source: string;
  delegate: string;
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
}

/**
 * @description Parameters for transfer method
 */
export interface TransferParams {
  to: string;
  source?: string;
  amount: number;
  fee?: number;
  parameter?: string;
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
