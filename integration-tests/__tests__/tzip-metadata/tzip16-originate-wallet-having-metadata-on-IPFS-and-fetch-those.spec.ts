import { CONFIGS } from '../../config';
import { tacoContractTzip16 } from '../../data/modified-taco-contract';
import { MichelsonMap } from '@taquito/taquito';
import { tzip16, Tzip16Module, IpfsHttpHandler, Handler, MetadataProvider } from '@taquito/tzip16';
import { stringToBytes } from '@taquito/utils';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;

    const customHandler = new Map<string, Handler>([
        ['ipfs', new IpfsHttpHandler('dweb.link')]
    ]);

    const customMetadataProvider = new MetadataProvider(customHandler);

    Tezos.addExtension(new Tzip16Module(customMetadataProvider));

    let contractAddress: string;

    describe(`Test contract origination having metadata stored at IPFS URL through wallet api using: ${rpc}`, () => {
        beforeEach(async () => {
            await setup();
        });

        test('Verify wallet.originate for a contract having metadata stored on IPFS', async () => {

            // location of the contract metadata
            const uri = 'ipfs://QmXnASUptTDnfhmcoznFqz3S1Mxu7X1zqo2YwbTN3nW52V';
            const bytesUrl = stringToBytes(uri);

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", bytesUrl);

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

            const tacoShopStorageMap = new MichelsonMap();

            const op = await Tezos.wallet.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            }).send();
            await op.confirmation();
            contractAddress = (await op.contract()).address;
            expect(op.opHash).toBeDefined();
        });

        test('Verify that the metadata for the contract having metadata stored on IPFS can be fetched', async () => {

            const contract = await Tezos.wallet.at(contractAddress, tzip16);
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('ipfs://QmXnASUptTDnfhmcoznFqz3S1Mxu7X1zqo2YwbTN3nW52V');
            expect(metadata.integrityCheckResult).toBeUndefined();
            expect(metadata.sha256Hash).toBeUndefined();
            expect(metadata.metadata).toEqual({
                name: 'Taquito test with valid metadata',
                description:
                    'This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage',
                version: '7.1.0-beta.0',
                license: {
                    name: 'MIT',
                    details: 'The MIT License'
                },
                homepage: 'https://github.com/ecadlabs/taquito',
                source: {
                    tools: ['Ligo', 'https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A'],
                    location: 'https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout'
                }
            });

            expect(await (await contract.tzip16()).metadataName()).toEqual('Taquito test with valid metadata');
            expect(await (await contract.tzip16()).metadataDescription()).toEqual('This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage');
            expect(await (await contract.tzip16()).metadataVersion()).toEqual('7.1.0-beta.0');
            expect(await (await contract.tzip16()).metadataLicense()).toEqual({
                name: 'MIT',
                details: 'The MIT License'
            });
            expect(await (await contract.tzip16()).metadataAuthors()).toBeUndefined();
            expect(await (await contract.tzip16()).metadataHomepage()).toEqual('https://github.com/ecadlabs/taquito');
            expect(await (await contract.tzip16()).metadataSource()).toEqual({
                tools: ['Ligo', 'https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A'],
                location: 'https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout'
            });
            expect(await (await contract.tzip16()).metadataInterfaces()).toBeUndefined();
            expect(await (await contract.tzip16()).metadataErrors()).toBeUndefined();
            expect(await (await contract.tzip16()).metadataViews()).toEqual({});
        });
    });
});
