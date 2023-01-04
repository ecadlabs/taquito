import { OperationContents } from '@taquito/rpc';
import { PrepareOperationParams } from '../operations/types';

export interface PreparationProvider {
  reveal({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  originate({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  transaction({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  activation({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  delegation({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  registerGlobalConstant({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  txRollupOrigination({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  txRollupSubmitBatch({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  updateConsensusKey({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  transferTicket({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  increasePaidStorage({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  ballot({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  proposals({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;

  drainDelegate({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;
}

export interface PreparedOperation {
  opOb: {
    branch: string;
    contents: OperationContents[];
    protocol: string;
  };
  counter: number;
}
