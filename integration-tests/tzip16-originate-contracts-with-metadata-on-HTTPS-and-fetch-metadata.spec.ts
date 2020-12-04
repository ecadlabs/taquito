import { CONFIGS } from "./config";
import { char2Bytes } from "../packages/taquito-tzip16/src/tzip16-utils"
import { tacoContractTzip16 } from "./data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";
import { composeTzip16 } from '../packages/taquito-tzip16/src/composer';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;

    let contractAddressEmptyMetadata: string;
    let contractAddressEmoji: string;
    let contractAddressInvalidMetadata: string;

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
            contractAddressEmptyMetadata = (await op.contract()).address;
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });

        it('Fetch the empty metadata of the contract', async (done) => {
            // carthagenet: KT1A1DmqFa8eusnpp8eLhwc8NPw29b2ddEHQ
            // delphinet: KT1WTGDQ9j2mFE7SbgmoixNAVXH1ynjdagon

            const contract = await Tezos.contract.at(contractAddressEmptyMetadata, composeTzip16());
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/empty-metadata.json');
            //expect(metadata.integrityCheckResult).toBeUndefined();
            //expect(metadata.sha256Hash).toBeUndefined();
            expect(metadata.metadata).toEqual({});
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
            contractAddressEmoji = (await op.contract()).address;
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });

        it('Fetch the metadata which contains emoji of the contract', async (done) => {
            // carthagenet: KT1A1mR7zS8cWBehnf5wa6eY1SwCY6Teigne
            // delphinet: KT194AJC8UQPguynGdJfEVynF9wfUghDjHSt

            const contract = await Tezos.contract.at(contractAddressEmoji, composeTzip16({mimeType: "text; charset=utf-8"}));
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/emoji-in-metadata.json');
            //expect(metadata.integrityCheckResult).toBeUndefined();
            //expect(metadata.sha256Hash).toBeUndefined();
            expect(metadata.metadata).toEqual({
                "name": "Taquito test with valid metadata containing emoji 😀 🤩",
                "description": "👋 This is metadata test for Taquito integration tests 🧐 with the Ligo Taco shop contract modified to include metadata URI in the storage",
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
            contractAddressInvalidMetadata = (await op.contract()).address;
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });

        it('Should fail to fetch invalid metadata of the contract', async (done) => {
            // carthagenet: KT1LiZ1H4Jk2EatrZjpYVRfH2o4JWMdTgGaM
            // delphinet: KT1UQyKUoCat9oQNHPGMDypQ4mWW44DFWzXt

            const contract = await Tezos.contract.at(contractAddressInvalidMetadata, composeTzip16());
            try {
                await contract.tzip16().getMetadata()
            } catch (error) {
                expect(error.message).toContain(`Invalid metadata`);
            }

            done();
        });
    });
})
