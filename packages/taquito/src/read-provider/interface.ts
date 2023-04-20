import {
  BlockResponse,
  EntrypointsResponse,
  MichelsonV1Expression,
  SaplingDiffResponse,
  ScriptedContracts,
} from '@taquito/rpc';
import BigNumber from 'bignumber.js';

export type BigMapQuery = {
  id: string;
  expr: string;
};

export type SaplingStateQuery = {
  id: string;
};

// block identifier can be head, a block relative to head, a block hash or a block level
export type BlockIdentifier = 'head' | `head~${number}` | `B${string}` | number;

export interface TzReadProvider {
  /**
   * @description Access the balance of a contract.
   * @param address address from which we want to retrieve the balance
   * @param block from which we want to retrieve the balance
   * @returns the balance in mutez
   */
  getBalance(address: string, block: BlockIdentifier): Promise<BigNumber>;

  /**
   * @description Access the delegate of a contract, if any.
   * @param address contract address from which we want to retrieve the delegate (baker)
   * @param block from which we want to retrieve the delegate
   * @returns the public key hash of the delegate or null if no delegate
   */
  getDelegate(address: string, block: BlockIdentifier): Promise<string | null>;

  /**
   * @description Access the next protocol hash
   * @param block from which we want to retrieve the next protocol hash
   */
  getNextProtocol(block: BlockIdentifier): Promise<string>;

  /**
   * @description Access protocol constants used in Taquito
   * @param block from which we want to retrieve the constants
   */
  getProtocolConstants(block: BlockIdentifier): Promise<{
    time_between_blocks?: BigNumber[];
    minimal_block_delay?: BigNumber;
    hard_gas_limit_per_operation: BigNumber;
    hard_gas_limit_per_block: BigNumber;
    hard_storage_limit_per_operation: BigNumber;
    cost_per_byte: BigNumber;
    tx_rollup_origination_size?: number;
    smart_rollup_origination_size: number;
  }>;

  /**
   * @description Access the script (code and storage) of a smart contract
   * @param contract contract address from which we want to retrieve the script
   * @param block from which we want to retrieve the storage value
   * @returns Note: The code must be in the JSON format and not contain global constant
   */
  getScript(contract: string, block: BlockIdentifier): Promise<ScriptedContracts>;

  /**
   * @description Access the storage of a contract
   * @param contract contract address from which we want to retrieve the storage
   * @param block from which we want to retrieve the storage value
   */
  getStorage(contract: string, block: BlockIdentifier): Promise<MichelsonV1Expression>;

  /**
   * @description Access the block hash
   */
  getBlockHash(block: BlockIdentifier): Promise<string>;

  /**
   * @description Access the block level
   */
  getBlockLevel(block: BlockIdentifier): Promise<number>;

  /**
   * @description Access the counter of an address
   * @param pkh from which we want to retrieve the counter
   * @param block from which we want to retrieve the counter
   */
  getCounter(pkh: string, block: BlockIdentifier): Promise<string>;

  /**
   * @description Access the timestamp of a block
   * @param block from which we want to retrieve the timestamp
   * @returns date ISO format zero UTC offset ("2022-01-19T22:37:07Z")
   */
  getBlockTimestamp(block: BlockIdentifier): Promise<string>;

  /**
   * @description Access the value associated with a key in a big map.
   * @param bigMapQuery Big Map ID and Expression hash to query (A b58check encoded Blake2b hash of the expression)
   * @param block from which we want to retrieve the big map value
   */
  getBigMapValue(bigMapQuery: BigMapQuery, block: BlockIdentifier): Promise<MichelsonV1Expression>;

  /**
   * @description Access the value associated with a sapling state ID.
   * @param id Sapling state ID
   * @param block from which we want to retrieve the sapling state
   */
  getSaplingDiffById(
    saplingStateQuery: SaplingStateQuery,
    block: BlockIdentifier
  ): Promise<SaplingDiffResponse>;

  /**
   * @description Access the sapling state of a smart contract.
   * @param contractAddress The address of the smart contract
   * @param block The block you want to retrieve the sapling state from
   */
  getSaplingDiffByContract(
    contractAddress: string,
    block: BlockIdentifier
  ): Promise<SaplingDiffResponse>;

  /**
   * @description Return the list of entrypoints of the contract
   * @param contract address of the contract we want to get the entrypoints of
   */
  getEntrypoints(contract: string): Promise<EntrypointsResponse>;

  /**
   * @description Access the chain id
   */
  getChainId(): Promise<string>;

  /**
   * @description Indicate if an account is revealed
   * @param publicKeyHash of the account
   * @param block from which we want to know if the account is revealed
   */
  isAccountRevealed(publicKeyHash: string, block: BlockIdentifier): Promise<boolean>;

  /**
   * @description Return all the information about a block
   * @param block from which we want to retrieve the information
   */
  getBlock(block: BlockIdentifier): Promise<BlockResponse>;

  /**
   * @description Return a list of the ancestors of the given block which, if referred to as the branch in an operation header, are recent enough for that operation to be included in the current block.
   * @param block from which we want to retrieve the information
   */
  getLiveBlocks(block: BlockIdentifier): Promise<string[]>;
}
