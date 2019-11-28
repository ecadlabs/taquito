import { ConstructedOperation } from '@taquito/rpc';

export interface ForgeParams {
  branch: string;
  contents: ConstructedOperation[];
}

export type ForgeResponse = string; // hex string

export interface Forger {
  forge(params: ForgeParams): Promise<ForgeResponse>;
}
