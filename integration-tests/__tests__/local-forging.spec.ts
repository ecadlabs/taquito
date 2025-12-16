import { ProhibitedActionError } from "@taquito/core";
import { HttpResponseError } from '@taquito/http-utils'
import { CONFIGS } from "../config";
import { commonCases, tallinnCases } from '../data/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
  const Tezos = new TezosToolkit(rpc);

  describe(`Test local forger: ${rpc}`, () => {
    // all protocols
    commonCases.forEach(({ name, operation, expected }) => {
      it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async () => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        if (name.includes('with proof edsig(tz1)') || name.includes('with proof spsig(tz2)') || name.includes('with proof p2sig(tz3)')) {
          expect(async () => { await localForger.forge(operation) }).rejects.toThrow(ProhibitedActionError)
          expect(async () => { await Tezos.rpc.forgeOperations(operation) }).rejects.toThrow(HttpResponseError)
        } else {
          const result = await localForger.forge(operation);
          const rpcResult = await Tezos.rpc.forgeOperations(operation);
          expect(result).toEqual(rpcResult);
          expect(await localForger.parse(result)).toEqual(expected || operation);
        }
      });
    });

    tallinnCases.forEach(({ name, operation }) => {
      it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async () => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
        expect(await localForger.parse(result)).toEqual(operation);
      });
    });
  });

});
