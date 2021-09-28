import { CONFIGS } from './config';
import { tacoContractTzip16 } from './data/modified-taco-contract';
import { MichelsonMap } from '@taquito/taquito';
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { RpcClient } from '@taquito/rpc';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());
  Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });

  let contractAddressEmptyMetadata: string;
  let contractAddressEmoji: string;
  let contractAddressInvalidMetadata: string;

  const test = require('jest-retries');

  describe(`Originating contracts having metadata stored at HTTPS URL using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });
    test('Deploy a contract having empty metadata stored at an HTTPS URL', async (done: () => void) => {
      // location of the contract metadata
      const url = 'https://storage.googleapis.com/tzip-16/empty-metadata.json';
      const bytesUrl = char2Bytes(url);

      const metadataBigMAp = new MichelsonMap();
      metadataBigMAp.set('', bytesUrl);

      // Ligo Taco shop contract modified to include metadata in storage
      // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

      const tacoShopStorageMap = new MichelsonMap();
      tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });
      tacoShopStorageMap.set('2', { current_stock: '120', max_price: '20' });
      tacoShopStorageMap.set('3', { current_stock: '50', max_price: '60' });

      const op = await Tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: metadataBigMAp,
          taco_shop_storage: tacoShopStorageMap,
        },
      });
      await op.confirmation();
      contractAddressEmptyMetadata = (await op.contract()).address;
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(14);
      const signer = await Tezos.signer.publicKeyHash();
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(5);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(5);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        2
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(3);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmptyMetadata}/script`
        )
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmptyMetadata}/entrypoints`
        )
      ).toEqual(1);
    });

    test('Fetch the empty metadata of the contract', async (done: () => void) => {
      const contract = await Tezos.contract.at(contractAddressEmptyMetadata, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/empty-metadata.json');
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({});
      done();
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(16);
      const signer = await Tezos.signer.publicKeyHash();
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/tz2PLMuvGrZhVwpQDndJ6SiS8iNg22VWStDr/balance`
        )
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(5);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(5);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/tz2PLMuvGrZhVwpQDndJ6SiS8iNg22VWStDr/manager_key`
        )
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(5);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/tz2PLMuvGrZhVwpQDndJ6SiS8iNg22VWStDr`
        )
      ).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        2
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(3);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/KT1KbutRdNYs3B937Rzy27c2KZL2u3ELjqwX/script`
        )
      ).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/KT1KbutRdNYs3B937Rzy27c2KZL2u3ELjqwX/entrypoints`
        )
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/big_maps/67678/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`
        )
      ).toEqual(1);
    });

    test('Deploy a contract having valid metadata stored at an HTTPS URL', async (done: () => void) => {
      // location of the contract metadata
      const url = 'https://storage.googleapis.com/tzip-16/taco-shop-metadata.json';
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
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      let contractAddress = (await op.contract()).address;

      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      //sometimes the size is 21 and sometimes it is 19
      //expect(countRpc.size).toEqual(19);
      //expect(countRpc.size).toEqual(21);
      const signer = await Tezos.signer.publicKeyHash();
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2CF38t3yMBYADkfi6mFMzqiBDeFXE4MhD5/balance`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(9);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(10);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2CF38t3yMBYADkfi6mFMzqiBDeFXE4MhD5/manager_key`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(8);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2CF38t3yMBYADkfi6mFMzqiBDeFXE4MhD5`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(6);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        4
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(13);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/67743/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(2);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(3);
      done();
    });

    test('Deploy a contract having valid metadata which contains emoji stored at an HTTPS URL', async (done: () => void) => {
      // location of the contract metadata
      const url = 'https://storage.googleapis.com/tzip-16/emoji-in-metadata.json';
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
      contractAddressEmoji = (await op.contract()).address;
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(26);
      const signer = await Tezos.signer.publicKeyHash();
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2DN3NP4VtxgEXXeVKdMrKdbywoCNLkr7u3/balance`)).toEqual(2,
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(13);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(15);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2DN3NP4VtxgEXXeVKdMrKdbywoCNLkr7u3/manager_key`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(13);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2DN3NP4VtxgEXXeVKdMrKdbywoCNLkr7u3`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(9);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(6);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        6
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(3);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(3);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(20);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/KT1QgRpPPw86xgizPKuJx32ikD3kiMcfJJDV/script`
        )
      ).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/KT1QgRpPPw86xgizPKuJx32ikD3kiMcfJJDV/entrypoints`
        )
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/67767/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2B17f95QPRDwDBMEDajRjxsfGa6PKaURL9/balance`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2B17f95QPRDwDBMEDajRjxsfGa6PKaURL9/manager_key`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2B17f95QPRDwDBMEDajRjxsfGa6PKaURL9`)).toEqual(3);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1UgiPjEUwVPCqUGM3WVMXxbXc4vktYro86/script`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1UgiPjEUwVPCqUGM3WVMXxbXc4vktYro86/entrypoints`)).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(2);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(3);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmoji}/script`
        )
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmoji}/entrypoints`
        )
      ).toEqual(1);
    });

    //         test('Fetch the metadata which contains emoji of the contract', async (done: () => void) => {

    //             const contract = await Tezos.contract.at(contractAddressEmoji, tzip16);
    //             const metadata = await contract.tzip16().getMetadata();

    //             expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/emoji-in-metadata.json');
    //             expect(metadata.integrityCheckResult).toBeUndefined();
    //             expect(metadata.sha256Hash).toBeUndefined();
    //             expect(metadata.metadata).toEqual({
    //                 "name": "Taquito test with valid metadata containing emoji 😀 🤩",
    //                 "description": "👋 This is metadata test for Taquito integration tests 🧐 with the Ligo Taco shop contract modified to include metadata URI in the storage",
    //                 "version": "7.1.0-beta.0",
    //                 "license": {
    //                     "name": "MIT",
    //                     "details": "The MIT License"
    //                 },
    //                 "homepage": "https://github.com/ecadlabs/taquito",
    //                 "source": {
    //                     "tools": [
    //                         "Ligo",
    //                         "https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A"
    //                     ],
    //                     "location": "https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-payout"
    //                 }
    //             });
    //             done();
    //             // Count the Rpc calls
    // let user = await Tezos.signer.publicKeyHash();
    // let rpcCountingMapContents: Map<String, number> | undefined;
    // rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
    //   'rpcCountingMap'
    // ];
    // if (rpcCountingMapContents === undefined) {
    //   console.log('RPC count is undefined');
    // } else {
    // 	console.log(rpcCountingMapContents);
    //   expect(rpcCountingMapContents.size).toEqual(14);
    //         };
    //         });

    //         test('Deploy a contract having invalid metadata stored at an HTTPS URL', async (done: () => void) => {

    //             // location of the contract metadata
    //             const url = 'https://storage.googleapis.com/tzip-16/invalid.json';
    //             const bytesUrl = char2Bytes(url);

    //             const metadataBigMAp = new MichelsonMap();
    //             metadataBigMAp.set("", bytesUrl);

    //             // Ligo Taco shop contract modified to include metadata in storage
    //             // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

    //             const tacoShopStorageMap = new MichelsonMap();
    //             tacoShopStorageMap.set("1", { current_stock: "10000", max_price: "50" });

    //             const op = await Tezos.contract.originate({
    //                 code: tacoContractTzip16,
    //                 storage: {
    //                     metadata: metadataBigMAp,
    //                     taco_shop_storage: tacoShopStorageMap
    //                 },
    //             });
    //             await op.confirmation();
    //             contractAddressInvalidMetadata = (await op.contract()).address;
    //             expect(op.hash).toBeDefined();
    //             expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    //             done();
    //             // Count the Rpc calls
    // let user = await Tezos.signer.publicKeyHash();
    // let rpcCountingMapContents: Map<String, number> | undefined;
    // rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
    //   'rpcCountingMap'
    // ];
    // if (rpcCountingMapContents === undefined) {
    //   console.log('RPC count is undefined');
    // } else {
    // 	console.log(rpcCountingMapContents);
    //   expect(rpcCountingMapContents.size).toEqual(14);
    //         };
    //         });

    //         test('Should fail to fetch invalid metadata of the contract', async (done: () => void) => {

    //             const contract = await Tezos.contract.at(contractAddressInvalidMetadata, tzip16);
    //             try {
    //                 await contract.tzip16().getMetadata();
    //             } catch (error) {
    //                 expect(error.message).toContain(`Invalid metadata`);
    //             }

    //             done();
    //             // Count the Rpc calls
    // let user = await Tezos.signer.publicKeyHash();
    // let rpcCountingMapContents: Map<String, number> | undefined;
    // rpcCountingMapContents = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache)[
    //   'rpcCountingMap'
    // ];
    // if (rpcCountingMapContents === undefined) {
    //   console.log('RPC count is undefined');
    // } else {
    // 	console.log(rpcCountingMapContents);
    //   expect(rpcCountingMapContents.size).toEqual(14);
    //         };
    //       });
  });
});
