import {
  OriginateParams,
  TransferParams,
  DelegateParams,
  RegisterDelegateParams,
  ParamsWithKind,
} from '../operations';
import { RevealParams, RegisterGlobalConstantParams } from '../operations/types';
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
   * @returns An estimation of gasLimit, storageLimit and fees for the operation or undefined if the account is already revealed
   *
   * @param params registerGlobalConstant operation parameter
   */
  registerGlobalConstant(params: RegisterGlobalConstantParams): Promise<Estimate>;
}
