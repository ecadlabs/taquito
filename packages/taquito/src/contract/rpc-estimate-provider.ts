import { OperationEmitter } from '../operations/operation-emitter';
import { OriginateParams, TransferParams } from '../operations/types';
import { createOriginationOperation, createTransferOperation } from './prepare';
import { Estimate } from './estimate';
import { DEFAULT_STORAGE_LIMIT, protocols } from '../constants';
import { EstimationProvider } from './interface';
import { RPCRunOperationParam } from '@taquito/rpc';

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

  private getOperationResult(opResponse: any, kind: 'origination' | 'transaction') {
    const results = opResponse.contents;
    const originationOp = Array.isArray(results) && results.find(op => op.kind === kind);
    return originationOp && originationOp.metadata && originationOp.metadata.operation_result;
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
    const consumedGas = operationResults && operationResults.consumed_gas;
    const storageDiff = operationResults && operationResults.paid_storage_size_diff;

    return new Estimate(
      consumedGas,
      Number(storageDiff) + DEFAULT_STORAGE_LIMIT.ORIGINATION,
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

    const consumedGas = operationResults && operationResults.consumed_gas;
    const storageDiff = operationResults && operationResults.paid_storage_size_diff;

    return new Estimate(
      consumedGas,
      Number(storageDiff) + DEFAULT_STORAGE_LIMIT.TRANSFER,
      opbytes.length / 2
    );
  }
}
