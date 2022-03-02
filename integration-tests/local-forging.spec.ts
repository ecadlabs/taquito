import { CONFIGS } from "./config";
import { commonCases, hangzhouCases, ithacaCases, priorIthacaCases } from '../packages/taquito-local-forging/test/allTestsCases';
import { LocalForger, ProtocolsHash } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
    const Tezos = new TezosToolkit(rpc);
    const hangzhounet = (protocol === Protocols.PtHangz2) ? test : test.skip;
    const ithacanet = (protocol === Protocols.Psithaca2) ? test : test.skip;

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
            const localForger = new LocalForger(ProtocolsHash.PtHangz2);
            it(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        });

        // all protocols except Ithaca
        priorIthacaCases.forEach(({ name, operation, expected }) => {
            const localForger = new LocalForger(ProtocolsHash.PtHangz2);
            hangzhounet(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        });


        // only ithaca
        ithacaCases.forEach(({ name, operation, expected }) => {
            const localForger = new LocalForger(ProtocolsHash.Psithaca2);
            ithacanet(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        });
    });
})