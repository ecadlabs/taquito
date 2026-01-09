import {
  OperationContentsAndResult,
  RPCSimulateOperationParam,
  RpcClientInterface,
} from '@taquito/rpc';
import { Context } from './context';
import { ForgedBytes, ParamsWithKind, RPCOperation, isOpRequireReveal } from './operations/types';
import {
  InvalidEstimateValueError,
  TezosOperationError,
  TezosPreapplyFailureError,
  flattenErrors,
} from './operations/errors';
import {
  createOriginationOperation,
  createRegisterGlobalConstantOperation,
  createRevealOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  createSmartRollupAddMessagesOperation,
  createSmartRollupOriginateOperation,
  createSmartRollupExecuteOutboxMessageOperation,
  createUpdateConsensusKeyOperation,
  createUpdateCompanionKeyOperation,
} from './contract/prepare';
import { OpKind } from '@taquito/rpc';
import { InvalidOperationKindError } from '@taquito/utils';
import { PreparedOperation } from './prepare';
import { Estimate } from './estimate';

export abstract class Provider {
  get rpc(): RpcClientInterface {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  constructor(protected context: Context) {}

  protected async forge({ opOb: { branch, contents, protocol }, counter }: PreparedOperation) {
    const forgedBytes = await this.context.forger.forge({ branch, contents });
    return {
      opbytes: forgedBytes,
      opOb: {
        branch,
        contents,
        protocol,
      },
      counter,
    };
  }

  protected async estimate<T extends { fee?: number; gasLimit?: number; storageLimit?: number }>(
    { fee, gasLimit, storageLimit, ...rest }: T,
    estimator: (param: T) => Promise<Estimate>
  ) {
    let calculatedFee = fee;
    let calculatedGas = gasLimit;
    let calculatedStorage = storageLimit;

    if (calculatedFee && calculatedFee % 1 !== 0) {
      throw new InvalidEstimateValueError(`Fee value must not be a decimal: ${calculatedFee}`);
    }
    if (calculatedGas && calculatedGas % 1 !== 0) {
      throw new InvalidEstimateValueError(
        `Gas Limit value must not be a decimal: ${calculatedGas}`
      );
    }
    if (calculatedStorage && calculatedStorage % 1 !== 0) {
      throw new InvalidEstimateValueError(
        `Storage Limit value must not be a decimal: ${calculatedStorage}`
      );
    }

    if (fee === undefined || gasLimit === undefined || storageLimit === undefined) {
      const estimation = await estimator({ fee, gasLimit, storageLimit, ...(rest as any) });
      calculatedFee ??= estimation.suggestedFeeMutez;
      calculatedGas ??= estimation.gasLimit;
      calculatedStorage ??= estimation.storageLimit;
    }

    return {
      fee: calculatedFee,
      gasLimit: calculatedGas,
      storageLimit: calculatedStorage,
    };
  }

  async getRPCOp(param: ParamsWithKind) {
    switch (param.kind) {
      case OpKind.TRANSACTION:
        return createTransferOperation({
          ...param,
        });
      case OpKind.ORIGINATION:
        return createOriginationOperation(
          await this.context.parser.prepareCodeOrigination({
            ...param,
          })
        );
      case OpKind.DELEGATION:
        return createSetDelegateOperation({
          ...param,
        });
      case OpKind.REGISTER_GLOBAL_CONSTANT:
        return createRegisterGlobalConstantOperation({
          ...param,
        });
      case OpKind.INCREASE_PAID_STORAGE:
        return createIncreasePaidStorageOperation({
          ...param,
        });
      case OpKind.UPDATE_CONSENSUS_KEY:
        return createUpdateConsensusKeyOperation({
          ...param,
        });
      case OpKind.UPDATE_COMPANION_KEY:
        return createUpdateCompanionKeyOperation({
          ...param,
        });
      case OpKind.TRANSFER_TICKET:
        return createTransferTicketOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_ADD_MESSAGES:
        return createSmartRollupAddMessagesOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_ORIGINATE:
        return createSmartRollupOriginateOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE:
        return createSmartRollupExecuteOutboxMessageOperation({
          ...param,
        });
      case OpKind.REVEAL:
        return createRevealOperation(
          param,
          await this.signer.publicKeyHash(),
          await this.signer.publicKey()
        );
      default:
        throw new InvalidOperationKindError((param as any).kind);
    }
  }

  protected async simulate(op: RPCSimulateOperationParam) {
    return {
      opResponse: await this.rpc.simulateOperation(op),
      op,
      context: this.context.clone(),
    };
  }

  protected async isRevealOpNeeded(op: RPCOperation[] | ParamsWithKind[], pkh: string) {
    return !(await this.isAccountRevealRequired(pkh)) || !this.isRevealRequiredForOpType(op)
      ? false
      : true;
  }

  protected async isAccountRevealRequired(publicKeyHash: string) {
    return !(await this.context.readProvider.isAccountRevealed(publicKeyHash, 'head'));
  }

  protected isRevealRequiredForOpType(op: RPCOperation[] | ParamsWithKind[]) {
    let opRequireReveal = false;
    for (const operation of op) {
      if (isOpRequireReveal(operation)) {
        opRequireReveal = true;
      }
    }
    return opRequireReveal;
  }

  protected async signAndInject(forgedBytes: ForgedBytes) {
    const signed = await this.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));
    forgedBytes.opbytes = signed.sbytes;
    forgedBytes.opOb.signature = signed.prefixSig;

    const opResponse: OperationContentsAndResult[] = [];
    const results = await this.rpc.preapplyOperations([forgedBytes.opOb]);

    if (!Array.isArray(results)) {
      throw new TezosPreapplyFailureError(results);
    }

    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].contents.length; j++) {
        opResponse.push(results[i].contents[j]);
      }
    }

    const errors = flattenErrors(results);

    if (errors.length) {
      throw new TezosOperationError(
        errors,
        'Error occurred during validation simulation of operation',
        opResponse
      );
    }

    return {
      hash: await this.context.injector.inject(forgedBytes.opbytes),
      forgedBytes,
      opResponse,
      context: this.context.clone(),
    };
  }
}
