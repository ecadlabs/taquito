import { Context } from '../../src/context';
import { CounterProvider } from '../../src/counter/counter-provider';

describe('CounterProvider test', () => {
    it('is instantiable', () => {
        expect(new CounterProvider(new Context('url'))).toBeInstanceOf(CounterProvider);
    });

    describe('getRpcCounter', () => {
        it('calls getContract from the rpc client and return the formatted counter', async done => {
            const mockRpcClient = {
                getContract: jest.fn(),
            };

            mockRpcClient.getContract.mockResolvedValue({ "balance": "62632434", "counter": "98853" });

            const provider = new CounterProvider(new Context(mockRpcClient as any));
            const result = await provider.getRpcCounter('test-address');
            expect(result).toEqual(98853);
            expect(mockRpcClient.getContract.mock.calls[0][0]).toEqual('test-address');
            done();
        });
    });

    describe('getNextCounter', () => {
        it('return the rpc counter + 1', async done => {
            const mockRpcClient = {
                getContract: jest.fn(),
            };

            mockRpcClient.getContract.mockResolvedValue({ "balance": "62632434", "counter": "98853" });

            const provider = new CounterProvider(new Context(mockRpcClient as any));
            const result = await provider.getNextCounter('test-address');
            expect(result).toEqual(98854);
            expect(mockRpcClient.getContract.mock.calls[0][0]).toEqual('test-address');
            done();
        });

        it('increment the internal counter properly', async done => {
            const mockRpcClient = {
                getContract: jest.fn(),
            };

            mockRpcClient.getContract.mockResolvedValue({ "balance": "62632434", "counter": "98853" });

            const provider = new CounterProvider(new Context(mockRpcClient as any));
            const result = await provider.getNextCounter('test-address');
            expect(result).toEqual(98854);
            expect(mockRpcClient.getContract.mock.calls[0][0]).toEqual('test-address');

            const result2 = await provider.getNextCounter('test-address');
            expect(result2).toEqual(98855);
            expect(mockRpcClient.getContract.mock.calls[0][0]).toEqual('test-address');
            expect(mockRpcClient.getContract).toHaveBeenCalledTimes(2);
            done();
        });
    });

    describe('getCounters', () => {
        it('returns the same counter for `lastUsedCounter` and `rpcCounter`', async done => {
            const mockRpcClient = {
                getContract: jest.fn(),
            };

            mockRpcClient.getContract.mockResolvedValue({ "balance": "62632434", "counter": "98853" });

            const provider = new CounterProvider(new Context(mockRpcClient as any));
            const result = await provider.getCounters('test-address');
            expect(result).toEqual({
                rpcCounter: 98853,
                lastUsedCounter: 98853
            });
            done();
        });

        it('returns a `lastUsedCounter` which equal `rpcCounter+5`', async done => {
            const mockRpcClient = {
                getContract: jest.fn(),
            };

            mockRpcClient.getContract.mockResolvedValue({ "balance": "62632434", "counter": "98853" });

            const provider = new CounterProvider(new Context(mockRpcClient as any));
            provider.getNextCounter('test-address');
            provider.getNextCounter('test-address');
            provider.getNextCounter('test-address');
            provider.getNextCounter('test-address');
            provider.getNextCounter('test-address');
            const result = await provider.getCounters('test-address');
            expect(result).toEqual({
                rpcCounter: 98853,
                lastUsedCounter: 98858
            });
            done();
        });
    });
});
