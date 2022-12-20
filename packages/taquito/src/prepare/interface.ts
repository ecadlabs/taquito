import { OperationContents } from '@taquito/rpc';
import { RPCOriginationOperation, RPCTransferOperation } from '../operations';

export interface Preparation {
  originate(op: RPCOriginationOperation, source?: string): Promise<PreparedOperation>;

  transaction(op: RPCTransferOperation, source?: string): Promise<PreparedOperation>;
}

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: OperationContents[];
    protocol: string;
  };
  counter: number;
}
