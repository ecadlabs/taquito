import { RpcReadAdapter } from '../../src/read-provider/rpc-read-adapter';
import BigNumber from 'bignumber.js';
import { BlockIdentifier } from '../../src/read-provider/interface';
import {
  bigmapValue,
  blockHeader,
  blockResponse,
  constantsRpc,
  contractCodeSample,
  contractEntrypoints,
  contractResponse,
  contractStorage,
  liveBlocks,
  aiLaunchCycle,
  saplingState,
} from './data';
import { RpcClient } from '@taquito/rpc';

describe('RpcReadAdapter test', () => {
  let readProvider: RpcReadAdapter;
  let mockRpcClient: {
    getBalance: jest.Mock<any, any>;
    getSpendable: jest.Mock<any, any>;
    getDelegate: jest.Mock<any, any>;
    getProtocols: jest.Mock<any, any>;
    getConstants: jest.Mock<any, any>;
    getNormalizedScript: jest.Mock<any, any>;
    getStorage: jest.Mock<any, any>;
    getBlockHeader: jest.Mock<any, any>;
    getContract: jest.Mock<any, any>;
    getBigMapExpr: jest.Mock<any, any>;
    getSaplingDiffById: jest.Mock<any, any>;
    getSaplingDiffByContract: jest.Mock<any, any>;
    getEntrypoints: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
    getManagerKey: jest.Mock<any, any>;
    getBlock: jest.Mock<any, any>;
    getLiveBlocks: jest.Mock<any, any>;
    getAdaptiveIssuanceLaunchCycle: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockRpcClient = {
      getBalance: jest.fn(),
      getSpendable: jest.fn(),
      getDelegate: jest.fn(),
      getProtocols: jest.fn(),
      getConstants: jest.fn(),
      getNormalizedScript: jest.fn(),
      getStorage: jest.fn(),
      getBlockHeader: jest.fn(),
      getContract: jest.fn(),
      getBigMapExpr: jest.fn(),
      getSaplingDiffById: jest.fn(),
      getSaplingDiffByContract: jest.fn(),
      getEntrypoints: jest.fn(),
      getChainId: jest.fn(),
      getManagerKey: jest.fn(),
      getBlock: jest.fn(),
      getLiveBlocks: jest.fn(),
      getAdaptiveIssuanceLaunchCycle: jest.fn(),
    };
    readProvider = new RpcReadAdapter(mockRpcClient as any);
  });
  it('should instantiate RpcReadAdapter', () => {
    expect(new RpcReadAdapter(new RpcClient('url'))).toBeInstanceOf(RpcReadAdapter);
  });

  // block identifiers in the various formats accepted by the RPC
  const blocks: BlockIdentifier[] = [
    'head',
    'head~2',
    'BMTcqN7phyoB4f1SExBX7YQWpSt88c2eo75cpgxQsSFSeByRkyW',
    123456,
  ];
  blocks.forEach((block) => {
    it(`should get the balance given a pkh at block: ${block}`, async () => {
      mockRpcClient.getBalance.mockResolvedValue(new BigNumber('10000'));

      const result = await readProvider.getBalance('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', block);
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toString()).toStrictEqual('10000');

      expect(mockRpcClient.getBalance.mock.calls[0][0]).toEqual(
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
      );
      expect(mockRpcClient.getBalance.mock.calls[0][1]).toEqual({ block: `${block}` });
    });

    it(`should get the spendable given a pkh at block: ${block}`, async () => {
      mockRpcClient.getSpendable.mockResolvedValue(new BigNumber('10000'));

      const result = await readProvider.getSpendable('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', block);
      expect(result).toBeInstanceOf(BigNumber);
      expect(result.toString()).toStrictEqual('10000');

      expect(mockRpcClient.getSpendable.mock.calls[0][0]).toEqual(
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
      );
      expect(mockRpcClient.getSpendable.mock.calls[0][1]).toEqual({ block: `${block}` });
    });

    it(`should get the delegate given a pkh at block: ${block}`, async () => {
      mockRpcClient.getDelegate.mockResolvedValue('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu');

      const result = await readProvider.getDelegate('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', block);
      expect(result).toEqual('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu');

      expect(mockRpcClient.getDelegate.mock.calls[0][0]).toEqual(
        'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
      );
      expect(mockRpcClient.getDelegate.mock.calls[0][1]).toEqual({ block: `${block}` });
    });

    it(`should get the next protocol at block: ${block}`, async () => {
      mockRpcClient.getProtocols.mockResolvedValue({
        protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
        next_protocol: 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
      });

      const result = await readProvider.getNextProtocol(block);
      expect(result).toEqual('PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx');

      expect(mockRpcClient.getProtocols.mock.calls[0][0]).toEqual({ block: `${block}` });
    });

    it(`should extract protocol constants at block: ${block}`, async () => {
      mockRpcClient.getConstants.mockResolvedValue(constantsRpc);

      const result = await readProvider.getProtocolConstants(block);
      expect(result).toEqual({
        hard_gas_limit_per_operation: new BigNumber('1040000'),
        hard_gas_limit_per_block: new BigNumber('5200000'),
        cost_per_byte: new BigNumber('250'),
        hard_storage_limit_per_operation: new BigNumber('60000'),
        minimal_block_delay: new BigNumber('30'),
        time_between_blocks: [new BigNumber('60'), new BigNumber('40')],
      });

      expect(mockRpcClient.getConstants.mock.calls[0][0]).toEqual({ block: `${block}` });
    });

    it(`should get the storage value of a contract at block: ${block}`, async () => {
      mockRpcClient.getStorage.mockResolvedValue(contractStorage);

      const result = await readProvider.getStorage('KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS', block);
      expect(result).toEqual(contractStorage);

      expect(mockRpcClient.getStorage.mock.calls[0][0]).toEqual(
        'KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS'
      );
      expect(mockRpcClient.getStorage.mock.calls[0][1]).toEqual({ block: `${block}` });
    });

    it(`should get the block hash at block: ${block}`, async () => {
      mockRpcClient.getBlockHeader.mockResolvedValue(blockHeader);

      const result = await readProvider.getBlockHash(block);
      expect(result).toEqual('BMLSgpbkkpjwPcz4V73DBehuyUiusANELHKPMiQhsb9psm5gTWD');

      expect(mockRpcClient.getBlockHeader.mock.calls[0][0]).toEqual({ block: `${block}` });
    });

    it(`should get the block level at block: ${block}`, async () => {
      mockRpcClient.getBlockHeader.mockResolvedValue(blockHeader);

      const result = await readProvider.getBlockLevel(block);
      expect(result).toEqual(2100696);
      expect(mockRpcClient.getBlockHeader.mock.calls[0][0]).toEqual({ block: `${block}` });
    });

    it(`should get the counter given a pkh at block: ${block}`, async () => {
      mockRpcClient.getContract.mockResolvedValue(contractResponse);

      const result = await readProvider.getCounter('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', block);
      expect(result).toEqual('161327');

      expect(mockRpcClient.getContract.mock.calls[0][0]).toEqual(
        'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'
      );
      expect(mockRpcClient.getContract.mock.calls[0][1]).toEqual({ block: `${block}` });
    });

    it(`should get the timestamp at block: ${block}`, async () => {
      mockRpcClient.getBlockHeader.mockResolvedValue(blockHeader);

      const result = await readProvider.getBlockTimestamp(block);
      expect(result).toEqual('2022-02-08T16:49:34Z');

      expect(mockRpcClient.getBlockHeader.mock.calls[0][0]).toEqual({ block: `${block}` });
    });

    it(`should get a bigmap value based on its id and a key (expr) at block: ${block}`, async () => {
      mockRpcClient.getBigMapExpr.mockResolvedValue(bigmapValue);

      const result = await readProvider.getBigMapValue(
        {
          id: '319',
          expr: 'expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp',
        },
        block
      );
      expect(result).toEqual(bigmapValue);

      expect(mockRpcClient.getBigMapExpr.mock.calls[0][0]).toEqual('319');
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][1]).toEqual(
        'expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp'
      );
      expect(mockRpcClient.getBigMapExpr.mock.calls[0][2]).toEqual({ block: `${block}` });
    });

    it(`should get sapling state based on its id at block: ${block}`, async () => {
      mockRpcClient.getSaplingDiffById.mockResolvedValue(saplingState);

      const result = await readProvider.getSaplingDiffById(
        {
          id: '2437',
        },
        block
      );
      expect(result).toEqual(saplingState);
      expect(mockRpcClient.getSaplingDiffById.mock.calls[0][0]).toEqual('2437');
      expect(mockRpcClient.getSaplingDiffById.mock.calls[0][1]).toEqual({ block: `${block}` });
    });

    it(`should get sapling state based on a contract address at block: ${block}`, async () => {
      mockRpcClient.getSaplingDiffByContract.mockResolvedValue(saplingState);

      const result = await readProvider.getSaplingDiffByContract(
        'KT1PCtKMerNZtjHLrjj1EsCWkqoWoEHwFsgK',
        block
      );
      expect(result).toEqual(saplingState);
      expect(mockRpcClient.getSaplingDiffByContract.mock.calls[0][0]).toEqual(
        'KT1PCtKMerNZtjHLrjj1EsCWkqoWoEHwFsgK'
      );
      expect(mockRpcClient.getSaplingDiffByContract.mock.calls[0][1]).toEqual({
        block: `${block}`,
      });
    });

    it(`should get the reveal status (unrevealed) based on a pkh at block: ${block}`, async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(null);

      const result = await readProvider.isAccountRevealed(
        'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        block
      );
      expect(result).toEqual(false);

      expect(mockRpcClient.getManagerKey.mock.calls[0][0]).toEqual(
        'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'
      );
      expect(mockRpcClient.getManagerKey.mock.calls[0][1]).toEqual({ block: `${block}` });
    });

    it(`should get the reveal status (revealed) based on a pkh at block: ${block}`, async () => {
      mockRpcClient.getManagerKey.mockResolvedValue(
        'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t'
      );

      const result = await readProvider.isAccountRevealed(
        'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        block
      );
      expect(result).toEqual(true);

      expect(mockRpcClient.getManagerKey.mock.calls[0][0]).toEqual(
        'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'
      );
      expect(mockRpcClient.getManagerKey.mock.calls[0][1]).toEqual({ block: `${block}` });
    });

    it(`should get the code of a smart contract given its address: ${block}`, async () => {
      mockRpcClient.getContract.mockResolvedValue({
        script: {
          code: contractCodeSample,
          storage: contractStorage,
        },
      });

      const result = await readProvider.getScript('KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS', block);
      expect(result).toEqual({
        code: contractCodeSample,
        storage: contractStorage,
      });

      expect(mockRpcClient.getContract.mock.calls[0][0]).toEqual(
        'KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS'
      );
    });

    it(`should get the block response: ${block}`, async () => {
      mockRpcClient.getBlock.mockResolvedValue(blockResponse);

      const result = await readProvider.getBlock(block);
      expect(result).toEqual(blockResponse);

      expect(mockRpcClient.getBlock.mock.calls[0][0]).toEqual({ block: `${block}` });
    });

    it(`should get the live blocks: ${block}`, async () => {
      mockRpcClient.getLiveBlocks.mockResolvedValue(liveBlocks);

      const result = await readProvider.getLiveBlocks(block);
      expect(result).toEqual(liveBlocks);

      expect(mockRpcClient.getLiveBlocks.mock.calls[0][0]).toEqual({ block: `${block}` });
    });

    it(`should get adaptive issuance launch cycle at block: ${block}`, async () => {
      mockRpcClient.getAdaptiveIssuanceLaunchCycle.mockResolvedValue(aiLaunchCycle);

      const result = await readProvider.getAdaptiveIssuanceLaunchCycle(block);
      expect(result).toEqual(aiLaunchCycle);

      expect(mockRpcClient.getAdaptiveIssuanceLaunchCycle.mock.calls[0][0]).toEqual({
        block: `${block}`,
      });
    });
  });

  it(`should get the chain id`, async () => {
    mockRpcClient.getChainId.mockResolvedValue('NetXdQprcVkpaWU');

    const result = await readProvider.getChainId();
    expect(result).toEqual('NetXdQprcVkpaWU');

    expect(mockRpcClient.getChainId.mock.calls[0][0]).toEqual(undefined);
  });

  it(`should get the entry points of a contract based on its address`, async () => {
    mockRpcClient.getEntrypoints.mockResolvedValue(contractEntrypoints);

    const result = await readProvider.getEntrypoints('KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS');
    expect(result).toEqual(contractEntrypoints);

    expect(mockRpcClient.getEntrypoints.mock.calls[0][0]).toEqual(
      'KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS'
    );
  });
});
