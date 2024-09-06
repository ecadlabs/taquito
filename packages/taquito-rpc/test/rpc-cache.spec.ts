import { RpcClientCache } from '../src/rpc-client-modules/rpc-cache';
import {
  rpcUrl,
  blockHash,
  liveBlocks,
  balance,
  unstakeRequestsResponse,
  storage,
  script,
  contract,
  managerKey,
  delegate,
  bigmapValue,
  delegates,
  votingInfo,
  blockHeader,
  blockMetadata,
  bakingRights,
  attestationRights,
  ballotList,
  ballots,
  currentProposal,
  currentQuorum,
  votesListing,
  proposals,
  entryPoints,
  chainId,
  packData,
  currentPeriod,
  successorPeriod,
  blockResponse,
  protocols,
  constants,
  ticketBalancesResponse,
  pendingOperationsResponse,
  aiLaunchCycle,
} from './data/rpc-responses';

/**
 * RpcClientCache test
 */
describe('RpcClientCache test', () => {
  let rpcCache: RpcClientCache;
  let mockRpcClient: any;

  const address = 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn';
  const contractAddress = 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D';
  const ticketToken = {
    ticketer: contractAddress,
    content_type: { prim: 'string' },
    content: { string: 'ticket1' },
  };

  beforeEach(() => {
    mockRpcClient = {
      getRpcUrl: jest.fn(),
      getBlock: jest.fn(),
      getBlockHash: jest.fn(),
      getLiveBlocks: jest.fn(),
      getBalance: jest.fn(),
      getFullBalance: jest.fn(),
      getStakedBalance: jest.fn(),
      getUnstakedFinalizableBalance: jest.fn(),
      getUnstakedFrozenBalance: jest.fn(),
      getUnstakeRequests: jest.fn(),
      getStorage: jest.fn(),
      getStorageUsedSpace: jest.fn(),
      getStoragePaidSpace: jest.fn(),
      getScript: jest.fn(),
      getNormalizedScript: jest.fn(),
      getContract: jest.fn(),
      getManagerKey: jest.fn(),
      getDelegate: jest.fn(),
      getBigMapExpr: jest.fn(),
      getAllDelegates: jest.fn(),
      getDelegates: jest.fn(),
      getVotingInfo: jest.fn(),
      getConstants: jest.fn(),
      getBlockHeader: jest.fn(),
      getBlockMetadata: jest.fn(),
      getBakingRights: jest.fn(),
      getAttestationRights: jest.fn(),
      getBallotList: jest.fn(),
      getBallots: jest.fn(),
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
      getProtocols: jest.fn(),
      getTicketBalance: jest.fn(),
      getAllTicketBalances: jest.fn(),
      getAdaptiveIssuanceLaunchCycle: jest.fn(),
      getPendingOperations: jest.fn(),
    };

    mockRpcClient.getRpcUrl.mockReturnValue(rpcUrl);
    mockRpcClient.getBlock.mockReturnValue(blockResponse);
    mockRpcClient.getBlockHash.mockReturnValue(blockHash);
    mockRpcClient.getLiveBlocks.mockReturnValue(liveBlocks);
    mockRpcClient.getBalance.mockReturnValue(balance);
    mockRpcClient.getFullBalance.mockReturnValue(balance);
    mockRpcClient.getStakedBalance.mockReturnValue(balance);
    mockRpcClient.getUnstakedFinalizableBalance.mockReturnValue(balance);
    mockRpcClient.getUnstakedFrozenBalance.mockReturnValue(balance);
    mockRpcClient.getUnstakeRequests.mockReturnValue(unstakeRequestsResponse);
    mockRpcClient.getStorage.mockReturnValue(storage);
    mockRpcClient.getStorageUsedSpace.mockReturnValue('100');
    mockRpcClient.getStoragePaidSpace.mockReturnValue('120');
    mockRpcClient.getScript.mockReturnValue(script);
    mockRpcClient.getNormalizedScript.mockReturnValue(script);
    mockRpcClient.getContract.mockReturnValue(contract);
    mockRpcClient.getManagerKey.mockReturnValue(managerKey);
    mockRpcClient.getDelegate.mockReturnValue(delegate);
    mockRpcClient.getBigMapExpr.mockReturnValue(bigmapValue);
    mockRpcClient.getAllDelegates.mockReturnValue([delegate]);
    mockRpcClient.getDelegates.mockReturnValue(delegates);
    mockRpcClient.getVotingInfo.mockReturnValue(votingInfo);
    mockRpcClient.getConstants.mockReturnValue(constants);
    mockRpcClient.getBlockHeader.mockReturnValue(blockHeader);
    mockRpcClient.getBlockMetadata.mockReturnValue(blockMetadata);
    mockRpcClient.getBakingRights.mockReturnValue(bakingRights);
    mockRpcClient.getAttestationRights.mockReturnValue(attestationRights);
    mockRpcClient.getBallotList.mockReturnValue(ballotList);
    mockRpcClient.getBallots.mockReturnValue(ballots);
    mockRpcClient.getCurrentProposal.mockReturnValue(currentProposal);
    mockRpcClient.getCurrentQuorum.mockReturnValue(currentQuorum);
    mockRpcClient.getVotesListings.mockReturnValue(votesListing);
    mockRpcClient.getProposals.mockReturnValue(proposals);
    mockRpcClient.getEntrypoints.mockReturnValue(entryPoints);
    mockRpcClient.getChainId.mockReturnValue(chainId);
    mockRpcClient.packData.mockReturnValue(packData);
    mockRpcClient.getCurrentPeriod.mockReturnValue(currentPeriod);
    mockRpcClient.getSuccessorPeriod.mockReturnValue(successorPeriod);
    mockRpcClient.getProtocols.mockReturnValue(protocols);
    mockRpcClient.getTicketBalance.mockReturnValue('3');
    mockRpcClient.getAllTicketBalances.mockReturnValue(ticketBalancesResponse);
    mockRpcClient.getAdaptiveIssuanceLaunchCycle.mockReturnValue(aiLaunchCycle);
    mockRpcClient.getPendingOperations.mockReturnValue(pendingOperationsResponse);
    rpcCache = new RpcClientCache(mockRpcClient);
  });

  it('RpcClientCache is instantiable', () => {
    const rpcCache = new RpcClientCache(mockRpcClient);
    expect(rpcCache).toBeInstanceOf(RpcClientCache);
  });

  it('getAllCachedData', async () => {
    await rpcCache.getBlockHash();
    await rpcCache.getBlock();
    await rpcCache.getLiveBlocks();
    await rpcCache.getBalance(address);
    await rpcCache.getFullBalance(address);
    await rpcCache.getStakedBalance(address);
    await rpcCache.getUnstakedFinalizableBalance(address);
    await rpcCache.getUnstakedFrozenBalance(address);
    await rpcCache.getUnstakeRequests(address);
    await rpcCache.getStorage(contractAddress);
    await rpcCache.getStoragePaidSpace(contractAddress);
    await rpcCache.getStorageUsedSpace(contractAddress);
    await rpcCache.getScript(contractAddress);
    await rpcCache.getNormalizedScript(contractAddress);
    await rpcCache.getContract(contractAddress);
    await rpcCache.getManagerKey(contractAddress);
    await rpcCache.getDelegate(address);
    await rpcCache.getBigMapExpr('72', 'expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp');
    await rpcCache.getAllDelegates();
    await rpcCache.getDelegates(address);
    await rpcCache.getVotingInfo(address);
    await rpcCache.getConstants();
    await rpcCache.getBlockHeader();
    await rpcCache.getBlockMetadata();
    await rpcCache.getBakingRights();
    await rpcCache.getAttestationRights();
    await rpcCache.getBallotList();
    await rpcCache.getBallots();
    await rpcCache.getCurrentProposal();
    await rpcCache.getCurrentQuorum();
    await rpcCache.getVotesListings();
    await rpcCache.getProposals();
    await rpcCache.getEntrypoints(contractAddress);
    await rpcCache.getChainId();
    await rpcCache.packData({
      data: { bytes: '0000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c' },
      type: { prim: 'bytes' },
    });
    await rpcCache.getCurrentPeriod();
    await rpcCache.getSuccessorPeriod();
    await rpcCache.getProtocols();
    await rpcCache.getTicketBalance(contractAddress, {
      ticketer: contractAddress,
      content_type: { prim: 'string' },
      content: { string: 'ticket1' },
    });
    await rpcCache.getAllTicketBalances(contractAddress);
    await rpcCache.getAdaptiveIssuanceLaunchCycle();
    await rpcCache.getPendingOperations();

    expect(rpcCache.getAllCachedData()['rpcTest/getBlockHash/head/'].response).toEqual(blockHash);
    expect(rpcCache.getAllCachedData()['rpcTest/getBlock/head/'].response).toEqual(blockResponse);
    expect(rpcCache.getAllCachedData()['rpcTest/getLiveBlocks/head/'].response).toEqual(liveBlocks);
    expect(rpcCache.getAllCachedData()[`rpcTest/getBalance/head/${address}/`].response).toEqual(
      balance
    );
    expect(rpcCache.getAllCachedData()[`rpcTest/getFullBalance/head/${address}/`].response).toEqual(
      balance
    );
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStakedBalance/head/${address}/`].response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getUnstakedFinalizableBalance/head/${address}/`].response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getUnstakedFrozenBalance/head/${address}/`].response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getUnstakeRequests/head/${address}/`].response
    ).toEqual(unstakeRequestsResponse);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStorage/head/${contractAddress}/`].response
    ).toEqual(storage);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStoragePaidSpace/head/${contractAddress}/`].response
    ).toEqual('120');
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStorageUsedSpace/head/${contractAddress}/`].response
    ).toEqual('100');
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getScript/head/${contractAddress}/`].response
    ).toEqual(script);
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/getNormalizedScript/head/${contractAddress}/{"unparsing_mode":"Readable"}/`
      ].response
    ).toEqual(script);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getContract/head/${contractAddress}/`].response
    ).toEqual(contract);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getManagerKey/head/${contractAddress}/`].response
    ).toEqual(managerKey);
    expect(rpcCache.getAllCachedData()[`rpcTest/getDelegate/head/${address}/`].response).toEqual(
      delegate
    );
    expect(
      rpcCache.getAllCachedData()[
        'rpcTest/getBigMapExpr/head/72/expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp/'
      ].response
    ).toEqual(bigmapValue);
    expect(rpcCache.getAllCachedData()[`rpcTest/getAllDelegates/head/{}/`].response).toEqual([
      delegate,
    ]);
    expect(rpcCache.getAllCachedData()[`rpcTest/getDelegates/head/${address}/`].response).toEqual(
      delegates
    );
    expect(rpcCache.getAllCachedData()[`rpcTest/getVotingInfo/head/${address}/`].response).toEqual(
      votingInfo
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getConstants/head/'].response).toEqual(constants);
    expect(rpcCache.getAllCachedData()['rpcTest/getBlockHeader/head/'].response).toEqual(
      blockHeader
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getBakingRights/head/{}/'].response).toEqual(
      bakingRights
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getAttestationRights/head/{}/'].response).toEqual(
      attestationRights
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getBallotList/head/'].response).toEqual(ballotList);
    expect(rpcCache.getAllCachedData()['rpcTest/getBallots/head/'].response).toEqual(ballots);
    expect(rpcCache.getAllCachedData()['rpcTest/getCurrentProposal/head/'].response).toEqual(
      currentProposal
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getCurrentQuorum/head/'].response).toEqual(
      currentQuorum
    );
    expect(rpcCache.getAllCachedData()['rpcTest/getVotesListings/head/'].response).toEqual(
      votesListing
    );
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getEntrypoints/head/${contractAddress}/`].response
    ).toEqual(entryPoints);
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
    expect(rpcCache.getAllCachedData()['rpcTest/getProtocols/head/'].response).toEqual(protocols);
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/getTicketBalance/head/${contractAddress}/${JSON.stringify(ticketToken)}/`
      ].response
    ).toEqual('3');
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getAllTicketBalances/head/${contractAddress}/`].response
    ).toEqual(ticketBalancesResponse);
    expect(
      rpcCache.getAllCachedData()['rpcTest/getAdaptiveIssuanceLaunchCycle/head/'].response
    ).toEqual(aiLaunchCycle);
    expect(rpcCache.getAllCachedData()[`rpcTest/getPendingOperations/{}/`].response).toEqual(
      pendingOperationsResponse
    );

    rpcCache.deleteAllCachedData();
  });

  it('getAllCachedData when block level is different from head', async () => {
    const block = { block: '1111' };
    await rpcCache.getBlockHash(block);
    await rpcCache.getBlock(block);
    await rpcCache.getLiveBlocks(block);
    await rpcCache.getBalance(address, block);
    await rpcCache.getFullBalance(address, block);
    await rpcCache.getStakedBalance(address, block);
    await rpcCache.getUnstakedFinalizableBalance(address, block);
    await rpcCache.getUnstakedFrozenBalance(address, block);
    await rpcCache.getUnstakeRequests(address, block);
    await rpcCache.getStorage(contractAddress, block);
    await rpcCache.getStoragePaidSpace(contractAddress, block);
    await rpcCache.getStorageUsedSpace(contractAddress, block);
    await rpcCache.getScript(contractAddress, block);
    await rpcCache.getNormalizedScript(contractAddress, { unparsing_mode: 'Readable' }, block);
    await rpcCache.getContract(contractAddress, block);
    await rpcCache.getManagerKey(contractAddress, block);
    await rpcCache.getDelegate(address, block);
    await rpcCache.getBigMapExpr(
      '72',
      'expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp',
      block
    );
    await rpcCache.getAllDelegates({}, block);
    await rpcCache.getDelegates(address, block);
    await rpcCache.getVotingInfo(address, block);
    await rpcCache.getConstants(block);
    await rpcCache.getBlockHeader(block);
    await rpcCache.getBlockMetadata(block);
    await rpcCache.getBakingRights({ level: 1111 }, block);
    await rpcCache.getAttestationRights({ level: 151187 }, block);
    await rpcCache.getBallotList(block);
    await rpcCache.getBallots(block);
    await rpcCache.getCurrentProposal(block);
    await rpcCache.getCurrentQuorum(block);
    await rpcCache.getVotesListings(block);
    await rpcCache.getProposals(block);
    await rpcCache.getEntrypoints(contractAddress, block);
    await rpcCache.getChainId();
    await rpcCache.packData(
      { data: { bytes: '0000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c' }, type: { prim: 'bytes' } },
      block
    );
    await rpcCache.getCurrentPeriod(block);
    await rpcCache.getSuccessorPeriod(block);
    await rpcCache.getProtocols(block);
    await rpcCache.getTicketBalance(
      contractAddress,
      {
        ticketer: contractAddress,
        content_type: { prim: 'string' },
        content: { string: 'ticket1' },
      },
      block
    );
    await rpcCache.getAllTicketBalances(contractAddress, block);
    await rpcCache.getAdaptiveIssuanceLaunchCycle(block);

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
      rpcCache.getAllCachedData()[`rpcTest/getBalance/${block.block}/${address}/`].response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getFullBalance/${block.block}/${address}/`].response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStakedBalance/${block.block}/${address}/`].response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/getUnstakedFinalizableBalance/${block.block}/${address}/`
      ].response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getUnstakedFrozenBalance/${block.block}/${address}/`]
        .response
    ).toEqual(balance);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getUnstakeRequests/${block.block}/${address}/`].response
    ).toEqual(unstakeRequestsResponse);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStorage/${block.block}/${contractAddress}/`].response
    ).toEqual(storage);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStoragePaidSpace/${block.block}/${contractAddress}/`]
        .response
    ).toEqual('120');
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getStorageUsedSpace/${block.block}/${contractAddress}/`]
        .response
    ).toEqual('100');
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getScript/${block.block}/${contractAddress}/`].response
    ).toEqual(script);
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/getNormalizedScript/${block.block}/${contractAddress}/{"unparsing_mode":"Readable"}/`
      ].response
    ).toEqual(script);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getContract/${block.block}/${contractAddress}/`].response
    ).toEqual(contract);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getManagerKey/${block.block}/${contractAddress}/`]
        .response
    ).toEqual(managerKey);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getDelegate/${block.block}/${address}/`].response
    ).toEqual(delegate);
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/getBigMapExpr/${block.block}/72/expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp/`
      ].response
    ).toEqual(bigmapValue);
    console.log(`rpcTest/getAllDelegates/${block.block}/{}`);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getAllDelegates/${block.block}/{}/`].response
    ).toEqual([delegate]);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getDelegates/${block.block}/${address}/`].response
    ).toEqual(delegates);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getVotingInfo/${block.block}/${address}/`].response
    ).toEqual(votingInfo);
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
      rpcCache.getAllCachedData()[`rpcTest/getAttestationRights/${block.block}/{"level":151187}/`]
        .response
    ).toEqual(attestationRights);
    expect(rpcCache.getAllCachedData()[`rpcTest/getBallotList/${block.block}/`].response).toEqual(
      ballotList
    );
    expect(rpcCache.getAllCachedData()[`rpcTest/getBallots/${block.block}/`].response).toEqual(
      ballots
    );
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
      rpcCache.getAllCachedData()[`rpcTest/getEntrypoints/${block.block}/${contractAddress}/`]
        .response
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
    expect(rpcCache.getAllCachedData()[`rpcTest/getProtocols/${block.block}/`].response).toEqual(
      protocols
    );
    expect(
      rpcCache.getAllCachedData()[
        `rpcTest/getTicketBalance/${block.block}/${contractAddress}/${JSON.stringify(ticketToken)}/`
      ].response
    ).toEqual('3');
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getAllTicketBalances/${block.block}/${contractAddress}/`]
        .response
    ).toEqual(ticketBalancesResponse);
    expect(
      rpcCache.getAllCachedData()[`rpcTest/getAdaptiveIssuanceLaunchCycle/${block.block}/`].response
    ).toEqual(aiLaunchCycle);
    rpcCache.deleteAllCachedData();
  });

  it('deleteAllCachedData', async () => {
    await rpcCache.getBlockHash();
    await rpcCache.getBlock();
    await rpcCache.getLiveBlocks();
    await rpcCache.getBalance(address);
    await rpcCache.getFullBalance(address);
    await rpcCache.getStakedBalance(address);
    await rpcCache.getUnstakedFinalizableBalance(address);
    await rpcCache.getUnstakedFrozenBalance(address);
    await rpcCache.getUnstakeRequests(address);
    await rpcCache.getStorage(contractAddress);
    await rpcCache.getStoragePaidSpace(contractAddress);
    await rpcCache.getStorageUsedSpace(contractAddress);
    await rpcCache.getScript(contractAddress);
    await rpcCache.getNormalizedScript(contractAddress);
    await rpcCache.getContract(contractAddress);
    await rpcCache.getManagerKey(contractAddress);
    await rpcCache.getDelegate(address);
    await rpcCache.getBigMapExpr('72', 'expruPtxxirR4BVqFH43VcmEFZqHaQHJhZQDRVTMgSYAGGgBhBRxfp');
    await rpcCache.getAllDelegates();
    await rpcCache.getDelegates(address);
    await rpcCache.getVotingInfo(address);
    await rpcCache.getConstants();
    await rpcCache.getBlockHeader();
    await rpcCache.getBlockMetadata();
    await rpcCache.getBakingRights();
    await rpcCache.getAttestationRights();
    await rpcCache.getBallotList();
    await rpcCache.getBallots();
    await rpcCache.getCurrentProposal();
    await rpcCache.getCurrentQuorum();
    await rpcCache.getVotesListings();
    await rpcCache.getProposals();
    await rpcCache.getEntrypoints(contractAddress);
    await rpcCache.getChainId();
    await rpcCache.packData({
      data: { bytes: '0000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c' },
      type: { prim: 'bytes' },
    });
    await rpcCache.getCurrentPeriod();
    await rpcCache.getSuccessorPeriod();
    await rpcCache.getProtocols();
    await rpcCache.getTicketBalance(contractAddress, ticketToken);
    await rpcCache.getAllTicketBalances(contractAddress);
    await rpcCache.getAdaptiveIssuanceLaunchCycle();
    await rpcCache.getPendingOperations();

    rpcCache.deleteAllCachedData();

    expect(rpcCache.getAllCachedData()).toEqual({});
  });

  it('retrieves the block hash by calling the mocked RpcClient, not from the cache', async () => {
    mockRpcClient.getBlockHash.mockReturnValue('BlockHash');
    const blockHash = await rpcCache.getBlockHash();
    expect(mockRpcClient.getBlockHash).toHaveBeenCalledTimes(1);
    expect(blockHash).toEqual('BlockHash');
    rpcCache.deleteAllCachedData();
  });

  it('The first call to getBlockHash retrieves the block hash by calling the mocked RpcClient, the second request hits the cache', async () => {
    mockRpcClient.getBlockHash.mockReturnValue('BlockHash');
    await rpcCache.getBlockHash();
    await rpcCache.getBlockHash();
    // mockRpcClient should only be called once
    expect(mockRpcClient.getBlockHash).toHaveBeenCalledTimes(1);
    rpcCache.deleteAllCachedData();
  });
});
