import { BlockHeaderResponse, RpcClientInterface } from "@taquito/rpc";
import { Context } from "../context";
import { BlockIdProviderCreator, BlockIdProvider } from "./interface";


export class RpcBlockIdProviderCreator implements BlockIdProviderCreator {
    createBlock(context: Context, blockIdentifier = 'head') {
        return new RpcBlockIdProvider(context, blockIdentifier);
    }
}

export class RpcBlockIdProvider implements BlockIdProvider {
    private _rpcClient: RpcClientInterface;
    private _blockRawId: string;
    private _blockHeader: BlockHeaderResponse | undefined;

    constructor(context: Context, blockIdentifier = 'head') {
        this._rpcClient = context.rpc;
        this._blockRawId = blockIdentifier
    }

    private async getBlockHeader() {
        return this._rpcClient.getBlockHeader({ block: this._blockRawId });
    }

    async getBlockLevel() {
        if (!this._blockHeader) {
            this._blockHeader = await this.getBlockHeader();
        }
        return this._blockHeader.level;
    }

    async getBlockHash() {
        if (!this._blockHeader) {
            this._blockHeader = await this.getBlockHeader();
        }
        return this._blockHeader.hash;
    }

    getBlockRawId() {
        return this._blockRawId;
    }
}