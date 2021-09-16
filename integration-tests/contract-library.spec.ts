import { CONFIGS } from "./config";
import { ContractsLibraryModule } from '../packages/taquito/src/contract/contractLibrary/contractLibraryModule'
import BigNumber from 'bignumber.js';
import { Tzip16Module } from "@taquito/tzip16";

CONFIGS().forEach(({ lib, rpc, setup, knownBigMapContract, knownContract }) => {
    const Tezos = lib;
    describe(`Test contractLibrary: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        it('The at method loads the script and entrypoint from the contractsLibrary instead of the Rpc', async (done) => {
            const script = await Tezos.rpc.getScript(knownBigMapContract);
            const entrypoints = await Tezos.rpc.getEntrypoints(knownBigMapContract);
            const contractsLibrary = new ContractsLibraryModule();
            contractsLibrary.addContract({
                [knownBigMapContract]: {
                    script,
                    entrypoints
                },
                [knownContract]:{
                    script,
                    entrypoints
                }
            })
            Tezos.addExtension([contractsLibrary]);
            const myContract = await Tezos.contract.at(knownBigMapContract);
            const contractStorage: any = await myContract.storage();
            expect(contractStorage['totalSupply']).toEqual(new BigNumber('100'));
            done()
        })

    })

})
