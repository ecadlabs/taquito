import { OperationContents, PreapplyParams } from '@taquito/rpc';
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
  UpdateConsensusKeyParams,
  UpdateCompanionKeyParams,
  ActivationParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
} from '../operations/types';
import { ContractMethodObject } from '../contract/contract-methods/contract-method-object-param';
import { ContractProvider } from '../contract/interface';
import { ParamsWithKind } from '../operations/types';
import { ForgeParams } from '@taquito/local-forging';

/**
 * PrepareProvider is a utility class to output the prepared format of an operation
 */
export interface PreparationProvider {
  /**
   * Method to prepare an activation operation
   * @param params activation operation parameters
   * @returns a PreparedOperation object
   */
  activate(params: ActivationParams): Promise<PreparedOperation>;

  /**
   *
   * Method to prepare a reveal operation
   * @param params reveal operation parameters
   * @returns a PreparedOperation object
   */
  reveal(params: RevealParams): Promise<PreparedOperation>;

  /**
   * Method to prepare an origination operation
   * @param params originate operation parameters
   * @returns a PreparedOperation object
   */
  originate(params: OriginateParams): Promise<PreparedOperation>;

  /**
   *
   * Method to prepare a transaction operation
   *
   * @param params transaction operation parameters
   *
   * @returns a PreparedOperation object
   */
  transaction(params: TransferParams): Promise<PreparedOperation>;

  /**
   *
   * Method to prepare a delegation operation
   * @param params delegation operation parameters
   * @returns a PreparedOperation object
   */
  delegation(params: DelegateParams): Promise<PreparedOperation>;

  /**
   * Method to prepare a register_global_constant operation
   * @param params registerGlobalConstant operation parameters
   * @returns a PreparedOperation object
   */
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<PreparedOperation>;

  /**
   * Method to prepare an update_consensus_key operation
   * @param params updateConsensusKey operation parameters
   * @returns a PreparedOperation object
   */
  updateConsensusKey(params: UpdateConsensusKeyParams): Promise<PreparedOperation>;

  /**
   * Method to prepare an update_companion_key operation
   * @param params updateCompanionKey operation parameters
   * @returns a PreparedOperation object
   */
  updateCompanionKey(params: UpdateCompanionKeyParams): Promise<PreparedOperation>;

  /**
   *
   * Method to prepare a transfer_ticket operation
   * @param params TransferTicket operation parameters
   * @returns a PreparedOperation object
   */
  transferTicket(params: TransferTicketParams): Promise<PreparedOperation>;

  /**
   * Method to prepare an increase_paid_storage operation
   * @param params increasePaidStorage operation parameters
   * @returns a PreparedOperation object
   */
  increasePaidStorage(params: IncreasePaidStorageParams): Promise<PreparedOperation>;

  /**
   * Method to prepare a ballot operation
   * @param params ballot operation parameters
   * @returns a PreparedOperation object
   */
  ballot(params: BallotParams): Promise<PreparedOperation>;

  /**
   *
   * Method to prepare a proposals operation
   * @param params proposals operation parameters
   * @returns a PreparedOperation object
   */
  proposals(params: ProposalsParams): Promise<PreparedOperation>;

  /**
   * Method to prepare a drain_delegate operation
   * @param params drainDelegate operation parameters
   * @returns a PreparedOperation object
   */
  drainDelegate(params: DrainDelegateParams): Promise<PreparedOperation>;

  /**
   * Method to prepare a smart_rollup_add_messages operation
   * @param params smartRollupAddMessages operation parameters
   * @returns a PreparedOperation object
   */
  smartRollupAddMessages(params: SmartRollupAddMessagesParams): Promise<PreparedOperation>;

  /**
   * Method to prepare a smart_rollup_originate operation
   * @param params smartRollupOriginate operation parameters
   * @returns a PreparedOperation object
   */
  smartRollupOriginate(params: SmartRollupOriginateParams): Promise<PreparedOperation>;

  /**
   *
   * Method to prepare a batch operation
   * @param batchParams batch operation parameters
   * @returns a PreparedOperation object
   */
  batch(batchParams: ParamsWithKind[]): Promise<PreparedOperation>;

  /**
   * Method to prepare a contract call (transfer) operation
   * @param contractMethod ContractMethodObject retrieved from smart contract
   * @returns a PreparedOperation object
   */
  contractCall(contractMethod: ContractMethodObject<ContractProvider>): Promise<PreparedOperation>;

  /**
   *
   * Method to convert a PreparedOperation to the params needed for the preapplyOperation method
   * @param prepared a Prepared Operation
   * @returns a PreapplyParams object
   */
  toPreapply(prepared: PreparedOperation): Promise<PreapplyParams>;

  /**
   *
   * Method to convert a PreparedOperation to the params needed for forging
   * @param param a Prepared Operation
   * @returns a ForgeParams object
   */
  toForge(param: PreparedOperation): ForgeParams;
}

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: OperationContents[];
    protocol: string;
  };
  counter: number;
  simulation?: {
    /**
     * Indexes of operation contents whose gas limit was auto-assigned for simulation.
     * This mirrors octez-client's `may_patch_limits` behavior, which tracks manager
     * operations with unknown gas limits and rebalances only that set against the
     * block gas budget during simulation.
     */
    gasLimitPatchableIndexes?: number[];
  };
}
