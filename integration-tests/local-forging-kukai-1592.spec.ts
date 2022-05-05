import { CONFIGS } from "./config";
import { commonCases, hangzhouCases, ithacaCases, jakartaCases } from '../packages/taquito-local-forging/test/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
    const Tezos = new TezosToolkit(rpc);
    const jakartanetAndMondaynet = protocol === Protocols.ProtoALpha || protocol === Protocols.PtJakart2 ? test: test.skip;

    describe(`Test local forger: ${rpc}`, () => {

        // all protocols
        commonCases.forEach(({ name, operation, expected }) => {

            it(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const localForger = new LocalForger(protocol as unknown as ProtocolsHash);

                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);

                done();
            });
        });

        // all protocols since hangzhounet
        hangzhouCases.forEach(({ name, operation, expected }) => {
            const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
            it(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        });

        // all protocols since ithaca
        ithacaCases.forEach(({ name, operation, expected }) => {
            const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
            it(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        });

        jakartaCases.forEach(({ name, operation, expected }) => {
            const localForger = new LocalForger(protocol as unknown as ProtocolsHash);
            jakartanetAndMondaynet(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        });
    });
})