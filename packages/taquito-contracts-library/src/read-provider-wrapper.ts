import { BigNumber } from 'bignumber.js';
import {
  BlockResponse,
  EntrypointsResponse,
  MichelsonV1Expression,
  SaplingDiffResponse,
  ScriptedContracts,
} from '@taquito/rpc';
import { ContractsLibrary } from './taquito-contracts-library';
import { BigMapQuery, BlockIdentifier, SaplingStateQuery, TzReadProvider } from '@taquito/taquito';

export class ReadWrapperContractsLibrary implements TzReadProvider {
  constructor(private readProvider: TzReadProvider, private contractslibrary: ContractsLibrary) {}

  async getScript(address: string, block: BlockIdentifier): Promise<ScriptedContracts> {
    const contractData = this.contractslibrary.getContract(address);
    if (contractData) {
      return contractData.script;
    } else {
      return this.readProvider.getScript(address, block);
    }
  }

  async getEntrypoints(contract: string): Promise<EntrypointsResponse> {
    const contractData = this.contractslibrary.getContract(contract);
    if (contractData) {
      return contractData.entrypoints;
    } else {
      return this.readProvider.getEntrypoints(contract);
    }
  }

  getBalance(address: string, block: BlockIdentifier): Promise<BigNumber> {
    return this.readProvider.getBalance(address, block);
  }
  getDelegate(address: string, block: BlockIdentifier): Promise<string | null> {
    return this.readProvider.getDelegate(address, block);
  }
  getNextProtocol(block: BlockIdentifier): Promise<string> {
    return this.readProvider.getNextProtocol(block);
  }
  getProtocolConstants(block: BlockIdentifier): Promise<{
    time_between_blocks?: BigNumber[] | undefined;
    minimal_block_delay?: BigNumber | undefined;
    hard_gas_limit_per_operation: BigNumber;
    hard_gas_limit_per_block: BigNumber;
    hard_storage_limit_per_operation: BigNumber;
    cost_per_byte: BigNumber;
    smart_rollup_origination_size: number;
  }> {
    return this.readProvider.getProtocolConstants(block);
  }
  getStorage(contract: string, block: BlockIdentifier): Promise<MichelsonV1Expression> {
    return this.readProvider.getStorage(contract, block);
  }
  getBlockHash(block: BlockIdentifier): Promise<string> {
    return this.readProvider.getBlockHash(block);
  }
  getBlockLevel(block: BlockIdentifier): Promise<number> {
    return this.readProvider.getBlockLevel(block);
  }
  getCounter(pkh: string, block: BlockIdentifier): Promise<string> {
    return this.readProvider.getCounter(pkh, block);
  }
  getBlockTimestamp(block: BlockIdentifier): Promise<string> {
    return this.readProvider.getBlockTimestamp(block);
  }
  getBigMapValue(bigMapQuery: BigMapQuery, block: BlockIdentifier): Promise<MichelsonV1Expression> {
    return this.readProvider.getBigMapValue(bigMapQuery, block);
  }
  getSaplingDiffById(
    saplingStateQuery: SaplingStateQuery,
    block: BlockIdentifier
  ): Promise<SaplingDiffResponse> {
    return this.readProvider.getSaplingDiffById(saplingStateQuery, block);
  }
  getSaplingDiffByContract(
    contractAddress: string,
    block: BlockIdentifier
  ): Promise<SaplingDiffResponse> {
    return this.readProvider.getSaplingDiffByContract(contractAddress, block);
  }
  getChainId(): Promise<string> {
    return this.readProvider.getChainId();
  }
  isAccountRevealed(publicKeyHash: string, block: BlockIdentifier): Promise<boolean> {
    return this.readProvider.isAccountRevealed(publicKeyHash, block);
  }
  getBlock(block: BlockIdentifier): Promise<BlockResponse> {
    return this.readProvider.getBlock(block);
  }
  getLiveBlocks(block: BlockIdentifier): Promise<string[]> {
    return this.readProvider.getLiveBlocks(block);
  }
}
