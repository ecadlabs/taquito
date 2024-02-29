import { CONFIGS } from "../config";
import { commonCases, oxfordCases } from '../data/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";
import { ProtoGreaterOrEqual } from '@taquito/michel-codec';

CONFIGS().forEach(({ rpc, protocol }) => {
  const Tezos = new TezosToolkit(rpc);
  const oxfordAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.ProxfordY) ? test : test.skip

  describe(`Test local forger: ${rpc}`, () => {
    // all protocols
    oxfordCases.forEach(({ name, operation, expected }) => {
      oxfordAndAlpha(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async () => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
        expect(await localForger.parse(result)).toEqual(expected || operation);

      });
    });

    commonCases.forEach(({ name, operation, expected }) => {
      it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async () => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
        expect(await localForger.parse(result)).toEqual(expected || operation);

      });
    });
  });
});
