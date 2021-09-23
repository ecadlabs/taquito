import { CONFIGS } from "./config";
import { commonCases } from '../packages/taquito-local-forging/test/allTestsCases';
import { localForger } from '@taquito/local-forging'
import { TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc }) => {
    const Tezos = new TezosToolkit(rpc);

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
    });
})