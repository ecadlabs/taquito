import {
    BlockResponse,
    OperationContentsAndResultRegisterGlobalConstant,
    OperationContentsAndResultReveal,
    OpKind,
  } from '@taquito/rpc';
  import { Observable } from 'rxjs';
  import { Context } from '../context';
  import { findWithKind } from '../operations/types';
  import { WalletOperation, OperationStatus } from './operation';
  import { ObservableError } from './errors';
  
  export class RegisterGlobalConstantWalletOperation extends WalletOperation {
    constructor(
      public readonly opHash: string,
      protected readonly context: Context,
      newHead$: Observable<BlockResponse>
    ) {
      super(opHash, context, newHead$);
    }

    public async revealOperation() {
      const operationResult = await this.operationResults();
      if (!operationResult) {
        throw new ObservableError('operationResult returned undefined');
      }
  
      return operationResult.find((x) => x.kind === OpKind.REVEAL) as
        | OperationContentsAndResultReveal
        | undefined;
    }
  
    public async registerGlobalConstantOperation() {
      const operationResult = await this.operationResults();
      if (operationResult) {
        return findWithKind(operationResult, OpKind.REGISTER_GLOBAL_CONSTANT) as
          | OperationContentsAndResultRegisterGlobalConstant
          | undefined;
      } else {
        throw new ObservableError('Unable to fetch operation result');
      }
    }
  
    public async status(): Promise<OperationStatus> {
      if (!this._included) {
        return 'pending';
      }
  
      const op = await this.registerGlobalConstantOperation();
      if (!op) {
        return 'unknown';
      }
  
      return op.metadata.operation_result.status;
    }
  
    public async globalConstantHash(): Promise<string | undefined> {
      const op = await this.registerGlobalConstantOperation();
      return op?.metadata.operation_result.global_address;
    }
  }