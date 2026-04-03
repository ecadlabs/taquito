import { CONFIGS } from "../../config";
import { tacoContractTzip16 } from "../../data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";
import { tzip16, Tzip16Module } from '@taquito/tzip16';
import { stringToBytes } from '@taquito/utils';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());

  const originateContractWithMetadataUrl = async (
    metadataUrl: string,
    tacoShopStorageEntries: Array<[string, { current_stock: string; max_price: string }]>
  ) => {
    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set("", stringToBytes(metadataUrl));

    const tacoShopStorageMap = new MichelsonMap();
    tacoShopStorageEntries.forEach(([tokenId, storage]) => {
      tacoShopStorageMap.set(tokenId, storage);
    });

    const op = await Tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap
      },
    });
    await op.confirmation();

    return op.contract();
  };

  describe(`Test contract origination having metadata stored at HTTPS URL through contract api using: ${rpc}`, () => {
    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 })
    })

    test('Verify contract.originate for a contract having valid metadata stored at an HTTPS URL', async () => {
      const url = 'https://storage.googleapis.com/tzip-16/taco-shop-metadata.json';
      const op = await Tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: MichelsonMap.fromLiteral({ "": stringToBytes(url) }),
          taco_shop_storage: MichelsonMap.fromLiteral({ "1": { current_stock: "10000", max_price: "50" } })
        },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    });

    describe('empty metadata contract', () => {
      let contractAddressEmptyMetadata: string;

      beforeAll(async () => {
        contractAddressEmptyMetadata = (await originateContractWithMetadataUrl(
          'https://storage.googleapis.com/tzip-16/empty-metadata.json',
          [
            ["1", { current_stock: "10000", max_price: "50" }],
            ["2", { current_stock: "120", max_price: "20" }],
            ["3", { current_stock: "50", max_price: "60" }],
          ]
        )).address;
      });

      test('Verify contract.originate for a contract having empty metadata stored at an HTTPS URL', async () => {
        expect(contractAddressEmptyMetadata).toBeDefined();
      });

      test('Verify that the metadata for the contract having empty metadata stored at an HTTPS URL can be fetched', async () => {
        const contract = await Tezos.contract.at(contractAddressEmptyMetadata, tzip16);
        const metadata = await contract.tzip16().getMetadata();

        expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/empty-metadata.json');
        expect(metadata.integrityCheckResult).toBeUndefined();
        expect(metadata.sha256Hash).toBeUndefined();
        expect(metadata.metadata).toEqual({});
      });
    });

    describe('emoji metadata contract', () => {
      let contractAddressEmoji: string;

      beforeAll(async () => {
        contractAddressEmoji = (await originateContractWithMetadataUrl(
          'https://storage.googleapis.com/tzip-16/emoji-in-metadata.json',
          [["1", { current_stock: "10000", max_price: "50" }]]
        )).address;
      });

      test('Verify contract.originate for a contract having valid metadata which contains emoji stored at an HTTPS URL', async () => {
        expect(contractAddressEmoji).toBeDefined();
      });

      test('Verify that the metadata for the contract which contains emoji can be fetched', async () => {
        const contract = await Tezos.contract.at(contractAddressEmoji, tzip16);
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
    });

    describe('invalid metadata contract', () => {
      let contractAddressInvalidMetadata: string;

      beforeAll(async () => {
        contractAddressInvalidMetadata = (await originateContractWithMetadataUrl(
          'https://storage.googleapis.com/tzip-16/invalid.json',
          [["1", { current_stock: "10000", max_price: "50" }]]
        )).address;
      });

      test('Verify contract.originate for a contract having invalid metadata stored at an HTTPS URL', async () => {
        expect(contractAddressInvalidMetadata).toBeDefined();
      });

      test('Verify that the invalid metadata of the contract failed to fetch', async () => {
        const contract = await Tezos.contract.at(contractAddressInvalidMetadata, tzip16);
        try {
          await contract.tzip16().getMetadata();
        } catch (error: any) {
          expect(error.message).toContain(`Invalid metadata`);
        }
      });
    });
  });
});
