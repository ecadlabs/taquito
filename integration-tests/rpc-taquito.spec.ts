import { CONFIGS } from "./config";
import { RpcClient } from '../packages/taquito-rpc/src/taquito-rpc';


CONFIGS().forEach(({ rpc }) => {
    const client = new RpcClient(rpc);

    describe(`Test Taquito RPC: ${rpc}`, () => {
        describe('Test getBlock', () => {
            it('Verify that client.getBlock returns a block using default syntax', async (done) => {
                // defaults to /chains/main/blocks/head/
                const block = await client.getBlock();

                expect(block.protocol).toBeTruthy();
                done();
            })
            it('Verify that client.getBlock({ block: \'head~2\' }) returns a block using head and tilde syntax', async (done) => {
                const block = await client.getBlock({ block: 'head~2' });
                const blockHeader = await client.getBlockHeader({ block: block.hash })

                expect(block.header.predecessor).toEqual(blockHeader.predecessor);
                done();
            })
            it('Verify that client client.getBlock({ block: `${block.hash}~1` }) returns a block using hash and tilde syntax', async (done) => {
                const block = await client.getBlock();
                const predecessorBlock = await client.getBlock({ block: `${block.hash}~1` })

                expect(predecessorBlock.hash).toEqual(block.header.predecessor);
                done();
            })
        })
    })
})
