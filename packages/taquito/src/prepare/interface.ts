import { OperationContents } from '@taquito/rpc';
import { PrepareOperationParams } from '../operations/types';

/**
 * @description PrepareProvider is a utility class to output the prepared format of an operation
 */
export interface PreparationProvider {
  /**
   *
   * @description Method to prepare a reveal operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  reveal({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a origination operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  originate({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a transaction operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  transaction({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare an activation operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  activation({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a delegation operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  delegation({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a register_global_constant operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  registerGlobalConstant({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a tx_rollup_origination operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  txRollupOrigination({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a tx_rollup_submit_batch operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  txRollupSubmitBatch({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a update_consensus_key operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  updateConsensusKey({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a transfer_ticket operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  transferTicket({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a increase_paid_storage operation
   *
   * @param operation RPCOperation object or RPCOperation array
   * @param source string or undefined source pkh
   *
   * @returns a PreparedOperation object
   */
  increasePaidStorage({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a ballot operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
  ballot({ operation }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a proposals operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
  proposals({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a drain_delegate operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
  drainDelegate({ operation }: PrepareOperationParams): Promise<PreparedOperation>;

  /**
   *
   * @description Method to prepare a batch operation
   *
   * @param operation RPCOperation object or RPCOperation array
   *
   * @returns a PreparedOperation object
   */
  batch({ operation }: PrepareOperationParams): Promise<PreparedOperation>;
}

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: OperationContents[];
    protocol: string;
  };
  counter: number;
}
