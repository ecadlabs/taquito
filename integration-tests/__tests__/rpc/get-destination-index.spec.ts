import { CONFIGS } from '../../config';
import { RpcClient } from '@taquito/rpc';
import { indexAddressCode, indexAddressStorage } from '../../data/code_with_index_address_index';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const rpcClient = new RpcClient(rpc);

  describe(`Test getDestinationIndex RPC: ${rpc}`, () => {
    beforeAll(async () => {
      await setup(true);
    });

    it('should return null for a non-indexed address', async () => {
      // Use a random address that has never been indexed
      const nonIndexedAddress = 'tz1burnburnburnburnburnburnburjAYjjX';
      const result = await rpcClient.getDestinationIndex(nonIndexedAddress);
      expect(result).toBeNull();
    });

    it('should return the index for an address that has been indexed via INDEX_ADDRESS', async () => {
      // Originate a contract that uses INDEX_ADDRESS
      const originationOp = await Tezos.contract.originate({
        code: indexAddressCode,
        init: indexAddressStorage,
      });
      await originationOp.confirmation();
      const contract = await originationOp.contract();

      // Get an address to index (use the signer's address)
      const addressToIndex = await Tezos.signer.publicKeyHash();

      // Call the contract to index the address
      const callOp = await contract.methodsObject.default(addressToIndex).send();
      await callOp.confirmation();

      // Now query the destination index via RPC
      const index = await rpcClient.getDestinationIndex(addressToIndex);

      // The index should be a number (not null)
      expect(index).not.toBeNull();
      expect(typeof index).toBe('number');
      expect(index).toBeGreaterThanOrEqual(0);
    });
  });
});
