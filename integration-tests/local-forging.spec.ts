import { CONFIGS } from "./config";
import { commonCases, kathmanduCases } from './data/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
    const Tezos = new TezosToolkit(rpc);
    const kathmandunetAndAlpha = protocol === Protocols.ProtoALpha || protocol === Protocols.PtKathman ? test: test.skip;

    describe(`Test local forger: ${rpc}`, () => {

        // all protocols
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

        kathmanduCases.forEach(({ name, operation, expected }) => {

            kathmandunetAndAlpha(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const localForger = new LocalForger(protocol as unknown as ProtocolsHash);

                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);

                done();
            });
        });
    });
})