import { BlockResponse, OperationContentsAndResultReveal, OpKind } from "@taquito/rpc";
import { Observable } from "rxjs";
import { Context } from "../context";
import { WalletOperation, OperationStatus } from "./operation";

export class DelegationWalletOperation extends WalletOperation {
  constructor(
    public readonly hash: string,
    protected readonly context: Context,
    newHead$: Observable<BlockResponse>
  ) {
    super(hash, context, newHead$)
  }

  public async revealOperation() {
    const operationResult = await this.operationResults();
    return operationResult.find((x) => x.kind === OpKind.REVEAL) as OperationContentsAndResultReveal | undefined;
  }

  public async delegationOperation() {
    const operationResult = await this.operationResults();
    return operationResult.find((x) => x.kind === OpKind.DELEGATION) as OperationContentsAndResultReveal | undefined;
  }

  public async status(): Promise<OperationStatus> {
    if (!this._included) {
      return 'pending'
    }

    const op = await this.delegationOperation()
    if (!op) {
      return 'unknown';
    }

    return op.metadata.operation_result.status;
  }
}
