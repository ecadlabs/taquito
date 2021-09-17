import { CONFIGS } from "./config";
import { ContractsLibrary } from '../packages/taquito-contracts-library/src/taquito-contracts-library'
import BigNumber from 'bignumber.js';
import { script } from '../packages/taquito-contracts-library/test/data/contract-script';
import { entrypoints } from '../packages/taquito-contracts-library/test/data/contract-entrypoints';

CONFIGS().forEach(({ lib, rpc, setup, knownBigMapContract }) => {
    const Tezos = lib;
    describe(`Test contractLibrary: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        it('configures contractsLibrary on the TezosToolkit instance', async (done) => {
            const contractsLibrary = new ContractsLibrary();
            contractsLibrary.addContract({
                [knownBigMapContract]: {
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
