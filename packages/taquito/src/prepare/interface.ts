import { OperationContents } from '@taquito/rpc';
// import { RPCOriginationOperation, RPCTransferOperation } from '../operations';
import { PrepareOperationParams } from '../operations/types';
export interface Preparation {
  originate({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  // transaction(op: RPCTransferOperation, source?: string): Promise<PreparedOperation>;
}

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: OperationContents[];
    protocol: string;
  };
  counter: number;
}
