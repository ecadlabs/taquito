import { CONFIGS } from "./config";
import { commonCases, jakartaCases } from '../packages/taquito-local-forging/test/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
    const Tezos = new TezosToolkit(rpc);
    const jakartanetAndMondaynet = protocol === Protocols.ProtoALpha || protocol === Protocols.PtJakart2 ? test: test.skip;

    describe(`Test local forger: ${rpc}`, () => {

        // all protocols
        commonCases.forEach(({ name, operation, expected }) => {

<<<<<<< HEAD
            it(`Verify that .forge for local forge will return same result as for network forge for rpc: ${name} (${rpc})`, async done => {
                if(protocol === Protocols.PtIdiaza && name === 'Endorsement') {
                    // skip
                    console.log('Temporarily skip endorsement forging for Idiazabalnet')
                } else {
                    const result = await localForger.forge(operation);
                    const rpcResult = await Tezos.rpc.forgeOperations(operation);
                    expect(result).toEqual(rpcResult);
                    expect(await localForger.parse(result)).toEqual(expected || operation);
                }
=======
            it(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const localForger = new LocalForger(protocol as unknown as ProtocolsHash);

                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);

>>>>>>> master
                done();
            });
        });

<<<<<<< HEAD
        hangzhouCases.forEach(({ name, operation, expected }) => {

            hangzhounetOrHigher(`Verify that .forge for local forge will return same result as for hangzhounet or higher network forge for rpc: ${name} (${rpc})`, async done => {
=======
        jakartaCases.forEach(({ name, operation, expected }) => {
            const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
            jakartanetAndMondaynet(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
>>>>>>> master
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        });
    });
})
