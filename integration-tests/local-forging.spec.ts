import { CONFIGS } from "./config";
import { commonCases, hangzhouCases, ithacaCases } from '../packages/taquito-local-forging/test/allTestsCases';
import { localForger } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
    const Tezos = new TezosToolkit(rpc);
    const hangzhounet = (protocol === Protocols.PtHangz2) ? test : test.skip;
    const ithacanet = (protocol === Protocols.PsiThaCa) ? test : test.skip;
    const hangzhounetOrHigher = (protocol === Protocols.PtHangz2 || protocol === Protocols.PsiThaCa) ? test : test.skip;

    describe(`Test local forger: ${rpc}`, () => {

        commonCases.forEach(({ name, operation, expected }) => {

            it(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                    const result = await localForger.forge(operation);
                    const rpcResult = await Tezos.rpc.forgeOperations(operation);
                    expect(result).toEqual(rpcResult);
                    expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        });

        hangzhouCases.forEach(({ name, operation, expected }) => {

            hangzhounet(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                const result = await localForger.forge(operation);
                const rpcResult = await Tezos.rpc.forgeOperations(operation);
                expect(result).toEqual(rpcResult);
                expect(await localForger.parse(result)).toEqual(expected || operation);
                done();
            });
        }); 
        
        ithacaCases.forEach(({ name, operation, expected }) => {

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