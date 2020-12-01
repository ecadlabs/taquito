import { CONFIGS } from "./config";
import { char2Bytes } from "../packages/taquito-tzip16/src/tzip16-utils"
import { tacoContractTzip16 } from "./data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
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
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
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
            console.log((await op.contract()).address)
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });
    });
})
