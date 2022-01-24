import { PreapplyResponse, RPCRunOperationParam, OpKind, ConstantsResponse } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT } from '../constants';
import { OperationEmitter } from '../operations/operation-emitter';
import {
  flattenErrors,
  flattenOperationResult,
  TezosOperationError,
} from '../operations/operation-errors';
import {
  DelegateParams,
  isOpWithFee,
  OriginateParams,
  ParamsWithKind,
  PrepareOperationParams,
  RegisterDelegateParams,
  RPCOperation,
  TransferParams,
  RevealParams,
  RegisterGlobalConstantParams,
} from '../operations/types';
import { Estimate, EstimateProperties } from './estimate';
import { EstimationProvider } from './interface';
import {
  createOriginationOperation,
  createRegisterDelegateOperation,
  createRevealOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createRegisterGlobalConstantOperation,
} from './prepare';
import { validateAddress, InvalidAddressError, ValidationResult } from '@taquito/utils';
import { Contract } from './contract';

interface Limits {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
}

const mergeLimits = (
  userDefinedLimit: Limits,
  defaultLimits: Required<Limits>
): Required<Limits> => {
  return {
    fee: typeof userDefinedLimit.fee === 'undefined' ? defaultLimits.fee : userDefinedLimit.fee,
    gasLimit:
      typeof userDefinedLimit.gasLimit === 'undefined'
        ? defaultLimits.gasLimit
        : userDefinedLimit.gasLimit,
    storageLimit:
      typeof userDefinedLimit.storageLimit === 'undefined'
        ? defaultLimits.storageLimit
        : userDefinedLimit.storageLimit,
  };
};

// RPC requires a signature but does not verify it
const SIGNATURE_STUB =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

export class RPCEstimateProvider extends OperationEmitter implements EstimationProvider {
  private readonly ALLOCATION_STORAGE = 257;
  private readonly ORIGINATION_STORAGE = 257;
  private readonly OP_SIZE_REVEAL = 128;

  // Maximum values defined by the protocol
  private async getAccountLimits(pkh: string, constants: ConstantsResponse, numberOfOps?: number) {
    const balance = await this.rpc.getBalance(pkh);
    const {
      hard_gas_limit_per_operation,
      hard_gas_limit_per_block,
      hard_storage_limit_per_operation,
      cost_per_byte,
    } = constants;
    return {
      fee: 0,
      gasLimit: numberOfOps
        ? Math.floor(
            this.ajustGasForBatchOperation(
              hard_gas_limit_per_block,
              hard_gas_limit_per_operation,
              numberOfOps
            ).toNumber()
          )
        : hard_gas_limit_per_operation.toNumber(),
      storageLimit: Math.floor(
        BigNumber.min(balance.dividedBy(cost_per_byte), hard_storage_limit_per_operation).toNumber()
      ),
    };
  }

  // Fix for Granada where the total gasLimit of a batch can not exceed the hard_gas_limit_per_block.
  // If the total gasLimit of the batch is higher than the hard_gas_limit_per_block,
  // the gasLimit is calculated by dividing the hard_gas_limit_per_block by the number of operation in the batch (numberOfOps).
  // numberOfOps is incremented by 1 for safety in case a reveal operation is needed
  private ajustGasForBatchOperation(
    gasLimitBlock: BigNumber,
    gaslimitOp: BigNumber,
    numberOfOps: number
  ) {
    return BigNumber.min(gaslimitOp, gasLimitBlock.div(numberOfOps + 1));
  }

  private getEstimationPropertiesFromOperationContent(
    content: PreapplyResponse['contents'][0],
    size: number,
    costPerByte: BigNumber
  ): EstimateProperties {
    const operationResults = flattenOperationResult({ contents: [content] });
    let totalGas = 0;
    let totalMilligas = 0;
    let totalStorage = 0;
    operationResults.forEach((result) => {
      totalStorage +=
        'originated_contracts' in result && typeof result.originated_contracts !== 'undefined'
          ? result.originated_contracts.length * this.ORIGINATION_STORAGE
          : 0;
      totalStorage += 'allocated_destination_contract' in result ? this.ALLOCATION_STORAGE : 0;
      totalGas += Number(result.consumed_gas) || 0;
      totalMilligas += Number(result.consumed_milligas) || 0;
      totalStorage +=
        'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0;
      totalStorage +=
        'storage_size' in result && 'global_address' in result
          ? Number(result.storage_size) || 0
          : 0;
    });

    if (totalGas !== 0 && totalMilligas === 0) {
      // This will convert gas to milligas for Carthagenet where result does not contain consumed gas in milligas.
      totalMilligas = totalGas * 1000;
    }

    if (isOpWithFee(content)) {
      return {
        milligasLimit: totalMilligas || 0,
        storageLimit: Number(totalStorage || 0),
        opSize: size,
        minimalFeePerStorageByteMutez: costPerByte.toNumber(),
      };
    } else {
      return {
        milligasLimit: 0,
        storageLimit: 0,
        opSize: size,
        minimalFeePerStorageByteMutez: costPerByte.toNumber(),
        baseFeeMutez: 0,
      };
    }
  }

  private async prepareEstimate(params: PrepareOperationParams, constants: ConstantsResponse) {
    const prepared = await this.prepareOperation(params);
    const {
      opbytes,
      opOb: { branch, contents },
    } = await this.forge(prepared);
    const operation: RPCRunOperationParam = {
      operation: { branch, contents, signature: SIGNATURE_STUB },
      chain_id: await this.rpc.getChainId(),
    };

    const { opResponse } = await this.simulate(operation);
    const { cost_per_byte } = constants;
    const errors = [...flattenErrors(opResponse, 'backtracked'), ...flattenErrors(opResponse)];

    // Fail early in case of errors
    if (errors.length) {
      throw new TezosOperationError(errors);
    }

    let numberOfOps = 1;
    if (Array.isArray(params.operation) && params.operation.length > 1) {
      numberOfOps =
        opResponse.contents[0].kind === 'reveal'
          ? params.operation.length - 1
          : params.operation.length;
    }

    return opResponse.contents.map((x) => {
      return this.getEstimationPropertiesFromOperationContent(
        x,
        // TODO: Calculate a specific opSize for each operation.
        x.kind === 'reveal' ? this.OP_SIZE_REVEAL / 2 : opbytes.length / 2 / numberOfOps,
        cost_per_byte
      );
    });
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an origination operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param OriginationOperation Originate operation parameter
   */
  async originate<TContract extends Contract = Contract>({ fee, storageLimit, gasLimit, ...rest }: OriginateParams<TContract>) {
    const pkh = await this.signer.publicKeyHash();
    const protocolConstants = await this.rpc.getConstants();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createOriginationOperation(
      await this.context.parser.prepareCodeOrigination({
        ...rest,
        ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
      })
    );
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }
  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an transfer operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param TransferOperation Originate operation parameter
   */
  async transfer({ fee, storageLimit, gasLimit, ...rest }: TransferParams) {
    if (validateAddress(rest.to) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid 'to' address: ${rest.to}`);
    }
    if (rest.source && validateAddress(rest.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid 'source' address: ${rest.source}`);
    }
    const pkh = await this.signer.publicKeyHash();
    const protocolConstants = await this.rpc.getConstants();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createTransferOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async setDelegate({ fee, gasLimit, storageLimit, ...rest }: DelegateParams) {
    if (rest.source && validateAddress(rest.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid source address: ${rest.source}`);
    }
    if (rest.delegate && validateAddress(rest.delegate) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid delegate address: ${rest.delegate}`);
    }

    const pkh = await this.signer.publicKeyHash();
    const sourceOrDefault = rest.source || pkh;
    const protocolConstants = await this.rpc.getConstants();
    const DEFAULT_PARAMS = await this.getAccountLimits(sourceOrDefault, protocolConstants);
    const op = await createSetDelegateOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a each operation in the batch
   *
   * @returns An array of Estimate objects. If a reveal operation is needed, the first element of the array is the Estimate for the reveal operation.
   */
  async batch(params: ParamsWithKind[]) {
    const pkh = await this.signer.publicKeyHash();
    let operations: RPCOperation[] = [];
    const protocolConstants = await this.rpc.getConstants();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants, params.length);
    for (const param of params) {
      switch (param.kind) {
        case OpKind.TRANSACTION:
          operations.push(
            await createTransferOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.ORIGINATION:
          operations.push(
            await createOriginationOperation(
              await this.context.parser.prepareCodeOrigination({
                ...param,
                ...mergeLimits(param, DEFAULT_PARAMS),
              })
            )
          );
          break;
        case OpKind.DELEGATION:
          operations.push(
            await createSetDelegateOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.ACTIVATION:
          operations.push({
            ...param,
            ...DEFAULT_PARAMS,
          });
          break;
        case OpKind.REGISTER_GLOBAL_CONSTANT:
          operations.push(
            await createRegisterGlobalConstantOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        default:
          throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
      }
    }
    const isRevealNeeded = await this.isRevealOpNeeded(operations, pkh);
    operations = isRevealNeeded ? await this.addRevealOp(operations, pkh) : operations;
    const estimateProperties = await this.prepareEstimate(
      { operation: operations, source: pkh },
      protocolConstants
    );

    return Estimate.createArrayEstimateInstancesFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async registerDelegate(params: RegisterDelegateParams) {
    const pkh = await this.signer.publicKeyHash();
    const protocolConstants = await this.rpc.getConstants();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createRegisterDelegateOperation({ ...params, ...DEFAULT_PARAMS }, pkh);
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees to reveal the current account
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation or undefined if the account is already revealed
   *
   * @param Estimate
   */
  async reveal(params?: RevealParams) {
    const pkh = await this.signer.publicKeyHash();
    if (await this.isAccountRevealRequired(pkh)) {
      const protocolConstants = await this.rpc.getConstants();
      const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
      const op = await createRevealOperation(
        {
          ...params,
          ...DEFAULT_PARAMS,
        },
        pkh,
        await this.signer.publicKey()
      );
      const estimateProperties = await this.prepareEstimate(
        { operation: op, source: pkh },
        protocolConstants
      );
      return Estimate.createEstimateInstanceFromProperties(estimateProperties);
    }
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an registerGlobalConstant operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params registerGlobalConstant operation parameter
   */
  async registerGlobalConstant({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: RegisterGlobalConstantParams) {
    const pkh = await this.signer.publicKeyHash();
    const protocolConstants = await this.rpc.getConstants();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createRegisterGlobalConstantOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  private async addRevealOp(op: RPCOperation[], pkh: string) {
    op.unshift(
      await createRevealOperation(
        {
          ...{
            fee: DEFAULT_FEE.REVEAL,
            gasLimit: DEFAULT_GAS_LIMIT.REVEAL,
            storageLimit: DEFAULT_STORAGE_LIMIT.REVEAL,
          },
        },
        pkh,
        await this.signer.publicKey()
      )
    );
    return op;
  }
}
