import { CONFIGS } from "./config";
import { RpcClient } from '@taquito/rpc';
import { HttpResponseError } from "@taquito/http-utils";


CONFIGS().forEach(({ rpc, knownContract }) => {
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
            it('Verify that client.getBlock({ block: `${block.hash}~1` }) returns a block using hash and tilde syntax', async (done) => {
                const block = await client.getBlock();
                const predecessorBlock = await client.getBlock({ block: `${block.hash}~1` })

                expect(predecessorBlock.hash).toEqual(block.header.predecessor);
                done();
            })
            it('Verify that unparse_mode has no error: Readable', async (done) => {
              const response = await client.getNormalizedScript(knownContract, {unparsing_mode: 'Readable'})
              expect(response.code).toBeDefined();
              done()
            })
            it('Verify that unparse_mode has no error: Optimized', async (done) => {
              const response = await client.getNormalizedScript(knownContract, {unparsing_mode: 'Optimized'})
              expect(response.code).toBeDefined();
              done()
            })
            it('Verify that unparse_mode has no error: Optimized_legacy', async (done) => {
              const response = await client.getNormalizedScript(knownContract, {unparsing_mode: 'Optimized_legacy'})
              expect(response.code).toBeDefined();
              done()
            })
            it('Should fail unparsing_mode not acceptable', async (done) => {
              expect(() => client.getNormalizedScript(knownContract, {unparsing_mode: 'else' as any})).rejects.toThrowError(HttpResponseError)
              done()
            })
        })
    })
})
