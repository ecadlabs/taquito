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
  TxRollupOriginateParams,
  TxRollupBatchParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  UpdateConsensusKeyParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
} from '../operations/types';
import { Estimate } from './estimate';

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
   * @description Estimate gasLimit, storageLimit and fees for a tx rollup origination operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  txRollupOriginate(params: TxRollupOriginateParams): Promise<Estimate>;

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a tx rollup batch operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  txRollupSubmitBatch(params: TxRollupBatchParams): Promise<Estimate>;

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
   * @description Estimate gasLimit, storageLimit and fees for an Smart Rollup Originate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param SmartRollupOrigianteParams
   */
    smartRollupOriginate(params: SmartRollupOriginateParams): Promise<Estimate>;
}
