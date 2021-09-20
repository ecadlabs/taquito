import { CONFIGS } from './config';
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { tacoContractTzip16 } from './data/modified-taco-contract';
import { MichelsonMap } from '@taquito/taquito';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';
import { RpcClient } from '@taquito/rpc';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());
  let contractAddress: string;
  let contractAddressInvalidHash: string;

  const test = require('jest-retries');

  describe(`Originating contracts having metadata stored at HTTPS URL using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });
      done();
    });

    test('Deploy a contract having a sha256 hash in URI', 2, async (done: () => void) => {
      // location of the contract metadata
      const urlPercentEncoded = encodeURIComponent(
        '//storage.googleapis.com/tzip-16/taco-shop-metadata.json'
      );
      const metadataSha256 = '0x7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b';
      const url = 'sha256://' + metadataSha256 + '/https:' + urlPercentEncoded;
      const bytesUrl = char2Bytes(url);

      const metadataBigMap = new MichelsonMap();
      metadataBigMap.set('', bytesUrl);

      // Ligo Taco shop contract modified to include metadata in storage
      // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

      const tacoShopStorageMap = new MichelsonMap();
      tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

      const op = await Tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: metadataBigMap,
          taco_shop_storage: tacoShopStorageMap,
        },
      });
      await op.confirmation();
      contractAddress = (await op.contract()).address;
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();

      // Count the Rpc calls
      let user = await Tezos.signer.publicKeyHash();
      let rpcCountingMapContents: Map<String, number> | undefined;
      rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
        'rpcCountingMap'
      ];
      if (rpcCountingMapContents === undefined) {
        console.log('RPC count is undefined');
      } else {
        expect(rpcCountingMapContents.size).toEqual(14);

        expect(
          rpcCountingMapContents.get(
            `${rpc}/chains/main/blocks/head/context/contracts/${user}/balance`
          )
        ).toEqual(1);
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/context/constants`)
        ).toEqual(1);
        expect(rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(1);
        expect(
          rpcCountingMapContents.get(
            `${rpc}/chains/main/blocks/head/context/contracts/${user}/manager_key`
          )
        ).toEqual(1);
        expect(rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/context/contracts/${user}`)
        ).toEqual(1);
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)
        ).toEqual(1);
        expect(rpcCountingMapContents.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)
        ).toEqual(1);
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)
        ).toEqual(1);
        expect(rpcCountingMapContents.get(`${rpc}/injection/operation`)).toEqual(1);
        expect(rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head`)).toEqual(1);
        expect(
          rpcCountingMapContents.get(
            `${rpc}/chains/main/blocks/head/context/contracts/KT1ErDfcPR9cTZ8NdDtGPtasWQ3GFPsPpmnJ/script`
          )
        ).toEqual(1);
        expect(
          rpcCountingMapContents.get(
            `${rpc}/chains/main/blocks/head/context/contracts/KT1ErDfcPR9cTZ8NdDtGPtasWQ3GFPsPpmnJ/entrypoints`
          )
        ).toEqual(1);
      }
    });

    test(
      'Fetch metadata of the contract having a sha256 hash in URI',
      2,
      async (done: () => void) => {
        const contract = await Tezos.contract.at(contractAddress, tzip16);
        const metadata = await contract.tzip16().getMetadata();

        expect(metadata.uri).toEqual(
          'sha256://0x7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b/https:%2F%2Fstorage.googleapis.com%2Ftzip-16%2Ftaco-shop-metadata.json'
        );
        expect(metadata.integrityCheckResult).toEqual(true);
        expect(metadata.sha256Hash).toEqual(
          '7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b'
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
        // Count the Rpc calls
        let rpcCountingMapContents: Map<String, number> | undefined;
        rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
          'rpcCountingMap'
        ];
        if (rpcCountingMapContents === undefined) {
          console.log('RPC count is undefined');
        } else {
          expect(rpcCountingMapContents.size).toEqual(5);
        }
        expect(
          rpcCountingMapContents.get(
            `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`
          )
        ).toEqual(1);
        expect(
          rpcCountingMapContents.get(
            `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
          )
        ).toEqual(1);
        expect(rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
        expect(
          rpcCountingMapContents.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)
        ).toEqual(1);
        //can't predict what this rpc call will be
        // expect(
        //   rpcCountingMapContents.get(
        //     `${rpc}/chains/main/blocks/head/context/big_maps/132446/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`
        //   )
        // ).toEqual(1);
        done();
      }
    );

    test('Deploy a contract having an invalid sha256 hash in URI', 2, async (done: () => void) => {
      // location of the contract metadata
      const urlPercentEncoded = encodeURIComponent(
        '//storage.googleapis.com/tzip-16/taco-shop-metadata.json'
      );
      const metadataSha256 = '0x7e99ecf3a4491e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b';
      const url = 'sha256://' + metadataSha256 + '/https:' + urlPercentEncoded;
      const bytesUrl = char2Bytes(url);

      const metadataBigMAp = new MichelsonMap();
      metadataBigMAp.set('', bytesUrl);

      // Ligo Taco shop contract modified to include metadata in storage
      // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

      const tacoShopStorageMap = new MichelsonMap();
      tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

      const op = await Tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: metadataBigMAp,
          taco_shop_storage: tacoShopStorageMap,
        },
      });
      await op.confirmation();
      contractAddressInvalidHash = (await op.contract()).address;
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
    });

    test(
      'Fetch metadata of the contract having an invalid sha256 hash in URI',
      2,
      async (done: () => void) => {
        const contract = await Tezos.contract.at(contractAddressInvalidHash, tzip16);
        const metadata = await contract.tzip16().getMetadata();

        expect(metadata.uri).toEqual(
          'sha256://0x7e99ecf3a4491e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b/https:%2F%2Fstorage.googleapis.com%2Ftzip-16%2Ftaco-shop-metadata.json'
        );
        expect(metadata.integrityCheckResult).toEqual(false);
        expect(metadata.sha256Hash).toEqual(
          '7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b'
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
        // Count the Rpc calls
        let user = await Tezos.signer.publicKeyHash();
        let rpcCountingMapContents: Map<String, number> | undefined;
        rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
          'rpcCountingMap'
        ];
        if (rpcCountingMapContents === undefined) {
          console.log('RPC count is undefined');
        } else {
          expect(rpcCountingMapContents.size).toEqual(5);
        }
        done();
      }
    );
  });
});
