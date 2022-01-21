import { Context } from "../context";

export interface BlockIdProvider {
    getBlockLevel(): Promise<number>;
    getBlockHash(): Promise<string>;
    getBlockRawId(): string;
}

export interface BlockIdProviderCreator {
    createBlock(context: Context, blockIdentifier: string): BlockIdProvider
}