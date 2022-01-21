import { EntrypointsResponse, MichelsonV1Expression, SaplingDiffResponse, ScriptedContracts } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { BlockIdProvider } from '../block-id-provider/interface';

export interface TzReadProvider {

  /**
   * @description Access the balance of a contract.
   * @param address address from which we want to retrieve the balance
   * @returns the balance in mutez
   */
    getBalance(address: string, block: BlockIdProvider): Promise<BigNumber>;

  /**
   * @description Access the delegate of a contract, if any.
   * @param address contract address from which we want to retrieve the delegate (baker)
   */
    getDelegate(address: string, block: BlockIdProvider): Promise<string | null>;

  /**
   * @description Access the next protocol hash
   * @see RpcClient.getBlockMetadata().next_protocol
   */
    getNextProtocol(block: BlockIdProvider): Promise<string>;

  /**
   * @description Acess protocol constants needed in Taquito
   * @see RpcClient.getConstants()
   */
    getProtocolConstants(block: BlockIdProvider):Promise<{
      time_between_blocks: BigNumber[];
      minimal_block_delay?: BigNumber;
      hard_gas_limit_per_operation: BigNumber;
      hard_gas_limit_per_block: BigNumber;
      hard_storage_limit_per_operation: BigNumber;
      cost_per_byte: BigNumber;
    }>;

  /**
   * @description Access the code of a contract
   * @param contract contract address from which we want to retrieve the code
   * @see RpcClient.getNormalizedScript().code
   */
    getContractCode(contract: string): Promise<MichelsonV1Expression[]>;

  /**
   * @description Access the storage of a contract
   * @param contract contract address from which we want to retrieve the storage
   */
    getStorage(contract: string, block: BlockIdProvider): Promise<MichelsonV1Expression>;

  /**
   * @description Access the block hash
   * @param blockIdentifier
   * @example getBlockHash('head~2');
   * @see RpcCLient.getBlockHeader().hash
   */
    getBlockHash(block: BlockIdProvider): Promise<string>;

  /**
   * @description Access the block level
   * @param blockIdentifier
   * @example getBlockLevel('head~2');
   * @see RpcClient.getBlock().header.level 
   * @see RpcClient.getBlockHeader().level
   */
    getBlockLevel(block: BlockIdProvider): Promise<number>;
    
  /**
   * @description Access the counter of a contract
   * @param pkh from which we want to retrieve the counter
   * @see RpcCLient.getContract().counter
   */
    getCounter(pkh: string, block: BlockIdProvider): Promise<number>;

  /**
   * @description Access the timestamp of a block
   * @returns date ISO format zero UTC offset ("2022-01-19T22:37:07Z")
   * @see RpcClient.getBlock().header.timestamp
   */
    getBlockTimestamp(block: BlockIdProvider): Promise<string>

  /**
   * @description Access the value associated with a key in a big map.
   * @param id Big Map ID
   * @param expr Expression hash to query (A b58check encoded Blake2b hash of the expression)
   */
    getBigMapExpr(id: string, expr: string, block: BlockIdProvider): Promise<MichelsonV1Expression>;
    
  /**
   * @description Access the value associated with a sapling state ID.
   * @param id Sapling state ID
   */
    getSaplingDiffById(id:string, block: BlockIdProvider): Promise<SaplingDiffResponse>;

  /**
   * @description Return the list of entrypoints of the contract
   * @param contract address of the contract we want to get the entrypoints of
   */
    getEntrypoints(contract: string): Promise<EntrypointsResponse>;

  /**
   * @description Access the chain id
   * @see RpcClient.getBlockHeader().chain_id
   */
    getChainId(): Promise<string>

  /**
   * @description Indicate if an account is revealed
   * @param publicKeyHash of the account 
   * note: Currently determined by calling RpcClient.getManagerKey()
   */
    isAccountRevealed(publicKeyHash: string, block: BlockIdProvider): Promise<boolean>;

  /**
   * @description List the ancestors of the given block which, if referred to as the branch in an operation header, are recent enough for that operation to be included in the current block.
   */
    getLiveBlocks(block: BlockIdProvider): Promise<string[]>

}