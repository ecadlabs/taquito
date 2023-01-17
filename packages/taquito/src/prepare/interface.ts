import { OperationContents } from '@taquito/rpc';
import {
  BallotParams,
  DelegateParams,
  DrainDelegateParams,
  IncreasePaidStorageParams,
  OriginateParams,
  ProposalsParams,
  RegisterGlobalConstantParams,
  RevealParams,
  TransferParams,
  TransferTicketParams,
  TxRollupBatchParams,
  TxRollupOriginateParams,
  UpdateConsensusKeyParams,
} from '../operations/types';
import { ContractMethod } from '../contract/contract-methods/contract-method-flat-param';
import { ContractMethodObject } from '../contract/contract-methods/contract-method-object-param';
import { ContractProvider } from '../contract/interface';
import { ParamsWithKind } from '../operations/types';

/**
 * @description PrepareProvider is a utility class to output the prepared format of an operation
 */
export interface PreparationProvider {
  /**
   *
   * @description Method to prepare a reveal operation
   * @param params reveal operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  reveal(params: RevealParams): Promise<PreparedOperation>;

  /**
   * @description Method to prepare an origination operation
   * @param params originate operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  originate(params: OriginateParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a transaction operation
   *
   * @param params transaction operation parameters
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  transaction(params: TransferParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a delegation operation
   * @param params delegation operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  delegation(params: DelegateParams): Promise<PreparedOperation>;

  /**
   * @description Method to prepare a register_global_constant operation
   * @param params registerGlobalConstant operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<PreparedOperation>;

  /**
   * @description Method to prepare a tx_rollup_origination operation
   * @param params txRollupOrigination operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  txRollupOrigination(params: TxRollupOriginateParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a tx_rollup_submit_batch operation
   * @param params txRollupSubmitBatch operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  txRollupSubmitBatch(params: TxRollupBatchParams): Promise<PreparedOperation>;

  /**
   * @description Method to prepare an update_consensus_key operation
   * @param params updateConsensusKey operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  updateConsensusKey(params: UpdateConsensusKeyParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a transfer_ticket operation
   * @param params TransferTicketx operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  transferTicket(params: TransferTicketParams): Promise<PreparedOperation>;

  /**
   * @description Method to prepare an increase_paid_storage operation
   * @param params increasePaidStorage operation parameters
   * @param source string or undefined source pkh
   * @returns a PreparedOperation object
   */
  increasePaidStorage(params: IncreasePaidStorageParams): Promise<PreparedOperation>;

  /**
   * @description Method to prepare a ballot operation
   * @param params ballot operation parameters
   * @returns a PreparedOperation object
   */
  ballot(params: BallotParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a proposals operation
   * @param params proposals operation parameters
   * @returns a PreparedOperation object
   */
  proposals(params: ProposalsParams): Promise<PreparedOperation>;

  /**
   * @description Method to prepare a drain_delegate operation
   * @param params drainDelegatex operation parameters
   * @returns a PreparedOperation object
   */
  drainDelegate(params: DrainDelegateParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a batch operation
   * @param params x operation parameters
   * @returns a PreparedOperation object
   */
  batch(batchParams: ParamsWithKind[]): Promise<PreparedOperation>;

  /**
   * @description Method to prepare a contract call (transfer) operation
   * @param contractMethod ContractMethod or ContractMethodObject retrieved from smart contract
   * @returns a PreparedOperation object
   */
  contractCall(
    contractMethod: ContractMethod<ContractProvider> | ContractMethodObject<ContractProvider>
  ): Promise<PreparedOperation>;
}

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: OperationContents[];
    protocol: string;
  };
  counter: number;
}
