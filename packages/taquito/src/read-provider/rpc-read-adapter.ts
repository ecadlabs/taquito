import { EntrypointsResponse, MichelsonV1Expression, RpcClientInterface, SaplingDiffResponse } from "@taquito/rpc";
import BigNumber from 'bignumber.js';
import { BlockIdProvider } from "../block-id-provider/interface";
import { TzReadProvider } from "./interface";

export class RpcReadAdapter implements TzReadProvider {
    constructor( private rpcClient: RpcClientInterface) { }
    async getBalance(address: string, block: BlockIdProvider): Promise<BigNumber> {
        return this.rpcClient.getBalance(address, { block: block.getBlockRawId() });
    }
    async getDelegate(address: string, block: BlockIdProvider): Promise<string | null> {
        return this.rpcClient.getDelegate(address, { block: block.getBlockRawId() });
    }
    async getNextProtocol(block: BlockIdProvider): Promise<string> {
        const metadata = await this.rpcClient.getBlockMetadata({block: await block.getBlockHash()});
        return metadata.next_protocol;
    }
    async getProtocolConstants(block: BlockIdProvider): Promise<{ time_between_blocks: BigNumber[]; minimal_block_delay?: BigNumber | undefined; hard_gas_limit_per_operation: BigNumber; hard_gas_limit_per_block: BigNumber; hard_storage_limit_per_operation: BigNumber; cost_per_byte: BigNumber; }> {
        const {
            time_between_blocks, 
            minimal_block_delay, 
            hard_gas_limit_per_operation, 
            hard_gas_limit_per_block, 
            hard_storage_limit_per_operation, 
            cost_per_byte
        } = await this.rpcClient.getConstants({block: block.getBlockRawId()})
        return { 
            time_between_blocks, 
            minimal_block_delay, 
            hard_gas_limit_per_operation, 
            hard_gas_limit_per_block, 
            hard_storage_limit_per_operation, 
            cost_per_byte
        }
    }
    async getContractCode(contract: string): Promise<MichelsonV1Expression[]> {
        const { code } = await this.rpcClient.getNormalizedScript(contract)
        return code;
    }
    async getStorage(contract: string, block: BlockIdProvider): Promise<MichelsonV1Expression> {
        return this.rpcClient.getStorage(contract, { block: await block.getBlockHash()})
    }
    async getBlockHash(block: BlockIdProvider): Promise<string> {
        return block.getBlockHash();
    }
    async getBlockLevel(block: BlockIdProvider): Promise<number> {
        return block.getBlockLevel();
    }
    async getCounter(pkh: string, block: BlockIdProvider): Promise<number> {
        const { counter } = await this.rpcClient.getContract(pkh, { block: await block.getBlockHash()});
        return parseInt(counter || '0', 10);
    }
    async getBlockTimestamp(block: BlockIdProvider): Promise<string> {
        const { timestamp } = await this.rpcClient.getBlockHeader({ block: await block.getBlockHash()});
        return timestamp;
    }
    async getBigMapExpr(id: string, expr: string, block: BlockIdProvider): Promise<MichelsonV1Expression> {
        return this.rpcClient.getBigMapExpr(id, expr, {block: await block.getBlockHash()})
    }
    async getSaplingDiffById(id: string, block: BlockIdProvider): Promise<SaplingDiffResponse> {
        return this.rpcClient.getSaplingDiffById(id, { block: await block.getBlockHash() })
    }
    async getEntrypoints(contract: string): Promise<EntrypointsResponse> {
        return this.rpcClient.getEntrypoints(contract)
    }
    async getChainId(): Promise<string> {
        return this.rpcClient.getChainId()
    }
    async isAccountRevealed(publicKeyHash: string, block: BlockIdProvider): Promise<boolean> {
        const manager = await this.rpcClient.getManagerKey(publicKeyHash, { block: await block.getBlockHash()});
        const haveManager = manager && typeof manager === 'object' ? !!manager.key : !!manager;
        return !haveManager;
    }
    async getLiveBlocks(block: BlockIdProvider): Promise<string[]> {
        return this.rpcClient.getLiveBlocks({ block: block.getBlockRawId() });
    }

    // ...
}