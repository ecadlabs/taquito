import { RpcPacker } from '../../src/packer/rpc-packer';
import { Context } from '../../src/context';

describe('RpcPacker test', () => {
    it('is instantiable', () => {
        expect(new RpcPacker(new Context('url'))).toBeInstanceOf(RpcPacker);
    });

    describe('packData', () => {
        it('calls packData from the rpc client', async done => {
            const mockRpcClient = {
                packData: jest.fn(),
            };

            mockRpcClient.packData.mockResolvedValue({ packed: "0500a7e8e4d80b" });

            const rpcPacker = new RpcPacker(new Context(mockRpcClient as any));
            const result = await rpcPacker.packData({
                data: { string: "2019-09-26T10:59:51Z" },
                type: { prim: "timestamp" }
            });

            expect(mockRpcClient.packData).toHaveBeenCalledWith({
                data: { string: "2019-09-26T10:59:51Z" },
                type: { prim: "timestamp" }
            });
            expect(mockRpcClient.packData).toHaveBeenCalledTimes(1);
            expect(result).toEqual({ packed: "0500a7e8e4d80b" });

            done();
        });
    });
});
