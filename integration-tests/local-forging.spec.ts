import { CONFIGS } from "./config";
import { commonCases, hangzhouCases, ithacaCases } from '../packages/taquito-local-forging/test/allTestsCases';
import { localForger } from '@taquito/local-forging'
import { Protocols, TezosToolkit } from "@taquito/taquito";

CONFIGS().forEach(({ rpc, protocol }) => {
    const Tezos = new TezosToolkit(rpc);
    const hangzhounetOrHigher = (protocol === Protocols.PtHangz2 || protocol === Protocols.Psithaca2) ? test : test.skip;

    describe(`Test local forger: ${rpc}`, () => {

         commonCases.forEach(({ name, operation, expected }) => {

             it(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                 if(protocol === Protocols.Psithaca2 && name === 'Endorsement') {
                     // skip
                     console.log('Temporarily skip endorsement forging for Ithacanet')
                 } else {
                     const result = await localForger.forge(operation);
                     const rpcResult = await Tezos.rpc.forgeOperations(operation);
                     expect(result).toEqual(rpcResult);
                     expect(await localForger.parse(result)).toEqual(expected || operation);
                 }
                 done();
             });
         });

         hangzhouCases.forEach(({ name, operation, expected }) => {

             hangzhounetOrHigher(`Should give the same result as when forging with the rpc: ${name} (${rpc})`, async done => {
                 const result = await localForger.forge(operation);
                 const rpcResult = await Tezos.rpc.forgeOperations(operation);
                 expect(result).toEqual(rpcResult);
                 expect(await localForger.parse(result)).toEqual(expected || operation);
                 done();
             });
         }); 
    });
})