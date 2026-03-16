import { ProhibitedActionError } from "@taquito/core";
import { HttpResponseError } from '@taquito/http-utils'
import { CONFIGS } from "../config";
import { commonCases, tallinnCases } from '../data/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { TezosToolkit, Protocols } from "@taquito/taquito";
import { rethrowInfrastructureRpcError } from '../test-helpers/rpc-error-assertions';

CONFIGS().forEach(({ rpc, protocol }) => {
  const Tezos = new TezosToolkit(rpc);
  const tallinnnetAndAlpha = protocol === Protocols.PtTALLiNt || protocol === Protocols.ProtoALpha ? test: test.skip;

  describe(`Test local forger: ${rpc}`, () => {
    // all protocols
    commonCases.forEach(({ name, operation, expected }) => {
      it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async () => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        if (name.includes('with proof edsig(tz1)') || name.includes('with proof spsig(tz2)') || name.includes('with proof p2sig(tz3)')) {
          await expect(async () => { await localForger.forge(operation) }).rejects.toThrow(ProhibitedActionError)
          try {
            await Tezos.rpc.forgeOperations(operation);
            expect.fail('Expected forgeOperations to reject invalid proof operations');
          } catch (error) {
            rethrowInfrastructureRpcError(error);
            expect(error).toBeInstanceOf(HttpResponseError);
            expect((error as HttpResponseError).status).toBeGreaterThanOrEqual(400);
            expect((error as HttpResponseError).status).toBeLessThan(500);
          }
        } else {
          const result = await localForger.forge(operation);
          const rpcResult = await Tezos.rpc.forgeOperations(operation);
          expect(result).toEqual(rpcResult);
          expect(await localForger.parse(result)).toEqual(expected || operation);
        }
      });
    });

    tallinnCases.forEach(({ name, operation }) => {
      tallinnnetAndAlpha(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async () => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
        expect(await localForger.parse(result)).toEqual(operation);
      });
    });
  });

});
