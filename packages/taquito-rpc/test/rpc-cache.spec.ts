import { RpcClient, RpcClientInterface } from "../src/taquito-rpc";
import { RpcCacheDecorator } from "../src/rpc-cache"

/**
 * RpcCacheDecorator test
 */
describe('RpcCacheDecorator test', () => {
    let rpcCache: RpcClientInterface;
    let mockHttpBackend: {
        createRequest: jest.Mock<any, any>;
    };

    beforeEach(() => {
        mockHttpBackend = {
            createRequest: jest.fn(),
        };
        rpcCache = new RpcCacheDecorator('rpcTest', 'main', mockHttpBackend as any);
    });

    it('RpcCacheDecorator is instantiable', () => {
        const rpcUrl: string = 'test';
        const rpcCache = new RpcCacheDecorator(rpcUrl)
        expect(rpcCache).toBeInstanceOf(RpcClient);
        expect(rpcCache).toBeInstanceOf(RpcCacheDecorator);
    });

    it('get getBlockHash from the RPC, not from the cache', async done => {
        mockHttpBackend.createRequest.mockResolvedValue('BlockHash');
        const blockHash = await rpcCache.getBlockHash();
        expect(mockHttpBackend.createRequest).toHaveBeenCalledTimes(1);
        expect(mockHttpBackend.createRequest.mock.calls[0][0]).toEqual({
            method: 'GET',
            url: 'rpcTest/chains/main/blocks/head/hash',
        });
        expect(blockHash).toEqual('BlockHash');
        done()
    });

    it('get getBlockHash from the RPC, second request hits the cache', async done => {
        mockHttpBackend.createRequest.mockReturnValue(Promise.resolve('BlockHash'))
        const blockHash = await rpcCache.getBlockHash();
        const blockHash2 = await rpcCache.getBlockHash();
        expect(mockHttpBackend.createRequest).toHaveBeenCalledTimes(1);
        expect(blockHash).toEqual('BlockHash');
        expect(blockHash2).toEqual('BlockHash');
        done()
    });
})