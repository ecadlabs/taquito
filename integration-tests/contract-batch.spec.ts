import { CONFIGS } from './config';
import { ligoSample, ligoSampleMichelson } from './data/ligo-simple-contract';
import { managerCode } from './data/manager_code';
import { MANAGER_LAMBDA, OpKind } from '@taquito/taquito';
import { RpcCacheDecorator } from '../packages/taquito-rpc/src/rpc-cache'

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    describe(`Test contract.batch using: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup();
            done();
        });
        it('Simple transfers with origination (where the code in JSON Michelson format)', async (done) => {
            Tezos.setRpcProvider(new RpcCacheDecorator(rpc))
            const b = await Tezos.rpc.getBlockHash();
            console.log(b)
            let b2;
            setTimeout(async ()=>{
                b2 = await Tezos.rpc.getBlockHash()
            }, 2000);
            console.log(b2)
            done()
        });

       
    });
});
