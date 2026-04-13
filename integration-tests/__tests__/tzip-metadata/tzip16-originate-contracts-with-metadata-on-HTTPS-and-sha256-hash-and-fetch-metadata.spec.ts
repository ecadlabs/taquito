import { CONFIGS, waitForRpcState } from '../../config';
import { tzip16, Tzip16Module } from '@taquito/tzip16';
import { stringToBytes } from '@taquito/utils';
import { tacoContractTzip16 } from '../../data/modified-taco-contract';
import { MichelsonMap } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());

  const originateContractWithShaUri = async (metadataSha256: string) => {
    const urlPercentEncoded = encodeURIComponent(
      '//storage.googleapis.com/tzip-16/taco-shop-metadata.json'
    );
    const url = 'sha256://' + metadataSha256 + '/https:' + urlPercentEncoded;

    const op = await Tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: MichelsonMap.fromLiteral({ '': stringToBytes(url) }),
        taco_shop_storage: MichelsonMap.fromLiteral({
          '1': { current_stock: '10000', max_price: '50' },
        }),
      },
    });
    await op.confirmation();

    const contract = await op.contract();
    await waitForRpcState(
      Tezos,
      () => Tezos.rpc.getStorage(contract.address),
      () => true,
      { description: `metadata contract ${contract.address}` }
    );

    return contract;
  };

  describe(`Test contract origination having a sha256 hash in URI through contract api using: ${rpc}`, () => {
    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
    });

    describe('valid sha256 URI', () => {
      let contractAddress: string;

      beforeAll(async () => {
        contractAddress = (
          await originateContractWithShaUri(
            '0x18b983a4cc78d7c15d53f7642461176c1366fbdb83960ea432188130db1f8c9d'
          )
        ).address;
      });

      it('Verify contract.originate for a contract having a sha256 hash in URI', async () => {
        expect(contractAddress).toBeDefined();
      });

      it('Verify that the metadata for the contract having a sha256 hash in URI can be fetched', async () => {
        const contract = await Tezos.contract.at(contractAddress, tzip16);
        const metadata = await contract.tzip16().getMetadata();

        expect(metadata.uri).toEqual(
          'sha256://0x18b983a4cc78d7c15d53f7642461176c1366fbdb83960ea432188130db1f8c9d/https:%2F%2Fstorage.googleapis.com%2Ftzip-16%2Ftaco-shop-metadata.json'
        );
        expect(metadata.integrityCheckResult).toEqual(true);
        expect(metadata.sha256Hash).toEqual(
          '18b983a4cc78d7c15d53f7642461176c1366fbdb83960ea432188130db1f8c9d'
        );
        expect(metadata.metadata).toEqual({
          name: 'Taquito test with valid metadata',
          description:
            'This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage',
          version: '7.1.0-beta.0',
          license: {
            name: 'MIT',
            details: 'The MIT License',
          },
          homepage: 'https://github.com/ecadlabs/taquito',
          source: {
            tools: ['Ligo', 'https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A'],
            location: 'https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout',
          },
        });

        expect(await (await contract.tzip16()).metadataName()).toEqual(
          'Taquito test with valid metadata'
        );
        expect(await (await contract.tzip16()).metadataDescription()).toEqual(
          'This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage'
        );
        expect(await (await contract.tzip16()).metadataVersion()).toEqual('7.1.0-beta.0');
        expect(await (await contract.tzip16()).metadataLicense()).toEqual({
          name: 'MIT',
          details: 'The MIT License',
        });
        expect(await (await contract.tzip16()).metadataAuthors()).toBeUndefined();
        expect(await (await contract.tzip16()).metadataHomepage()).toEqual(
          'https://github.com/ecadlabs/taquito'
        );
        expect(await (await contract.tzip16()).metadataSource()).toEqual({
          tools: ['Ligo', 'https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A'],
          location: 'https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout',
        });
        expect(await (await contract.tzip16()).metadataInterfaces()).toBeUndefined();
        expect(await (await contract.tzip16()).metadataErrors()).toBeUndefined();
        expect(await (await contract.tzip16()).metadataViews()).toEqual({});
      });
    });

    describe('invalid sha256 URI', () => {
      let contractAddressInvalidHash: string;

      beforeAll(async () => {
        contractAddressInvalidHash = (
          await originateContractWithShaUri(
            '0x7e99ecf3a4491e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b'
          )
        ).address;
      });

      it('Verify contract.originate for a contract having an invalid sha256 hash in URI', async () => {
        expect(contractAddressInvalidHash).toBeDefined();
      });

      it('Verify that the metadata for the contract having an invalid sha256 hash in URI can be fetched', async () => {
        const contract = await Tezos.contract.at(contractAddressInvalidHash, tzip16);
        const metadata = await contract.tzip16().getMetadata();

        expect(metadata.uri).toEqual(
          'sha256://0x7e99ecf3a4491e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b/https:%2F%2Fstorage.googleapis.com%2Ftzip-16%2Ftaco-shop-metadata.json'
        );
        expect(metadata.integrityCheckResult).toEqual(false);
        expect(metadata.sha256Hash).toEqual(
          '18b983a4cc78d7c15d53f7642461176c1366fbdb83960ea432188130db1f8c9d'
        );
        expect(metadata.metadata).toEqual({
          name: 'Taquito test with valid metadata',
          description:
            'This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage',
          version: '7.1.0-beta.0',
          license: {
            name: 'MIT',
            details: 'The MIT License',
          },
          homepage: 'https://github.com/ecadlabs/taquito',
          source: {
            tools: ['Ligo', 'https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A'],
            location: 'https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout',
          },
        });

        expect(await (await contract.tzip16()).metadataName()).toEqual(
          'Taquito test with valid metadata'
        );
        expect(await (await contract.tzip16()).metadataDescription()).toEqual(
          'This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage'
        );
        expect(await (await contract.tzip16()).metadataVersion()).toEqual('7.1.0-beta.0');
        expect(await (await contract.tzip16()).metadataLicense()).toEqual({
          name: 'MIT',
          details: 'The MIT License',
        });
        expect(await (await contract.tzip16()).metadataAuthors()).toBeUndefined();
        expect(await (await contract.tzip16()).metadataHomepage()).toEqual(
          'https://github.com/ecadlabs/taquito'
        );
        expect(await (await contract.tzip16()).metadataSource()).toEqual({
          tools: ['Ligo', 'https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A'],
          location: 'https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout',
        });
        expect(await (await contract.tzip16()).metadataInterfaces()).toBeUndefined();
        expect(await (await contract.tzip16()).metadataErrors()).toBeUndefined();
        expect(await (await contract.tzip16()).metadataViews()).toEqual({});
      });
    });
  });
});
