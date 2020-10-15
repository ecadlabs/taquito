import { PreapplyResponse, RPCRunOperationParam, OpKind } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
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
} from '../operations/types';
import { Estimate } from './estimate';
import { EstimationProvider } from './interface';
import {
  createOriginationOperation,
  createRegisterDelegateOperation,
  createSetDelegateOperation,
  createTransferOperation,
} from './prepare';

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

  // Maximum values defined by the protocol
  private async getAccountLimits(pkh: string) {
    const balance = await this.rpc.getBalance(pkh);
    const {
      hard_gas_limit_per_operation,
      hard_storage_limit_per_operation,
      cost_per_byte,
    } = await this.rpc.getConstants();
    return {
      fee: 0,
      gasLimit: hard_gas_limit_per_operation.toNumber(),
      storageLimit: Math.floor(
        BigNumber.min(balance.dividedBy(cost_per_byte), hard_storage_limit_per_operation).toNumber()
      ),
    };
  }

  private createEstimateFromOperationContent(
    content: PreapplyResponse['contents'][0],
    size: number,
    costPerByte: BigNumber
  ) {
    const operationResults = flattenOperationResult({ contents: [content] });
    let totalGas = 0;
    let totalMilligas = 0;
    let totalStorage = 0;
    operationResults.forEach(result => {
      totalStorage +=
        'originated_contracts' in result && typeof result.originated_contracts !== 'undefined'
          ? result.originated_contracts.length * this.ORIGINATION_STORAGE
          : 0;
      totalStorage += 'allocated_destination_contract' in result ? this.ALLOCATION_STORAGE : 0;
      totalGas += Number(result.consumed_gas) || 0;
      totalMilligas += Number(result.consumed_milligas) || 0;
      totalStorage +=
        'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0;
    });

    if (totalGas !== 0 && totalMilligas === 0) {
      // This will convert gas to milligas for Carthagenet where result does not contain consumed gas in milligas.
      totalMilligas = totalGas * 1000;
    }

    if (isOpWithFee(content)) {
      return new Estimate(totalMilligas || 0, Number(totalStorage || 0), size, costPerByte.toNumber());
    } else {
      return new Estimate(0, 0, size, costPerByte.toNumber(), 0);
    }
  }

  private async createEstimate(params: PrepareOperationParams) {
    const {
      opbytes,
      opOb: { branch, contents },
    } = await this.prepareAndForge(params);

    let operation: RPCRunOperationParam = {
      operation: { branch, contents, signature: SIGNATURE_STUB },
      chain_id: await this.rpc.getChainId(),
    };

    const { opResponse } = await this.simulate(operation);
    const { cost_per_byte } = await this.rpc.getConstants();
    const errors = [...flattenErrors(opResponse, 'backtracked'), ...flattenErrors(opResponse)];

    // Fail early in case of errors
    if (errors.length) {
      throw new TezosOperationError(errors);
    }

    while (
      opResponse.contents.length !== (Array.isArray(params.operation) ? params.operation.length : 1)
    ) {
      opResponse.contents.shift();
    }

    return opResponse.contents.map(x => {
      return this.createEstimateFromOperationContent(
        x,
        opbytes.length / 2 / opResponse.contents.length,
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
  async originate({ fee, storageLimit, gasLimit, ...rest }: OriginateParams) {
    const pkh = await this.signer.publicKeyHash();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh);
    const op = await createOriginationOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    return (await this.createEstimate({ operation: op, source: pkh }))[0];
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
    const pkh = await this.signer.publicKeyHash();
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh);
    const op = await createTransferOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    return (await this.createEstimate({ operation: op, source: pkh }))[0];
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
    const sourceOrDefault = rest.source || (await this.signer.publicKeyHash());
    const DEFAULT_PARAMS = await this.getAccountLimits(sourceOrDefault);
    const op = await createSetDelegateOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    return (await this.createEstimate({ operation: op, source: sourceOrDefault }))[0];
  }

  async batch(params: ParamsWithKind[]) {
    const operations: RPCOperation[] = [];
    const DEFAULT_PARAMS = await this.getAccountLimits(await this.signer.publicKeyHash());
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
            await createOriginationOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
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
        default:
          throw new Error(`Unsupported operation kind: ${(param as any).kind}`);
      }
    }
    return this.createEstimate({ operation: operations });
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
    const DEFAULT_PARAMS = await this.getAccountLimits(await this.signer.publicKeyHash());
    const op = await createRegisterDelegateOperation(
      { ...params, ...DEFAULT_PARAMS },
      await this.signer.publicKeyHash()
    );
    return (
      await this.createEstimate({ operation: op, source: await this.signer.publicKeyHash() })
    )[0];
  }
}
