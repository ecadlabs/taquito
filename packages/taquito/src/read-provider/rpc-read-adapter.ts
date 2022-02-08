import { EntrypointsResponse, MichelsonV1Expression, MichelsonV1ExpressionExtended, SaplingDiffResponse } from "@taquito/rpc";
import BigNumber from 'bignumber.js';
import { Context } from "../context";
import { BigMapQuery, BlockIdentifier, SaplingStateQuery, TzReadProvider } from "./interface";

/**
     * @description Converts calls from TzReadProvider into calls to the wrapped RpcClient in a format it can understand.
     */
export class RpcReadAdapter implements TzReadProvider {
    constructor(private context: Context) { }

    /**
     * @description Access the balance of a contract.
     * @param address address from which we want to retrieve the balance
     * @param block from which we want to retrieve the balance
     * @returns the balance in mutez
     */
    async getBalance(address: string, block: BlockIdentifier): Promise<BigNumber> {
        return this.context.rpc.getBalance(address, { block: String(block) });
    }

    /**
     * @description Access the delegate of a contract, if any.
     * @param address contract address from which we want to retrieve the delegate (baker)
     * @param block from which we want to retrieve the delegate
     * @returns the public key hash of the delegate or null if no delegate
     */
    async getDelegate(address: string, block: BlockIdentifier): Promise<string | null> {
        return this.context.rpc.getDelegate(address, { block: String(block) });
    }

    /**
     * @description Access the next protocol hash
     * @param block from which we want to retrieve the next protocol hash
     */
    async getNextProtocol(block: BlockIdentifier): Promise<string> {
        const protocols = await this.context.rpc.getProtocols({ block: String(block) });
        return protocols.next_protocol;
    }

    /**
   * @description Access protocol constants used in Taquito
   * @param block from which we want to retrieve the constants
   */
    async getProtocolConstants(block: BlockIdentifier): Promise<{ time_between_blocks?: BigNumber[]; minimal_block_delay?: BigNumber | undefined; hard_gas_limit_per_operation: BigNumber; hard_gas_limit_per_block: BigNumber; hard_storage_limit_per_operation: BigNumber; cost_per_byte: BigNumber; }> {
        const {
            time_between_blocks,
            minimal_block_delay,
            hard_gas_limit_per_operation,
            hard_gas_limit_per_block,
            hard_storage_limit_per_operation,
            cost_per_byte
        } = await this.context.rpc.getConstants({ block: String(block) })
        return {
            time_between_blocks,
            minimal_block_delay,
            hard_gas_limit_per_operation,
            hard_gas_limit_per_block,
            hard_storage_limit_per_operation,
            cost_per_byte
        }
    }

    /**
     * @description Access the code of a smart contract
     * @param contract contract address from which we want to retrieve the code
     * @returns an object with a property code that represents the smart contract code.
     * The code must be in the JSON format and not contain global constant
     */
    async getContractCode(contract: string): Promise<{ code: MichelsonV1Expression[] }> {
        const { code } = await this.context.rpc.getNormalizedScript(contract);
        return { code };
    }

    /**
     * @description Access the storage value of a contract
     * @param contract contract address from which we want to retrieve the storage
     * @param block from which we want to retrieve the storage value
     */
    async getStorage(contract: string, block: BlockIdentifier): Promise<MichelsonV1Expression> {
        return this.context.rpc.getStorage(contract, { block: String(block) })
    }

    /**
     * @description Access the storage Michelson type of a contract and its value
     * @param contract contract address from which we want to retrieve the storage
     * @param block from which we want to retrieve the storage value
     */
    async getStorageTypeAndValue(contract: string, block: BlockIdentifier): Promise<{
        storageType: MichelsonV1Expression,
        storageValue: MichelsonV1Expression
    }> {
        const { code, storage } = await this.context.rpc.getNormalizedScript(contract, { unparsing_mode: 'Readable' }, { block: String(block) });
        const storageType = (code.find((x: any) => x.prim === 'storage') as MichelsonV1ExpressionExtended);
        if (!storageType || !Array.isArray(storageType.args)) {
            throw new Error('Invalid contract code')
        }
        return { storageType: storageType.args[0], storageValue: storage }
    }

    /**
     * @description Access the block hash
     */
    async getBlockHash(block: BlockIdentifier): Promise<string> {
        const { hash } = await this.context.rpc.getBlockHeader({ block: String(block) })
        return hash;
    }

    /**
     * @description Access the block level
     */
    async getBlockLevel(block: BlockIdentifier): Promise<number> {
        const { level } = await this.context.rpc.getBlockHeader({ block: String(block) })
        return level;
    }

    /**
     * @description Access the counter of an address
     * @param pkh from which we want to retrieve the counter
     * @param block from which we want to retrieve the counter
     */
    async getCounter(pkh: string, block: BlockIdentifier): Promise<string> {
        const { counter } = await this.context.rpc.getContract(pkh, { block: String(block) });
        return counter || '0'
    }

    /**
     * @description Access the timestamp of a block
     * @param block from which we want to retrieve the timestamp
     * @returns date ISO format zero UTC offset ("2022-01-19T22:37:07Z")
     */
    async getBlockTimestamp(block: BlockIdentifier): Promise<string> {
        const { timestamp } = await this.context.rpc.getBlockHeader({ block: String(block) });
        return timestamp;
    }

    /**
     * @description Access the value associated with a key in a big map.
     * @param bigMapQuery Big Map ID and Expression hash to query (A b58check encoded Blake2b hash of the expression)
     * @param block from which we want to retrieve the big map value
     */
    async getBigMapValue(bigMapQuery: BigMapQuery, block: BlockIdentifier): Promise<MichelsonV1Expression> {
        return this.context.rpc.getBigMapExpr(bigMapQuery.id, bigMapQuery.expr, { block: String(block) })
    }

    /**
     * @description Access the value associated with a sapling state ID.
     * @param id Sapling state ID
     * @param block from which we want to retrieve the sapling state
     */
    async getSaplingDiffById(saplingStateQuery: SaplingStateQuery, block: BlockIdentifier): Promise<SaplingDiffResponse> {
        return this.context.rpc.getSaplingDiffById(saplingStateQuery.id, { block: String(block) })
    }

    /**
     * @description Return the list of entrypoints of the contract
     * @param contract address of the contract we want to get the entrypoints of
     */
    async getEntrypoints(contract: string): Promise<EntrypointsResponse> {
        return this.context.rpc.getEntrypoints(contract)
    }

    /**
     * @description Access the chain id
     */
    async getChainId(): Promise<string> {
        return this.context.rpc.getChainId()
    }

    /**
     * @description Indicate if an account is revealed
     * @param publicKeyHash of the account 
     * @param block from which we want to know if the account is revealed
     */
    async isAccountRevealed(publicKeyHash: string, block: BlockIdentifier): Promise<boolean> {
        const manager = await this.context.rpc.getManagerKey(publicKeyHash, { block: String(block) });
        const haveManager = manager && typeof manager === 'object' ? !!manager.key : !!manager;
        return haveManager;
    }
}