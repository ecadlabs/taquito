import { OperationEmitter } from '../operations/operation-emitter';
import { OriginateParams, TransferParams } from '../operations/types';
import { createOriginationOperation, createTransferOperation } from './prepare';
import { Estimate } from './estimate';
import { DEFAULT_STORAGE_LIMIT, protocols, DEFAULT_GAS_LIMIT } from '../constants';
import { EstimationProvider } from './interface';
import {
  RPCRunOperationParam,
  OperationContentsAndResult,
  PreapplyResponse,
  OperationResultOrigination,
  OperationContentsAndResultOrigination,
  OperationContentsAndResultTransaction,
  OperationResultTransaction,
  InternalOperationResult,
  InternalOperationResultEnum,
} from '@taquito/rpc';

// RPC require a signature but do not verify it
const SIGNATURE_STUB =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

export class RPCEstimateProvider extends OperationEmitter implements EstimationProvider {
  // Maximum values defined by the protocol
  private readonly DEFAULT_PARAMS = {
    fee: 30000,
    storageLimit: 60000,
    gasLimit: 800000,
  };

  private getOperationResult(
    opResponse: PreapplyResponse,
    kind: 'origination' | 'transaction'
  ): (OperationResultTransaction | OperationResultOrigination)[] {
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
    const op = await createOriginationOperation(
      {
        ...rest,
        ...this.DEFAULT_PARAMS,
      },
      pkh
    );
    const {
      opbytes,
      opOb: { branch, contents },
    } = await this.prepareAndForge({ operation: op, source: pkh });

    let operation: RPCRunOperationParam = { branch, contents, signature: SIGNATURE_STUB };
    if (await this.context.isAnyProtocolActive(protocols['005'])) {
      operation = { operation, chain_id: await this.rpc.getChainId() };
    }

    const { opResponse } = await this.simulate(operation);
    const operationResults = this.getOperationResult(opResponse, 'origination');

    let totalGas = 0;
    let totalStorage = 0;
    operationResults.forEach(result => {
      totalGas += Number(result.consumed_gas) || 0;
      totalStorage += Number(result.paid_storage_size_diff) || 0;
    });

    return new Estimate(
      totalGas || 0,
      Number(totalStorage || 0) + DEFAULT_STORAGE_LIMIT.ORIGINATION,
      opbytes.length / 2
    );
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
    const op = await createTransferOperation({
      ...rest,
      ...this.DEFAULT_PARAMS,
    });
    const {
      opbytes,
      opOb: { branch, contents },
    } = await this.prepareAndForge({ operation: op, source: pkh });

    let operation: RPCRunOperationParam = { branch, contents, signature: SIGNATURE_STUB };
    if (await this.context.isAnyProtocolActive(protocols['005'])) {
      operation = { operation, chain_id: await this.rpc.getChainId() };
    }

    const { opResponse } = await this.simulate(operation);
    const operationResults = this.getOperationResult(opResponse, 'transaction');

    let totalGas = 0;
    let totalStorage = 0;
    operationResults.forEach(result => {
      totalGas += Number(result.consumed_gas) || 0;
      totalStorage += Number(result.paid_storage_size_diff) || 0;
    });
    return new Estimate(
      totalGas || 0,
      Number(totalStorage || 0) + DEFAULT_STORAGE_LIMIT.TRANSFER,
      opbytes.length / 2
    );
  }
}
