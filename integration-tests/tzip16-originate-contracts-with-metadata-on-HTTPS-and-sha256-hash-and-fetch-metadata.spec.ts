import { CONFIGS } from "./config";
import { char2Bytes } from "../packages/taquito-tzip16/src/tzip16-utils"
import { tacoContractTzip16 } from "./data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";
import { composeTzip16 } from '../packages/taquito-tzip16/src/composer';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    let contractAddress: string;
    let contractAddressInvalidHash: string;

    describe(`Originating contracts having metadata stored at HTTPS URL using: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        it('Deploy a contract having a sha256 hash in URI', async (done) => {
            // carthagenet: KT1FeMKGGvdWiA4r5RaucoEUAa8cTEXSSpCX
            // delphinet: KT1PHNmaHvQNjt1LTqdWobJUi2aeDeWUdQUq

            // location of the contract metadata
            const urlPercentEncoded = encodeURIComponent('//storage.googleapis.com/tzip-16/taco-shop-metadata.json');
            const metadataSha256 = '0x7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b';
            const url = 'sha256://' + metadataSha256 + '/https:' + urlPercentEncoded;
            const bytesUrl = char2Bytes(url);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

            const tacoShopStorageMap = new MichelsonMap();
            tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });

            const op = await Tezos.contract.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            });
            await op.confirmation();
            contractAddress = (await op.contract()).address;
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });

        it('Fetch metadata of the contract having a sha256 hash in URI', async (done) => {
            // carthagenet: KT1FeMKGGvdWiA4r5RaucoEUAa8cTEXSSpCX
            // delphinet: KT1PHNmaHvQNjt1LTqdWobJUi2aeDeWUdQUq

            const contract = await Tezos.contract.at(contractAddress, composeTzip16());
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('sha256://0x7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b/https:%2F%2Fstorage.googleapis.com%2Ftzip-16%2Ftaco-shop-metadata.json');
            expect(metadata.integrityCheckResult).toEqual(true);
            expect(metadata.sha256Hash).toEqual('7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b');
            expect(metadata.metadata).toEqual({
                "name": "Taquito test with valid metadata",
                "description": "This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage",
                "version": "7.1.0-beta.0",
                "license": {
                    "name": "MIT",
                    "details": "The MIT License"
                },
                "homepage": "https://github.com/ecadlabs/taquito",
                "source": {
                    "tools": [
                        "Ligo",
                        "https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A"
                    ],
                    "location": "https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout"
                }
            });
            done();
        });

        it('Deploy a contract having an invalid sha256 hash in URI', async (done) => {
            // carthagenet: KT1Xj3v6v4hEWrQsnWf4oa87Q5T9JThvqNj7
            // delphinet: KT1Bhj5fgQioJYnFbg8jeki5SgRd7ZsCfhwp

            // location of the contract metadata
            const urlPercentEncoded = encodeURIComponent('//storage.googleapis.com/tzip-16/taco-shop-metadata.json');
            const metadataSha256 = '0x7e99ecf3a4491e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b';
            const url = 'sha256://' + metadataSha256 + '/https:' + urlPercentEncoded;
            const bytesUrl = char2Bytes(url);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

            const tacoShopStorageMap = new MichelsonMap();
            tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });

            const op = await Tezos.contract.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            });
            await op.confirmation();
            contractAddressInvalidHash = (await op.contract()).address;
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });

        it('Fetch metadata of the contract having an invalid sha256 hash in URI', async (done) => {
            // carthagenet: KT1Xj3v6v4hEWrQsnWf4oa87Q5T9JThvqNj7
            // delphinet: KT1Bhj5fgQioJYnFbg8jeki5SgRd7ZsCfhwp

            const contract = await Tezos.contract.at(contractAddressInvalidHash, composeTzip16());
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('sha256://0x7e99ecf3a4491e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b/https:%2F%2Fstorage.googleapis.com%2Ftzip-16%2Ftaco-shop-metadata.json');
            expect(metadata.integrityCheckResult).toEqual(false);
            expect(metadata.sha256Hash).toEqual('7e99ecf3a4491e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b');
            expect(metadata.metadata).toEqual({
                "name": "Taquito test with valid metadata",
                "description": "This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage",
                "version": "7.1.0-beta.0",
                "license": {
                    "name": "MIT",
                    "details": "The MIT License"
                },
                "homepage": "https://github.com/ecadlabs/taquito",
                "source": {
                    "tools": [
                        "Ligo",
                        "https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A"
                    ],
                    "location": "https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout"
                }
            });
            done();
        });
    });
})
