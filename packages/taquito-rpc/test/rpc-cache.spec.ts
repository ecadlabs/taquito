import { constants } from 'buffer';
import { RpcClientCache } from '../src/rpc-client-modules/rpc-cache';
import {
  rpcUrl,
  blockHash,
  liveBlocks,
  balance,
  storage,
  script,
  contract,
  managerKey,
  delegate,
  bigmapValue,
  delegates,
  blockHeader,
  blockMetadata,
  bakingRights,
  endorsingRights,
  ballotList,
  ballots,
  currentPeriodKind,
  currentProposal,
  currentQuorum,
  votesListing,
  porposals,
  entryPoints,
  chainId,
  packData,
  currentPeriod,
  successorPeriod,
  blockResponse,
} from './data/rpc-responses';

/**
 * RpcClientCache test
 */
describe('RpcClientCache test', () => {
  let rpcCache: RpcClientCache;
  let mockRpcClient: any;

  beforeEach(() => {
    mockRpcClient = {
      getRpcUrl: jest.fn(),
      getBlock: jest.fn(),
      getBlockHash: jest.fn(),
      getLiveBlocks: jest.fn(),
      getBalance: jest.fn(),
      getStorage: jest.fn(),
      getScript: jest.fn(),
      getNormalizedScript: jest.fn(),
      getContract: jest.fn(),
      getManagerKey: jest.fn(),
      getDelegate: jest.fn(),
      getBigMapExpr: jest.fn(),
      getDelegates: jest.fn(),
      getConstants: jest.fn(),
      getBlockHeader: jest.fn(),
      getBlockMetadata: jest.fn(),
      getBakingRights: jest.fn(),
      getEndorsingRights: jest.fn(),
      getBallotList: jest.fn(),
      getBallots: jest.fn(),
      getCurrentPeriodKind: jest.fn(),
      getCurrentProposal: jest.fn(),
      getCurrentQuorum: jest.fn(),
      getVotesListings: jest.fn(),
      getProposals: jest.fn(),
      getEntrypoints: jest.fn(),
      runCode: jest.fn(),
      getChainId: jest.fn(),
      packData: jest.fn(),
      getCurrentPeriod: jest.fn(),
      getSuccessorPeriod: jest.fn(),
    };

    mockRpcClient.getRpcUrl.mockReturnValue(rpcUrl);
    mockRpcClient.getBlock.mockReturnValue(blockResponse);
    mockRpcClient.getBlockHash.mockReturnValue(blockHash);
    mockRpcClient.getLiveBlocks.mockReturnValue(liveBlocks);
    mockRpcClient.getBalance.mockReturnValue(balance);
    mockRpcClient.getStorage.mockReturnValue(storage);
    mockRpcClient.getScript.mockReturnValue(script);
    mockRpcClient.getNormalizedScript.mockReturnValue(script);
    mockRpcClient.getContract.mockReturnValue(contract);
    mockRpcClient.getManagerKey.mockReturnValue(managerKey);
    mockRpcClient.getDelegate.mockReturnValue(delegate);
    mockRpcClient.getBigMapExpr.mockReturnValue(bigmapValue);
    mockRpcClient.getDelegates.mockReturnValue(delegates);
    mockRpcClient.getConstants.mockReturnValue(constants);
    mockRpcClient.getBlockHeader.mockReturnValue(blockHeader);
    mockRpcClient.getBlockMetadata.mockReturnValue(blockMetadata);
    mockRpcClient.getBakingRights.mockReturnValue(bakingRights);
    mockRpcClient.getEndorsingRights.mockReturnValue(endorsingRights);
    mockRpcClient.getBallotList.mockReturnValue(ballotList);
    mockRpcClient.getBallots.mockReturnValue(ballots);
    mockRpcClient.getCurrentPeriodKind.mockReturnValue(currentPeriodKind);
    mockRpcClient.getCurrentProposal.mockReturnValue(currentProposal);
    mockRpcClient.getCurrentQuorum.mockReturnValue(currentQuorum);
    mockRpcClient.getVotesListings.mockReturnValue(votesListing);
    mockRpcClient.getProposals.mockReturnValue(porposals);
    mockRpcClient.getEntrypoints.mockReturnValue(entryPoints);
    mockRpcClient.getChainId.mockReturnValue(chainId);
    mockRpcClient.packData.mockReturnValue(packData);
    mockRpcClient.getCurrentPeriod.mockReturnValue(currentPeriod);
    mockRpcClient.getSuccessorPeriod.mockReturnValue(successorPeriod);

    rpcCache = new RpcClientCache(mockRpcClient);
  });

  it('RpcClientCache is instantiable', () => {
    const rpcCache = new RpcClientCache(mockRpcClient);
    expect(rpcCache).toBeInstanceOf(RpcClientCache);
  });

  it('getAllCachedData', async (done) => {
    await rpcCache.getBlockHash();
    await rpcCache.getBlock();
    await rpcCache.getLiveBlocks();
    await rpcCache.getBalance('address');
    await rpcCache.getStorage('address');
    await rpcCache.getScript('address');
    await rpcCache.getNormalizedScript('address');
    await rpcCache.getContract('address');
    await rpcCache.getManagerKey('address');
    await rpcCache.getDelegate('address');
    await rpcCache.getBigMapExpr('72', 'expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp');
    await rpcCache.getDelegates('address');
    await rpcCache.getConstants();
    await rpcCache.getBlockHeader();
    await rpcCache.getBlockMetadata();
    await rpcCache.getBakingRights();
    await rpcCache.getEndorsingRights();
    await rpcCache.getBallotList();
    await rpcCache.getBallots();
    await rpcCache.getCurrentPeriodKind();
    await rpcCache.getCurrentProposal();
    await rpcCache.getCurrentQuorum();
    await rpcCache.getVotesListings();
    await rpcCache.getProposals();
    await rpcCache.getEntrypoints('address');
    await rpcCache.getChainId();
    await rpcCache.packData({
      data: { bytes: '0000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c' },
      type: { prim: 'bytes' },
    });
    await rpcCache.getCurrentPeriod();
    await rpcCache.getSuccessorPeriod();

    expect(rpcCache.getAllCachedData()['rpcTest/getBlockHash/head/'].response).toEqual(blockHash);
    expect(rpcCache.getAllCachedData()['rpcTest/getBlock/head/'].response).toEqual(blockResponse);
    expect(rpcCache.getAllCachedData()['rpcTest/getLiveBlocks/head/'].response).toEqual(liveBlocks);
    expect(rpcCache.getAllCachedData()['rpcTest/getBalance/head/address/'].response).toEqual(
      balance
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getStorage/head/address/'].response).toEqual(
      storage
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getScript/head/address/'].response).toEqual(script);
    expect(
      rpcCache.getAllCachedData()[
        'rpcTest/getNormalizedScript/head/address/{"unparsing_mode":"Readable"}/'
      ].response
    ).toEqual(script);
    expect(rpcCache.getAllCachedData()['rpcTest/getContract/head/address/'].response).toEqual(
      contract
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getManagerKey/head/address/'].response).toEqual(
      managerKey
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getDelegate/head/address/'].response).toEqual(
      delegate
    );
    expect(
      rpcCache.getAllCachedData()[
        'rpcTest/getBigMapExpr/head/72/expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp/'
      ].response
    ).toEqual(bigmapValue);
    expect(rpcCache.getAllCachedData()['rpcTest/getDelegates/head/address/'].response).toEqual(
      delegates
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getConstants/head/'].response).toEqual(constants);
    expect(rpcCache.getAllCachedData()['rpcTest/getBlockHeader/head/'].response).toEqual(
      blockHeader
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getBakingRights/head/{}/'].response).toEqual(
      bakingRights
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getEndorsingRights/head/{}/'].response).toEqual(
      endorsingRights
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getBallotList/head/'].response).toEqual(ballotList);
    expect(rpcCache.getAllCachedData()['rpcTest/getBallots/head/'].response).toEqual(ballots);
    expect(rpcCache.getAllCachedData()['rpcTest/getCurrentPeriodKind/head/'].response).toEqual(
      currentPeriodKind
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getCurrentProposal/head/'].response).toEqual(
      currentProposal
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getCurrentQuorum/head/'].response).toEqual(
      currentQuorum
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getVotesListings/head/'].response).toEqual(
      votesListing
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getEntrypoints/head/address/'].response).toEqual(
      entryPoints
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getChainId/'].response).toEqual(chainId);
    expect(
      rpcCache.getAllCachedData()[
        'rpcTest/packData/head/{"data":{"bytes":"0000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c"},"type":{"prim":"bytes"}}/'
      ].response
    ).toEqual(packData);
    expect(rpcCache.getAllCachedData()['rpcTest/getCurrentPeriod/head/'].response).toEqual(
      currentPeriod
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getSuccessorPeriod/head/'].response).toEqual(
      successorPeriod
    );

    rpcCache.deleteAllCachedData();
    done();
  });

  it('getAllCachedData when block level is different from head', async (done) => {
    const block = { block: '1111' };
    await rpcCache.getBlockHash(block);
    await rpcCache.getBlock(block);
    await rpcCache.getLiveBlocks(block);
    await rpcCache.getBalance('address', block);
    await rpcCache.getStorage('address', block);
    await rpcCache.getScript('address', block);
    await rpcCache.getNormalizedScript('address', { unparsing_mode: 'Readable' }, block);
    await rpcCache.getContract('address', block);
    await rpcCache.getManagerKey('address', block);
    await rpcCache.getDelegate('address', block);
    await rpcCache.getBigMapExpr(
      '72',
      'expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp',
      block
    );
    await rpcCache.getDelegates('address', block);
    await rpcCache.getConstants(block);
    await rpcCache.getBlockHeader(block);
    await rpcCache.getBlockMetadata(block);
    await rpcCache.getBakingRights({ level: 1111 }, block);
    await rpcCache.getEndorsingRights({ level: 1111 }, block);
    await rpcCache.getBallotList(block);
    await rpcCache.getBallots(block);
    await rpcCache.getCurrentPeriodKind(block);
    await rpcCache.getCurrentProposal(block);
    await rpcCache.getCurrentQuorum(block);
    await rpcCache.getVotesListings(block);
    await rpcCache.getProposals(block);
    await rpcCache.getEntrypoints('address', block);
    await rpcCache.getChainId();
    await rpcCache.packData(
      { data: { bytes: '0000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c' }, type: { prim: 'bytes' } },
      block
    );
    await rpcCache.getCurrentPeriod(block);
    await rpcCache.getSuccessorPeriod(block);

    expect(rpcCache.getAllCachedData()[`rpcTest/getBlockHash/${block.block}/`].response).toEqual(
      blockHash
    );
    expect(rpcCache.getAllCachedData()[`rpcTest/getBlock/${block.block}/`].response).toEqual(
      blockResponse
    );
    expect(rpcCache.getAllCachedData()[`rpcTest/getLiveBlocks/${block.block}/`].response).toEqual(
      liveBlocks
    );
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getBalance/${block.block}/address/`].response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStorage/${block.block}/address/`].response
    ).toEqual(storage);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getScript/${block.block}/address/`].response
    ).toEqual(script);
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/getNormalizedScript/${block.block}/address/{"unparsing_mode":"Readable"}/`
      ].response
    ).toEqual(script);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getContract/${block.block}/address/`].response
    ).toEqual(contract);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getManagerKey/${block.block}/address/`].response
    ).toEqual(managerKey);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getDelegate/${block.block}/address/`].response
    ).toEqual(delegate);
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/getBigMapExpr/${block.block}/72/expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp/`
      ].response
    ).toEqual(bigmapValue);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getDelegates/${block.block}/address/`].response
    ).toEqual(delegates);
    expect(rpcCache.getAllCachedData()[`rpcTest/getConstants/${block.block}/`].response).toEqual(
      constants
    );
    expect(rpcCache.getAllCachedData()[`rpcTest/getBlockHeader/${block.block}/`].response).toEqual(
      blockHeader
    );
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getBakingRights/${block.block}/{"level":1111}/`].response
    ).toEqual(bakingRights);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getEndorsingRights/${block.block}/{"level":1111}/`]
        .response
    ).toEqual(endorsingRights);
    expect(rpcCache.getAllCachedData()[`rpcTest/getBallotList/${block.block}/`].response).toEqual(
      ballotList
    );
    expect(rpcCache.getAllCachedData()[`rpcTest/getBallots/${block.block}/`].response).toEqual(
      ballots
    );
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getCurrentPeriodKind/${block.block}/`].response
    ).toEqual(currentPeriodKind);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getCurrentProposal/${block.block}/`].response
    ).toEqual(currentProposal);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getCurrentQuorum/${block.block}/`].response
    ).toEqual(currentQuorum);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getVotesListings/${block.block}/`].response
    ).toEqual(votesListing);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getEntrypoints/${block.block}/address/`].response
    ).toEqual(entryPoints);
    expect(rpcCache.getAllCachedData()[`rpcTest/getChainId/`].response).toEqual(chainId);
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/packData/${block.block}/{"data":{"bytes":"0000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c"},"type":{"prim":"bytes"}}/`
      ].response
    ).toEqual(packData);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getCurrentPeriod/${block.block}/`].response
    ).toEqual(currentPeriod);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getSuccessorPeriod/${block.block}/`].response
    ).toEqual(successorPeriod);

    rpcCache.deleteAllCachedData();
    done();
  });

  it('deleteAllCachedData', async (done) => {
    await rpcCache.getBlockHash();
    await rpcCache.getBlock();
    await rpcCache.getLiveBlocks();
    await rpcCache.getBalance('address');
    await rpcCache.getStorage('address');
    await rpcCache.getScript('address');
    await rpcCache.getNormalizedScript('address');
    await rpcCache.getContract('address');
    await rpcCache.getManagerKey('address');
    await rpcCache.getDelegate('address');
    await rpcCache.getBigMapExpr('72', 'expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp');
    await rpcCache.getDelegates('address');
    await rpcCache.getConstants();
    await rpcCache.getBlockHeader();
    await rpcCache.getBlockMetadata();
    await rpcCache.getBakingRights();
    await rpcCache.getEndorsingRights();
    await rpcCache.getBallotList();
    await rpcCache.getBallots();
    await rpcCache.getCurrentPeriodKind();
    await rpcCache.getCurrentProposal();
    await rpcCache.getCurrentQuorum();
    await rpcCache.getVotesListings();
    await rpcCache.getProposals();
    await rpcCache.getEntrypoints('address');
    await rpcCache.getChainId();
    await rpcCache.packData({
      data: { bytes: '0000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c' },
      type: { prim: 'bytes' },
    });
    await rpcCache.getCurrentPeriod();
    await rpcCache.getSuccessorPeriod();

    rpcCache.deleteAllCachedData();

    expect(rpcCache.getAllCachedData()).toEqual({});
    done();
  });

  it('retrieves the block hash by calling the mocked RpcClient, not from the cache', async (done) => {
    mockRpcClient.getBlockHash.mockReturnValue('BlockHash');
    const blockHash = await rpcCache.getBlockHash();
    expect(mockRpcClient.getBlockHash).toHaveBeenCalledTimes(1);
    expect(blockHash).toEqual('BlockHash');
    rpcCache.deleteAllCachedData();
    done();
  });

  it('The first call to getBlockHash retrieves the block hash by calling the mocked RpcClient, the second request hits the cache', async (done) => {
    mockRpcClient.getBlockHash.mockReturnValue('BlockHash');
    await rpcCache.getBlockHash();
    await rpcCache.getBlockHash();
    // mockRpcClient should only be called once
    expect(mockRpcClient.getBlockHash).toHaveBeenCalledTimes(1);
    rpcCache.deleteAllCachedData();
    done();
  });
});
