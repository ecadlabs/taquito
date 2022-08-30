import { CONFIGS } from "./config";
import { commonCases } from '../packages/taquito-local-forging/test/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
    const Tezos = new TezosToolkit(rpc);

    describe(`Test local forger: ${rpc}`, () => {

        // all protocols
        commonCases.forEach(({ name, operation, expected }) => {

<<<<<<< Updated upstream
            it(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
=======
            it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async done => {
>>>>>>> Stashed changes
                const localForger = new LocalForger(protocol as unknown as ProtocolsHash);

                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);

<<<<<<< Updated upstream
=======
                done();
            });
        });

        jakartaCases.forEach(({ name, operation, expected }) => {
            const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
            jakartanetAndMondaynet(`Verify that .forge for local forge will return same result as for higher protocols network forge for rpc: ${name} (${rpc})`, async done => {
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
>>>>>>> Stashed changes
                done();
            });
        });
    });
})