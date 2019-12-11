import { BlockMetadata, BlockHeaderResponse, ConstructedOperation } from '@taquito/rpc';
import { Context } from '../context';
import { RPCOperation } from '../operations/types';

export interface Preparer {
  prepare(unPreparedOps: RPCOperation[], context: PreparerContext): Promise<RPCOperation[]>;
}

export interface PreparedOperation {
  branch: string;
  contents: ConstructedOperation[];
  protocol: string;
}

export interface RootPreparer {
  prepare(unPreparedOps: RPCOperation[]): Promise<PreparedOperation>;
}

export interface PreparerContext {
  metadata: Promise<BlockMetadata>;
  header: Promise<BlockHeaderResponse>;
  source: string;
  context: Context;
}
