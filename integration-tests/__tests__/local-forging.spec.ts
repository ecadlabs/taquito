import { CONFIGS } from "../config";
import { commonCases, rioCases } from '../data/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { TezosToolkit, Protocols } from "@taquito/taquito";
import { ProhibitedActionError } from '@taquito/core';


CONFIGS().forEach(({ rpc, protocol }) => {
  const Tezos = new TezosToolkit(rpc);
  const rionetAndAlpha = protocol === Protocols.PsRiotuma || protocol === Protocols.ProtoALpha ? test: test.skip;


  describe(`Test local forger: ${rpc}`, () => {
    // Rio protocols
    rioCases.forEach(({ name, operation, expected }) => {
      rionetAndAlpha(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async () => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(true).toEqual(true);
        expect(result).toEqual(rpcResult);
        if (name.includes('edsig(tz1)') || name.includes('spsig(tz2)') || name.includes('p2sig(tz3)')) {
          expect(async () =>{await localForger.parse(result)}).rejects.toThrow(ProhibitedActionError)
        } else {
          expect(await localForger.parse(result)).toEqual(expected || operation);
        }
      });
    });
    // all protocols
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
