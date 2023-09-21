import { CONFIGS } from "./config";
import { commonCases, nairobiCases } from './data/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
  const Tezos = new TezosToolkit(rpc);
  const nairobinet = protocol === Protocols.PtNairobi ? it : it.skip;

  describe(`Test local forger: ${rpc}`, () => {
    nairobiCases.forEach(({ name, operation, expected }) => {
      // Oxford has removed to forge set and unset deposit limit ops in rpcForger.
      // We removed them in localForger .forge, but keep the .parse logic for now.
      nairobinet(`Verify that .parse for local forge will return same operation that rpc forge for rpc: ${name} (${rpc})`, async done => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(await localForger.parse(rpcResult)).toEqual(expected || operation);

        done();
      });
    });
    // all protocols
    nairobiCases.forEach(({ name, operation, expected }) => {
      nairobinet(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async done => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
        expect(await localForger.parse(result)).toEqual(expected || operation);

        done();
      });
    });

    commonCases.forEach(({ name, operation, expected }) => {
      it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async done => {
        const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
        const result = await localForger.forge(operation);
        const rpcResult = await Tezos.rpc.forgeOperations(operation);
        expect(result).toEqual(rpcResult);
        expect(await localForger.parse(result)).toEqual(expected || operation);

        done();
      });
    });
  });
});
