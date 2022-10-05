import { OperationContents } from '@taquito/rpc';

export interface ForgeParams {
  branch: string;
  contents: OperationContents[];
}

export type ForgeResponse = string; // hex string

export interface Forger {
  forge(params: ForgeParams): Promise<ForgeResponse>;
}
