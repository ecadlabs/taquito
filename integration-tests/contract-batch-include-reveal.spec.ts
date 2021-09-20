import { OpKind } from '@taquito/taquito';
import { CONFIGS } from './config';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';
import { RpcClient } from '@taquito/rpc';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });
  describe(`Test contract.batch using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(true);
      done();
    });

    it('Batch estimate including reveal', async (done) => {
      const batchOpEstimate = await Tezos.estimate.batch([
        {
          kind: OpKind.DELEGATION,
          source: await Tezos.signer.publicKeyHash(),
          delegate: knownBaker,
        },
        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
      ]);

      expect(batchOpEstimate.length).toEqual(3);

      // Count the Rpc calls
      let user = await Tezos.signer.publicKeyHash();
      let value = 1;
      let rpcCountingMapContents: Map<String, number> | undefined;
      rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
        'rpcCountingMap'
      ];
      if (rpcCountingMapContents === undefined) {
        console.log('RPC count is undefined');
      } else {
        expect(rpcCountingMapContents.size).toEqual(9);
        expect(
          rpcCountingMapContents.get(
            `${rpc}/chains/main/blocks/head/context/contracts/${user}/balance`
          )
        );
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/context/constants`)
        ).toEqual(value);
        expect(
          rpcCountingMapContents.get(
            `${rpc}/chains/main/blocks/head/context/contracts/${user}/manager_key`
          )
        ).toEqual(value);
        expect(rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(value);
        expect(rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(
          value
        );
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/context/contracts/${user}`)
        ).toEqual(value);
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)
        ).toEqual(value);
        expect(rpcCountingMapContents.get(`${rpc}/chains/main/chain_id`)).toEqual(value);
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)
        ).toEqual(value);
        done();
      }
    });

    it('Batch estimate where reveal is not needed', async (done) => {
      // do a reveal operation first
      const revealOp = await Tezos.contract.reveal({});
      await revealOp.confirmation();

      const batchOpEstimate = await Tezos.estimate.batch([
        {
          kind: OpKind.DELEGATION,
          source: await Tezos.signer.publicKeyHash(),
          delegate: knownBaker,
        },
        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
      ]);

      expect(batchOpEstimate.length).toEqual(2);
      done();
    });
  });
});
