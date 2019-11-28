import { BlockMetadata, BlockHeaderResponse } from "@taquito/rpc";
import { Context } from "../context";

export interface PreparerContext {
  metadata: Promise<BlockMetadata>;
  header: Promise<BlockHeaderResponse>;
  source: Promise<string>;
  context: Context;
}
