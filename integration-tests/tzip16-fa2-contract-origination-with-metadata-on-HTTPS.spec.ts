import { CONFIGS } from "./config";
import { char2Bytes } from "../packages/taquito-tzip16/src/tzip16-utils"
import { MichelsonMap } from "@taquito/taquito";
import { fa2ContractTzip16 } from "./data/fa2_contract_with_metadata";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
    const Tezos = lib;
    describe(`Originating contracts having metadata stored at HTTPS URL using: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })
        
        it('Deploy a Fa2 contract having metadata stored at an HTTPS URL', async (done) => {
            // carthagenet: KT1WCcgKMtFwSpdBc9kJ7vsH7MEmuXphon8K
            // delphinet: KT1DNapRVdG9t74fzAvXLcKDcgxZd1i1TobV

            const LocalTez1 = await createAddress();
            const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
            const LocalTez2 = await createAddress();
            const localTez2Pkh = await LocalTez2.signer.publicKeyHash();


            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/fa2-metadata.json';
            const bytesUrl = char2Bytes(url);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            const ledger = new MichelsonMap();
            ledger.set(localTez1Pkh, '5');
            ledger.set(localTez2Pkh, '2');

            const operatorsMap = new MichelsonMap();
            operatorsMap.set({
                0: localTez1Pkh,
                1: localTez2Pkh
            },
                'None');

            const op = await Tezos.contract.originate({
                code: fa2ContractTzip16,
                storage: {
                    default_expiry: 1000,
                    ledger: ledger,
                    metadata: metadataBigMAp,
                    minting_allowances: new MichelsonMap(),
                    operators: operatorsMap,
                    paused: false,
                    permit_counter: '0',
                    permits: new MichelsonMap(),
                    totalSupply: '100',
                    roles: {
                        master_minter: await Tezos.signer.publicKeyHash(),
                        owner: localTez1Pkh,
                        pauser: localTez2Pkh,
                        pending_owner: null
                    },
                    token_metadata_registry: 'KT1JRrD7gte5ssFePBARMUN7XocKRvvwgXDR',
                    transferlist_contract: null
                },
            });
            await op.confirmation();
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });
    });
})
