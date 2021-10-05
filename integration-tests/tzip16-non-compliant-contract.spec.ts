import { CONFIGS } from './config';
import { tzip16, Tzip16Module, BigMapMetadataNotFound } from '@taquito/tzip16';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';
import { RpcClient } from '@taquito/rpc';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());

  describe(`Tzip16 failing test: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });
      done();
    });
    it('Deploy a simple contract having no metadata and try to fetch metadata', async (done) => {
      const value = '1234';
      const code = [
        { prim: 'parameter', args: [{ prim: 'bytes' }] },
        { prim: 'storage', args: [{ prim: 'bytes' }] },
        {
          prim: 'code',
          args: [
            [
              { prim: 'DUP' },
              { prim: 'CAR' },
              { prim: 'SWAP' },
              { prim: 'CDR' },
              { prim: 'CONCAT' },
              { prim: 'NIL', args: [{ prim: 'operation' }] },
              { prim: 'PAIR' },
            ],
          ],
        },
      ];

      const op = await Tezos.contract.originate({
        code: code,
        storage: value,
      });
      await op.confirmation();
      const contractAddress = (await op.contract()).address;

      const contract = await Tezos.contract.at(contractAddress, tzip16);
      try {
        await contract.tzip16().getMetadata();
      } catch (ex) {
        expect(ex).toBeInstanceOf(BigMapMetadataNotFound);
      }
      // Count the Rpc calls
      const countRpc = ((Tezos.rpc as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.size).toEqual(14);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(4);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(9);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(2);
      done();
    });
  });
});
