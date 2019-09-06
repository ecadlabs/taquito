import { Schema } from '@tezos-ts/michelson-encoder';
import { Operation } from './operations';
import { OperationObject } from '@tezos-ts/rpc';

export interface OriginateParams {
  balance?: string;
  code: string;
  init: string;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
}

export interface OriginationOperation {
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

export interface RevealOperation {
  kind: 'reveal';
  fee: number;
  public_key: string;
  source: string;
  gas_limit: number;
  storage_limit: number;
}

export interface ForgedBytes {
  opbytes: string;
  opOb: OperationObject;
  counter: number;
}

export interface DelegateParams {
  source: string;
  delegate: string;
  fee?: number;
  gasLimit?: number;
  storageLimit?: number;
}

export interface DelegateOperation {
  kind: 'delegation';
  source?: string;
  fee: number;
  gas_limit: number;
  storage_limit: number;
  delegate: string;
}

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

export interface TransferOperation {
  kind: 'transaction';
  fee: number;
  gas_limit: number;
  storage_limit: number;
  amount: string;
  destination: string;
  parameters?: any;
}

export type PrepareOperationParams = {
  operation: OriginationOperation | TransferOperation | DelegateOperation | RevealOperation;
  source?: string;
};

export type ContractSchema = Schema | unknown;

export interface ContractProvider {
  /**
   *
   * @description Return a well formatted json object of the contract storage
   *
   * @param contract contract address you want to get the storage from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  getStorage<T>(contract: string, schema?: ContractSchema): Promise<T>;

  /**
   *
   * @description Return a well formatted json object of the contract big map storage
   *
   * @param contract contract address you want to get the storage from
   * @param key contract big map key to fetch value from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  getBigMapKey<T>(contract: string, key: string, schema?: ContractSchema): Promise<T>;

  /**
   *
   * @description Originate a new contract according to the script in parameters. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param OriginationOperation Originate operation parameter
   */
  originate(contract: OriginateParams): Promise<Operation>;

  /**
   *
   * @description Set the delegate for a contract. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param SetDelegate operation parameter
   */
  setDelegate(params: DelegateParams): Promise<Operation>;

  /**
   *
   * @description Register the current address as delegate. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param RegisterDelegate operation parameter
   */
  registerDelegate(params: DelegateParams): Promise<Operation>;
  /**
   *
   * @description Transfer tz from current address to a specific address. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param Transfer operation parameter
   */
  transfer(params: TransferParams): Promise<Operation>;
}
