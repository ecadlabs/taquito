import {
  OriginateParams,
  TransferParams,
  DelegateParams,
  RegisterDelegateParams,
  ParamsWithKind,
} from '../operations';
import {
  RevealParams,
  RegisterGlobalConstantParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  UpdateConsensusKeyParams,
  UpdateCompanionKeyParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
  SmartRollupExecuteOutboxMessageParams,
  StakeParams,
  UnstakeParams,
  FinalizeUnstakeParams,
} from '../operations/types';
import { Estimate } from './estimate';
import { ContractMethodObject, ContractProvider } from '../contract';

/**
 * Public estimation API used by `TezosToolkit.estimate`.
 *
 * Estimation is simulation-based: Taquito prepares an unsigned operation, simulates it on the
 * current head, and derives recommended limits/fees from the simulation result.
 *
 * Returned values are best-effort recommendations for the current chain state and mempool
 * conditions. They are not an inclusion guarantee.
 */
export interface EstimationProvider {
  /**
   * Estimate gas/storage/fee for an origination.
   *
   * @param params Origination parameters.
   * @returns Recommended limits and fees for the operation.
   */
  originate(params: OriginateParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for a transaction.
   *
   * If `gasLimit`, `storageLimit`, or `fee` are provided they are used as simulation inputs.
   * Otherwise Taquito fills defaults from protocol constants.
   *
   * @param params Transfer parameters.
   * @returns Recommended limits and fees for the operation.
   */
  transfer(params: TransferParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for the `stake` pseudo-operation.
   *
   * @param params Stake parameters.
   * @returns Recommended limits and fees for the operation.
   */
  stake(params: StakeParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for the `unstake` pseudo-operation.
   *
   * @param params Unstake parameters.
   * @returns Recommended limits and fees for the operation.
   */
  unstake(params: UnstakeParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for the `finalize_unstake` pseudo-operation.
   *
   * @param params Finalize-unstake parameters.
   * @returns Recommended limits and fees for the operation.
   */
  finalizeUnstake(params: FinalizeUnstakeParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for a `transfer_ticket` operation.
   *
   * @param params Ticket transfer parameters.
   * @returns Recommended limits and fees for the operation.
   */
  transferTicket(params: TransferTicketParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for `set_delegate`.
   *
   * @param params Delegate parameters.
   * @returns Recommended limits and fees for the operation.
   */
  setDelegate(params: DelegateParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for delegate registration (`delegate = source`).
   *
   * @param params Register-delegate parameters.
   * @returns Recommended limits and fees for the operation.
   */
  registerDelegate(params?: RegisterDelegateParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for an explicit reveal.
   *
   * @param params Reveal parameters.
   * @returns Estimate for reveal, or `undefined` if the account is already revealed.
   */
  reveal(params?: RevealParams): Promise<Estimate | undefined>;

  /**
   * Estimate gas/storage/fee for each operation in a manager-operation batch.
   *
   * If a reveal is needed, its estimate is returned as the first element.
   *
   * For operations missing an explicit `gasLimit`, Taquito patches simulation gas using
   * protocol constants and block gas budget:
   * - count only ops that need gas patching
   * - subtract already-explicit gas from the block budget
   * - reserve reveal gas when reveal will be prepended
   * - divide remaining block gas across ops that need patching
   *
   * @param params Batch operation parameters.
   * @returns Per-operation estimates in simulation order.
   */
  batch(params: ParamsWithKind[]): Promise<Estimate[]>;

  /**
   * Estimate gas/storage/fee for `register_global_constant`.
   *
   * @param params Register-global-constant parameters.
   * @returns Recommended limits and fees for the operation.
   */
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for `increase_paid_storage`.
   *
   * @param params Increase-paid-storage parameters.
   * @returns Recommended limits and fees for the operation.
   */
  increasePaidStorage(params: IncreasePaidStorageParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for `update_consensus_key`.
   *
   * @param params Update-consensus-key parameters.
   * @returns Recommended limits and fees for the operation.
   */
  updateConsensusKey(params: UpdateConsensusKeyParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for `update_companion_key`.
   *
   * @param params Update-companion-key parameters.
   * @returns Recommended limits and fees for the operation.
   */
  updateCompanionKey(params: UpdateCompanionKeyParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for `smart_rollup_add_messages`.
   *
   * @param params Smart-rollup-add-messages parameters.
   * @returns Recommended limits and fees for the operation.
   */
  smartRollupAddMessages(params: SmartRollupAddMessagesParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for `smart_rollup_execute_outbox_message`.
   *
   * @param params Smart-rollup-execute-outbox-message parameters.
   * @returns Recommended limits and fees for the operation.
   */
  smartRollupExecuteOutboxMessage(params: SmartRollupExecuteOutboxMessageParams): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for a typed contract method call.
   *
   * @param contractMethod Contract method instance to estimate.
   * @returns Recommended limits and fees for the contract call.
   */
  contractCall(contractMethod: ContractMethodObject<ContractProvider>): Promise<Estimate>;

  /**
   * Estimate gas/storage/fee for `smart_rollup_originate`.
   *
   * @param params Smart-rollup-originate parameters.
   * @returns Recommended limits and fees for the operation.
   */
  smartRollupOriginate(params: SmartRollupOriginateParams): Promise<Estimate>;
}
