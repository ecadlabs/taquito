import { RpcClient } from "../src/taquito-rpc";
import { RpcCacheDecorator } from "../src/rpc-cache"

/**
 * RpcCacheDecorator test
 */
 describe('RpcCacheDecorator test', () => {
    let rpcCache: RpcClient;
    let mockRpcClient: {
        url: string;
        getBlockHash: jest.Mock<any, any>;
        getLiveBlocks: jest.Mock<any, any>;
        getBalance: jest.Mock<any, any>;
        getStorage: jest.Mock<any, any>;
        getScript: jest.Mock<any, any>;
        getContract: jest.Mock<any, any>;
        getManagerKey: jest.Mock<any, any>;
        getDelegate: jest.Mock<any, any>;
        getBigMapKey: jest.Mock<any, any>;
        getBigMapExpr: jest.Mock<any, any>;
        getDelegates: jest.Mock<any, any>;
        getConstants: jest.Mock<any, any>;
        getBlock: jest.Mock<any, any>;
        getBlockHeader: jest.Mock<any, any>;
        getBlockMetadata: jest.Mock<any, any>;
        getBakingRights: jest.Mock<any, any>;
        getEndorsingRights: jest.Mock<any, any>;
        getBallotList: jest.Mock<any, any>;
        getBallots: jest.Mock<any, any>;
        getCurrentPeriodKind: jest.Mock<any, any>;
        getCurrentProposal: jest.Mock<any, any>;
        getCurrentQuorum: jest.Mock<any, any>;
        getVotesListings: jest.Mock<any, any>;
        getProposals: jest.Mock<any, any>;
        forgeOperations: jest.Mock<any, any>;
        injectOperation: jest.Mock<any, any>;
        preapplyOperations: jest.Mock<any, any>;
        getEntrypoints: jest.Mock<any, any>;
        runOperation: jest.Mock<any, any>;
        runCode: jest.Mock<any, any>;
        getChainId: jest.Mock<any, any>;
        packData: jest.Mock<any, any>;
        getCurrentPeriod: jest.Mock<any, any>;
        getSuccessorPeriod: jest.Mock<any, any>;
        getSaplingDiffById: jest.Mock<any, any>;
        getSaplingDiffByContract: jest.Mock<any, any>;
    };
  
    beforeEach(() => {
        mockRpcClient = {
            url: 'rpcUrl',
            getBlockHash: jest.fn(),
            getLiveBlocks: jest.fn(),
            getBalance: jest.fn(),
            getStorage: jest.fn(),
            getScript: jest.fn(),
            getContract: jest.fn(),
            getManagerKey: jest.fn(),
            getDelegate: jest.fn(),
            getBigMapKey: jest.fn(),
            getBigMapExpr: jest.fn(),
            getDelegates: jest.fn(),
            getConstants: jest.fn(),
            getBlock: jest.fn(),
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
            forgeOperations: jest.fn(),
            injectOperation: jest.fn(),
            preapplyOperations: jest.fn(),
            getEntrypoints: jest.fn(),
            runOperation: jest.fn(),
            runCode: jest.fn(),
            getChainId: jest.fn(),
            packData: jest.fn(),
            getCurrentPeriod: jest.fn(),
            getSuccessorPeriod: jest.fn(),
            getSaplingDiffById: jest.fn(),
            getSaplingDiffByContract: jest.fn()
        }
      rpcCache = new RpcCacheDecorator(mockRpcClient as any);
    }); 

    it('RpcCacheDecorator is instantiable', () => {
        const rpcUrl: string = 'test';
        const rpcCache = new RpcCacheDecorator(new RpcClient(rpcUrl))
        expect(rpcCache).toBeInstanceOf(RpcClient);
        expect(rpcCache).toBeInstanceOf(RpcCacheDecorator);
    });

    it('get getBlockHash from the RPC, not from the cache', async done => {
        mockRpcClient.getBlockHash.mockReturnValue(Promise.resolve('BlockHash'))
        const blockHash = await rpcCache.getBlockHash();
        expect(mockRpcClient.getBlockHash).toHaveBeenCalledTimes(1);
        expect(blockHash).toEqual('BlockHash');
        done()
    });

    it('get getBlockHash from the RPC, second request hits the cache', async done => {
        //mockRpcClient.url.mockReturnValue('rpcUrl')
        mockRpcClient.getBlockHash.mockReturnValue(Promise.resolve('BlockHash'))
        const blockHash = await rpcCache.getBlockHash();
        const blockHash2 = await rpcCache.getBlockHash();
        expect(mockRpcClient.getBlockHash).toHaveBeenCalledTimes(1);
        expect(blockHash).toEqual('BlockHash');
        expect(blockHash2).toEqual('BlockHash');
        done()
    });
 })