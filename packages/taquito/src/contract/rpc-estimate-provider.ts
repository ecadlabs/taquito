import {
  OperationResultDelegation,
  OperationResultOrigination,
  OperationResultTransaction,
  PreapplyResponse,
  RPCRunOperationParam,
} from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { OperationEmitter } from '../operations/operation-emitter';
import {
  flattenErrors,
  TezosOperationError,
  flattenOperationResult,
} from '../operations/operation-errors';
import {
  DelegateParams,
  OriginateParams,
  PrepareOperationParams,
  RegisterDelegateParams,
  TransferParams,
  RPCOperation,
} from '../operations/types';
import { Estimate } from './estimate';
import { EstimationProvider } from './interface';
import {
  createOriginationOperation,
  createRegisterDelegateOperation,
  createSetDelegateOperation,
  createTransferOperation,
} from './prepare';
import { withParams } from '../batch/rpc-batch-provider';
import { DEFAULT_STORAGE_LIMIT } from '../constants';

// RPC require a signature but do not verify it
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

  private getOperationResult(
    opResponse: PreapplyResponse,
    kind: 'origination' | 'transaction' | 'delegation'
  ): (OperationResultTransaction | OperationResultOrigination | OperationResultDelegation)[] {
    const results = opResponse.contents;
    const originationOp = Array.isArray(results) && results.find(op => op.kind === kind);
    const opResult =
      originationOp && originationOp.metadata && originationOp.metadata.operation_result;
    const internalResult =
      originationOp && originationOp.metadata && originationOp.metadata.internal_operation_results;
    return [opResult, ...(internalResult || []).map(({ result }: any) => result)].filter(
      (x: any) => !!x
    );
  }

  private createEstimateFromOperationContent(
    content: PreapplyResponse['contents'][0],
    size: number
  ) {
    const operationResults = flattenOperationResult({ contents: [content] });
    let totalGas = 0;
    let totalStorage = 0;
    operationResults.forEach(result => {
      totalStorage +=
        'originated_contracts' in result && typeof result.originated_contracts !== 'undefined'
          ? result.originated_contracts.length * this.ORIGINATION_STORAGE
          : 0;
      totalStorage += 'allocated_destination_contract' in result ? this.ALLOCATION_STORAGE : 0;
      totalGas += Number(result.consumed_gas) || 0;
      totalStorage +=
        'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0;
    });

    if (
      content.kind === 'delegation' ||
      content.kind === 'origination' ||
      content.kind === 'reveal' ||
      content.kind === 'transaction'
    ) {
      return new Estimate(totalGas || 0, Number(totalStorage || 0), size);
    } else {
      return new Estimate(0, 0, size, 0);
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
        opbytes.length / 2 / opResponse.contents.length
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
      ...DEFAULT_PARAMS,
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
      ...DEFAULT_PARAMS,
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
  async setDelegate(params: DelegateParams) {
    const sourceOrDefault = params.source || (await this.signer.publicKeyHash());
    const DEFAULT_PARAMS = await this.getAccountLimits(sourceOrDefault);
    const op = await createSetDelegateOperation({ ...params, ...DEFAULT_PARAMS });
    return (await this.createEstimate({ operation: op, source: sourceOrDefault }))[0];
  }

  async batch(params: withParams[]) {
    const operations: RPCOperation[] = [];
    const DEFAULT_PARAMS = await this.getAccountLimits(await this.signer.publicKeyHash());
    for (const param of params) {
      switch (param.kind) {
        case 'transaction':
          operations.push(
            await createTransferOperation({
              ...param,
              ...DEFAULT_PARAMS,
            })
          );
          break;
        case 'origination':
          operations.push(
            await createOriginationOperation({
              ...param,
              ...DEFAULT_PARAMS,
            })
          );
          break;
        case 'delegation':
          operations.push(
            await createSetDelegateOperation({
              ...param,
              ...DEFAULT_PARAMS,
            })
          );
          break;
        case 'activate_account':
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
