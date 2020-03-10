import { WalletOperation, OperationStatus } from "./operation";
import { Context } from "../context";
import { Observable } from "rxjs";
import { BlockResponse, OpKind, OperationContentsAndResultReveal, OperationContentsAndResultTransaction } from "@taquito/rpc";

export class TransactionWalletOperation extends WalletOperation {
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

  public async transactionOperation() {
    const operationResult = await this.operationResults();
    return operationResult.find((x) => x.kind === OpKind.TRANSACTION) as OperationContentsAndResultTransaction | undefined;
  }

  public async status(): Promise<OperationStatus> {
    if (!this._included) {
      return 'pending'
    }

    const op = await this.transactionOperation()
    if (!op) {
      return 'unknown';
    }

    return op.metadata.operation_result.status;
  }
}
