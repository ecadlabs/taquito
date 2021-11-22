import { BigMapKeyType, MichelsonMap, MichelsonMapKey, Schema } from '@taquito/michelson-encoder';
import { SaplingDiffResponse } from '@taquito/rpc';
import { OperationBatch } from '../batch/rpc-batch-provider';
import { Context } from '../context';
import { DelegateOperation } from '../operations/delegate-operation';
import { OriginationOperation } from '../operations/origination-operation';
import { RegisterGlobalConstantOperation } from '../operations/register-global-constant-operation';
import { RevealOperation } from '../operations/reveal-operation';
import { TransactionOperation } from '../operations/transaction-operation';
import {
  DelegateParams,
  OriginateParams,
  TransferParams,
  RegisterDelegateParams,
  ParamsWithKind,
  RevealParams,
  RegisterGlobalConstantParams,
} from '../operations/types';
import { ContractAbstraction } from './contract';
import { Estimate } from './estimate';

export type ContractSchema = Schema | unknown;

export interface EstimationProvider {
  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an origination operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  originate(params: OriginateParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an transfer operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  transfer({ fee, storageLimit, gasLimit, ...rest }: TransferParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  setDelegate(params: DelegateParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  registerDelegate(params?: RegisterDelegateParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a reveal operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation or undefined if the account is already revealed
   *
   * @param Estimate
   */
  reveal(params?: RevealParams): Promise<Estimate | undefined> ;

  batch(params: ParamsWithKind[]): Promise<Estimate[]>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for registering an expression (registerGlobalConstant operation) 
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation or undefined if the account is already revealed
   *
   * @param params registerGlobalConstant operation parameter
   */
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<Estimate>;
}

export interface StorageProvider {
  /**
   *
   * @description Return a well formatted json object of the contract storage
   *
   * @param contract contract address you want to get the storage from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
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
   * @deprecated Deprecated in favor of getBigMapKeyByID
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
   */
  getBigMapKey<T>(contract: string, key: string, schema?: ContractSchema): Promise<T>;

  /**
   *
   * @description Return a well formatted json object of a big map value
   *
   * @param id Big Map ID
   * @param keyToEncode key to query (will be encoded properly according to the schema)
   * @param schema Big Map schema (can be determined using your contract type)
   * @param block optional block level to fetch the value from
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-big-maps-big-map-id-script-expr
   */
  getBigMapKeyByID<T>(id: string, keyToEncode: BigMapKeyType, schema: Schema, block?: number): Promise<T>;

  /**
   *
   * @description Fetch multiple values in a big map
   *
   * @param id Big Map ID
   * @param keysToEncode Array of keys to query (will be encoded properly according to the schema)
   * @param schema Big Map schema (can be determined using your contract type)
   * @param block optional block level to fetch the values from
   * @param batchSize optional batch size representing the number of requests to execute in parallel
   * @returns An object containing the keys queried in the big map and their value in a well-formatted JSON object format
   *
   */
   getBigMapKeysByID<T>(id: string, keysToEncode: Array<BigMapKeyType>, schema: Schema, block?: number, batchSize?: number): Promise<MichelsonMap<MichelsonMapKey, T | undefined>>;

  /**
   *
   * @description Return a well formatted json object of a sapling state
   *
   * @param id Sapling state ID
   * @param block optional block level to fetch the value from
   *
   */
   getSaplingDiffByID(id: string, block?: number): Promise<SaplingDiffResponse>;
}

export interface ContractProvider extends StorageProvider {
  /**
   *
   * @description Originate a new contract according to the script in parameters. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param OriginationOperation Originate operation parameter
   */
  originate(contract: OriginateParams): Promise<OriginationOperation>;

  /**
   *
   * @description Set the delegate for a contract. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param SetDelegate operation parameter
   */
  setDelegate(params: DelegateParams): Promise<DelegateOperation>;

  /**
   *
   * @description Register the current address as delegate. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param RegisterDelegate operation parameter
   */
  registerDelegate(params: RegisterDelegateParams): Promise<DelegateOperation>;

  /**
   *
   * @description Transfer tz from current address to a specific address. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param Transfer operation parameter
   */
  transfer(params: TransferParams): Promise<TransactionOperation>;

  /**
   *
   * @description Reveal the current address. Will throw an error if the address is already revealed.
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param Reveal operation parameter
   */
  reveal(params: RevealParams): Promise<RevealOperation>;

  at<T extends ContractAbstraction<ContractProvider>>(address: string, contractAbstractionComposer?: (abs: ContractAbstraction<ContractProvider>, context: Context) => T): Promise<T>;

  /**
   *
   * @description Batch a group of operation together. Operations will be applied in the order in which they are added to the batch
   *
   * @param params List of operation to batch together
   */
  batch(params?: ParamsWithKind[]): OperationBatch ;

  /**
   *
   * @description Register a Micheline expression in a global table of constants. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param params registerGlobalConstant operation parameter
   */
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<RegisterGlobalConstantOperation>;
}
