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
         it('Deploy a contract having empty metadata stored at an HTTPS URL', async (done) => {
            // carthagenet: KT1A1DmqFa8eusnpp8eLhwc8NPw29b2ddEHQ
            // delphinet: KT1WTGDQ9j2mFE7SbgmoixNAVXH1ynjdagon

            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/empty-metadata.json';
            const bytesUrl = char2Bytes(url);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

            const tacoShopStorageMap = new MichelsonMap();
            tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });
            tacoShopStorageMap.set("2", { current_stock: "120", max_price: "20" });
            tacoShopStorageMap.set("3", { current_stock: "50", max_price: "60" });

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

        it('Deploy a contract having valid metadata stored at an HTTPS URL', async (done) => {
            // carthagenet: KT1GPiBGM2sQ7DjPqCmGbHBDzkhweTR2spZA
            // delphinet: KT1KGkToC8UUJBJLqHcLRkv7xvjWd8JwUuTo

            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/taco-shop-metadata.json';
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
        it('Deploy a contract having valid metadata which contains emoji stored at an HTTPS URL', async (done) => {
            // carthagenet: KT1A1mR7zS8cWBehnf5wa6eY1SwCY6Teigne
            // delphinet: KT194AJC8UQPguynGdJfEVynF9wfUghDjHSt

            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/emoji-in-metadata.json';
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

        it('Deploy a contract having invalid metadata stored at an HTTPS URL', async (done) => {
            // carthagenet: KT1LiZ1H4Jk2EatrZjpYVRfH2o4JWMdTgGaM
            // delphinet: KT1UQyKUoCat9oQNHPGMDypQ4mWW44DFWzXt

            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/invalid.json';
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

    });
})
