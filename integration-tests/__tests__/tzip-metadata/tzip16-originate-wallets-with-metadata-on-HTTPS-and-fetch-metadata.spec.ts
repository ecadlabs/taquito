import { CONFIGS } from "../../config";
import { tacoContractTzip16 } from "../../data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";
import { tzip16, Tzip16Module } from '@taquito/tzip16';
import { stringToBytes } from '@taquito/utils';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    Tezos.addExtension(new Tzip16Module());

    let contractAddressEmptyMetadata: string;
    let contractAddressEmoji: string;
    let contractAddressInvalidMetadata: string;

    describe(`Test contract origination having metadata stored at HTTPS URL through wallet api using: ${rpc}`, () => {

        beforeEach(async () => {
            await setup()
        })
        it('Verify wallet.originate for a contract having empty metadata stored at an HTTPS URL', async () => {

            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/empty-metadata.json';
            const bytesUrl = stringToBytes(url);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

            const tacoShopStorageMap = new MichelsonMap();
            tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });
            tacoShopStorageMap.set("2", { current_stock: "120", max_price: "20" });
            tacoShopStorageMap.set("3", { current_stock: "50", max_price: "60" });

            const op = await Tezos.wallet.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            }).send();
            await op.confirmation();
            contractAddressEmptyMetadata = (await op.contract()).address;
            expect(op.opHash).toBeDefined();
        });

        it('Verify that the metadata for the contract having empty metadata stored at an HTTPS URL can be fetched', async () => {

            const contract = await Tezos.wallet.at(contractAddressEmptyMetadata, tzip16);
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/empty-metadata.json');
            expect(metadata.integrityCheckResult).toBeUndefined();
            expect(metadata.sha256Hash).toBeUndefined();
            expect(metadata.metadata).toEqual({});
        });

        it('Verify wallet.originate for a contract having valid metadata stored at an HTTPS URL', async () => {

            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/taco-shop-metadata.json';
            const bytesUrl = stringToBytes(url);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

            const tacoShopStorageMap = new MichelsonMap();
            tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });

            const op = await Tezos.wallet.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            }).send();
            await op.confirmation();
            expect(op.opHash).toBeDefined();
        });

        it('Verify wallet.originate for a contract having valid metadata which contains emoji stored at an HTTPS URL', async () => {

            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/emoji-in-metadata.json';
            const bytesUrl = stringToBytes(url);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

            const tacoShopStorageMap = new MichelsonMap();
            tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });

            const op = await Tezos.wallet.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            }).send();
            await op.confirmation();
            contractAddressEmoji = (await op.contract()).address;
            expect(op.opHash).toBeDefined();
        });

        it('Verify that the metadata for the contract which contains emoji can be fetched', async () => {

            const contract = await Tezos.wallet.at(contractAddressEmoji, tzip16);
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/emoji-in-metadata.json');
            expect(metadata.integrityCheckResult).toBeUndefined();
            expect(metadata.sha256Hash).toBeUndefined();
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

            expect(await (await contract.tzip16()).metadataName()).toBe('Taquito test with valid metadata containing emoji 😀 🤩')
            expect(await (await contract.tzip16()).metadataDescription()).toBe('👋 This is metadata test for Taquito integration tests 🧐 with the Ligo Taco shop contract modified to include metadata URI in the storage')
            expect(await (await contract.tzip16()).metadataVersion()).toBe('7.1.0-beta.0')
            expect(await (await contract.tzip16()).metadataLicense()).toEqual({
                "name": "MIT",
                "details": "The MIT License"
            })
            expect(await (await contract.tzip16()).metadataAuthors()).toBeUndefined()
            expect(await (await contract.tzip16()).metadataHomepage()).toBe('https://github.com/ecadlabs/taquito')
            expect(await (await contract.tzip16()).metadataSource()).toEqual({
                "tools": [
                    "Ligo",
                    "https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A"
                ],
                "location": "https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout"
            })
            expect(await (await contract.tzip16()).metadataInterfaces()).toBeUndefined()
            expect(await (await contract.tzip16()).metadataErrors()).toBeUndefined()
            expect(await (await contract.tzip16()).metadataViews()).toEqual({});

        });

        it('Verify contract.originate for a contract having invalid metadata stored at an HTTPS URL', async () => {

            // location of the contract metadata
            const url = 'https://storage.googleapis.com/tzip-16/invalid.json';
            const bytesUrl = stringToBytes(url);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

            const tacoShopStorageMap = new MichelsonMap();
            tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });

            const op = await Tezos.wallet.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            }).send();
            await op.confirmation();
            contractAddressInvalidMetadata = (await op.contract()).address;
            expect(op.opHash).toBeDefined();
        });

        it('Verify that the invalid metadata of the contract failed to fetch', async () => {

            const contract = await Tezos.wallet.at(contractAddressInvalidMetadata, tzip16);
            try {
                await contract.tzip16().getMetadata();
            } catch (error: any) {
                expect(error.message).toContain(`Invalid metadata`);
            }

        });
    });
})
