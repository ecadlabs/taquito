import { CONFIGS } from "./config";
import { RpcClient } from '@taquito/rpc';
import { HttpResponseError } from "@taquito/http-utils";


CONFIGS().forEach(({ rpc, knownContract }) => {
  const client = new RpcClient(rpc);

  describe(`Test Taquito RPC: ${rpc}`, () => {
    describe('Test getBlock', () => {
      it('Verify that client.getBlock returns a block using default syntax', async () => {
        // defaults to /chains/main/blocks/head/
        const block = await client.getBlock();

        expect(block.protocol).toBeTruthy();
      });
      it('Verify that client.getBlock({ block: \'head~2\' }) returns a block using head and tilde syntax', async () => {
        const block = await client.getBlock({ block: 'head~2' });
        const blockHeader = await client.getBlockHeader({ block: block.hash });

        expect(block.header.predecessor).toEqual(blockHeader.predecessor);
      });
      it('Verify that client.getBlock({ block: `${block.hash}~1` }) returns a block using hash and tilde syntax', async () => {
        const block = await client.getBlock();
        const predecessorBlock = await client.getBlock({ block: `${block.hash}~1` });

        expect(predecessorBlock.hash).toEqual(block.header.predecessor);
      });
      it('Verify that unparse_mode has no error: Readable', async () => {
        const response = await client.getNormalizedScript(knownContract, { unparsing_mode: 'Readable' });
        expect(response.code).toBeDefined();
      });
      it('Verify that unparse_mode has no error: Optimized', async () => {
        const response = await client.getNormalizedScript(knownContract, { unparsing_mode: 'Optimized' });
        expect(response.code).toBeDefined();
      });
      it('Verify that unparse_mode has no error: Optimized_legacy', async () => {
        const response = await client.getNormalizedScript(knownContract, { unparsing_mode: 'Optimized_legacy' });
        expect(response.code).toBeDefined();
      });
      it('Should fail unparsing_mode not acceptable', async () => {
        expect(() => client.getNormalizedScript(knownContract, { unparsing_mode: 'else' as any })).rejects.toThrowError(HttpResponseError);
      });
      it('Should fail unparsing_mode not acceptable', async () => {
        expect(() => client.getNormalizedScript(knownContract, {} as any)).rejects.toThrowError(HttpResponseError);
      });
    });
  });
});
