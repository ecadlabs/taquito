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

export interface EstimationProvider {
  /**
   *
   * Estimate gasLimit, storageLimit and fees for an origination operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params originate operation parameter
   */
  originate(params: OriginateParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an transfer operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   */
  transfer({ fee, storageLimit, gasLimit, ...rest }: TransferParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an stake pseudo-operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   */
  stake({ fee, storageLimit, gasLimit, ...rest }: StakeParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an unstake pseudo-operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   */
  unstake({ fee, storageLimit, gasLimit, ...rest }: UnstakeParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an finalize_unstake pseudo-operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   */
  finalizeUnstake({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: FinalizeUnstakeParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an transferTicket operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   */
  transferTicket({ fee, storageLimit, gasLimit, ...rest }: TransferTicketParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params delegate operation parameter
   */
  setDelegate(params: DelegateParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params registerDelegate operation parameter
   */
  registerDelegate(params?: RegisterDelegateParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for a reveal operation
   * @returns An estimation of gasLimit, storageLimit and fees for the operation or undefined if the account is already revealed
   *
   * @param params reveal operation parameter
   */
  reveal(params?: RevealParams): Promise<Estimate | undefined>;

  batch(params: ParamsWithKind[]): Promise<Estimate[]>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for registering an expression (registerGlobalConstant operation)
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params registerGlobalConstant operation parameter
   */
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an increase paid storage operation
   *
   * @returns An estimation of gasLimit, storageLimit, and fees for the operation
   *
   * @param params increasePaidStorage operation parameter
   */
  increasePaidStorage(params: IncreasePaidStorageParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an Update Consensus Key operation
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params updateConsensusKey operation parameter
   */
  updateConsensusKey(params: UpdateConsensusKeyParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an Update Companion Key operation
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params updateCompanionKey operation parameter
   */
  updateCompanionKey(params: UpdateCompanionKeyParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an Smart Rollup Add Messages operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params smartRollupAddMessages operation parameter
   */
  smartRollupAddMessages(params: SmartRollupAddMessagesParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for an Smart Rollup Execute Outbox Message operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params smartRollupExecuteOutboxMessage operation parameter
   */
  smartRollupExecuteOutboxMessage(params: SmartRollupExecuteOutboxMessageParams): Promise<Estimate>;

  /**
   *
   * Estimate gasLimit, storageLimit and fees for contract call
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the contract call
   *
   * @param contractMethod the contract method to estimate
   */
  contractCall(
    contractMethod: ContractMethodObject<ContractProvider>
  ): Promise<Estimate>;

  /**
   * Estimate gasLimit, storageLimit and fees for an Smart Rollup Originate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params smartRollupOriginate operation parameter
   */
  smartRollupOriginate(params: SmartRollupOriginateParams): Promise<Estimate>;
}
