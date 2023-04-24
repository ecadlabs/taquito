import { OperationContentsAndResult, RPCRunOperationParam, RpcClientInterface } from '@taquito/rpc';
import { Context } from './context';
import { ForgedBytes, ParamsWithKind, RPCOperation, isOpRequireReveal } from './operations/types';
import {
  TezosOperationError,
  TezosPreapplyFailureError,
  flattenErrors,
} from './operations/operation-errors';

import {
  createOriginationOperation,
  createRegisterGlobalConstantOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  createSmartRollupAddMessagesOperation,
  createSmartRollupOriginateOperation,
} from './contract/prepare';

import { OpKind } from '@taquito/rpc';
import { InvalidOperationKindError } from '@taquito/utils';

export abstract class Provider {
  get rpc(): RpcClientInterface {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  constructor(protected context: Context) {}

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
      case OpKind.ACTIVATION:
        return {
          ...param,
        };
      case OpKind.REGISTER_GLOBAL_CONSTANT:
        return createRegisterGlobalConstantOperation({
          ...param,
        });
      case OpKind.INCREASE_PAID_STORAGE:
        return createIncreasePaidStorageOperation({
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
      case OpKind.SMART_ROLLUP_ORIGINATE: {
        return createSmartRollupOriginateOperation({
          ...param,
        });
      }
      default:
        throw new InvalidOperationKindError((param as any).kind);
    }
  }

  protected async simulate(op: RPCRunOperationParam) {
    return {
      opResponse: await this.rpc.runOperation(op),
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
        'Error occurred during validation simulation of operation'
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
