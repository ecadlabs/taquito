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
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
  SmartRollupExecuteOutboxMessageParams,
  StakeParams,
  UnstakeParams,
  FinalizeUnstakeParams,
} from '../operations/types';
import { Estimate } from './estimate';
import { ContractMethod, ContractMethodObject, ContractProvider } from '../contract';

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
   * @description Estimate gasLimit, storageLimit and fees for an stake pseudo-operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  stake({ fee, storageLimit, gasLimit, ...rest }: StakeParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an unstake pseudo-operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  unstake({ fee, storageLimit, gasLimit, ...rest }: UnstakeParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an finalize_unstake pseudo-operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  finalizeUnstake({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: FinalizeUnstakeParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an transferTicket operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  transferTicket({ fee, storageLimit, gasLimit, ...rest }: TransferTicketParams): Promise<Estimate>;

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
  reveal(params?: RevealParams): Promise<Estimate | undefined>;

  batch(params: ParamsWithKind[]): Promise<Estimate[]>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for registering an expression (registerGlobalConstant operation)
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params registerGlobalConstant operation parameter
   */
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an increase paid storage operation
   *
   * @returns An estimation of gasLimit, storageLimit, and fees for the operation
   *
   * @param Estimate
   */
  increasePaidStorage(params: IncreasePaidStorageParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an Update Consensus Key operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  updateConsensusKey(params: UpdateConsensusKeyParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an Smart Rollup Add Messages operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  smartRollupAddMessages(params: SmartRollupAddMessagesParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an Smart Rollup Execute Outbox Message operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  smartRollupExecuteOutboxMessage(params: SmartRollupExecuteOutboxMessageParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for contract call
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the contract call
   *
   * @param Estimate
   */
  contractCall(
    contractMethod: ContractMethod<ContractProvider> | ContractMethodObject<ContractProvider>
  ): Promise<Estimate>;

  /**
   * @description Estimate gasLimit, storageLimit and fees for an Smart Rollup Originate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param SmartRollupOrigianteParams
   */
  smartRollupOriginate(params: SmartRollupOriginateParams): Promise<Estimate>;
}
