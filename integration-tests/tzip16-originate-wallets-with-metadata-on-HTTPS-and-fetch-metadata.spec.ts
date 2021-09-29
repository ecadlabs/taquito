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

  describe(`Originating contracts made with wallet api having metadata stored at HTTPS URL using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });
    it('Deploy a wallet api contract having empty metadata stored at an HTTPS URL', async (done) => {
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

      const op = await Tezos.wallet
        .originate({
          code: tacoContractTzip16,
          storage: {
            metadata: metadataBigMAp,
            taco_shop_storage: tacoShopStorageMap,
          },
        })
        .send();
      await op.confirmation();
      contractAddressEmptyMetadata = (await op.contract()).address;
      expect(op.opHash).toBeDefined();
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(14);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(5);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(3);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(7);
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
      done();
    });

    it('Fetch the empty metadata of the wallet api contract', async (done) => {
      const contract = await Tezos.wallet.at(contractAddressEmptyMetadata, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/empty-metadata.json');
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({});
      //                 		// Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(16);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(5);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2RGDXsW52srKVCF4aptnbKqZ95ih9sEp8o/balance`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(3);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2RGDXsW52srKVCF4aptnbKqZ95ih9sEp8o/manager_key`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(4);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2RGDXsW52srKVCF4aptnbKqZ95ih9sEp8o`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(8);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmptyMetadata}/script`
        )
      ).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmptyMetadata}/entrypoints`
        )
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/138289/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      done();
    });

    it('Deploy a wallet api contract having valid metadata stored at an HTTPS URL', async (done) => {
      // location of the contract metadata
      const url = 'https://storage.googleapis.com/tzip-16/taco-shop-metadata.json';
      const bytesUrl = char2Bytes(url);

      const metadataBigMAp = new MichelsonMap();
      metadataBigMAp.set('', bytesUrl);

      // Ligo Taco shop contract modified to include metadata in storage
      // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

      const tacoShopStorageMap = new MichelsonMap();
      tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

      const op = await Tezos.wallet
        .originate({
          code: tacoContractTzip16,
          storage: {
            metadata: metadataBigMAp,
            taco_shop_storage: tacoShopStorageMap,
          },
        })
        .send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
      const contractAddress = (await op.contract()).address;
      //                 		// Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(21);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(10);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2PE7JhiM2X9jXiGvsXy34p3EFMjGP6cep5/balance`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(5);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2PE7JhiM2X9jXiGvsXy34p3EFMjGP6cep5/manager_key`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(7);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2PE7JhiM2X9jXiGvsXy34p3EFMjGP6cep5`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        2
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(11);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1XM6psNwaUZyCFcdsmNT5anTz8sBxx1Vsd/script`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1XM6psNwaUZyCFcdsmNT5anTz8sBxx1Vsd/entrypoints`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/138297/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(2);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(1);
      done();
    });

    it('Deploy a wallet api contract having valid metadata which contains emoji stored at an HTTPS URL', async (done) => {
      // location of the contract metadata
      const url = 'https://storage.googleapis.com/tzip-16/emoji-in-metadata.json';
      const bytesUrl = char2Bytes(url);

      const metadataBigMAp = new MichelsonMap();
      metadataBigMAp.set('', bytesUrl);

      // Ligo Taco shop contract modified to include metadata in storage
      // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

      const tacoShopStorageMap = new MichelsonMap();
      tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

      const op = await Tezos.wallet
        .originate({
          code: tacoContractTzip16,
          storage: {
            metadata: metadataBigMAp,
            taco_shop_storage: tacoShopStorageMap,
          },
        })
        .send();
      await op.confirmation();
      contractAddressEmoji = (await op.contract()).address;
      expect(op.opHash).toBeDefined();
      const contractAddress = (await op.contract()).address;
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(26);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(15);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2S5qfsnKBhybeJorXR2GabYCifuNBQP8Y1/balance`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(7);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2S5qfsnKBhybeJorXR2GabYCifuNBQP8Y1/manager_key`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(11);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2S5qfsnKBhybeJorXR2GabYCifuNBQP8Y1`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(6);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        3
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(3);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(3);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(23);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT19gaTkzY27GcQqEmhE6RvaqxF2axseTvNm/script`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT19gaTkzY27GcQqEmhE6RvaqxF2axseTvNm/entrypoints`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/138309/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2Ap2E5khm451mPeonx2pftxeDaPrB6hdjC/balance`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2Ap2E5khm451mPeonx2pftxeDaPrB6hdjC/manager_key`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2Ap2E5khm451mPeonx2pftxeDaPrB6hdjC`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1BzbV1YmNvjnhHzmoPvbLbn4ZkWep9bPGF/script`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1BzbV1YmNvjnhHzmoPvbLbn4ZkWep9bPGF/entrypoints`)).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(2);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(2);
      done();
    });

    it('Fetch the metadata which contains emoji of the wallet api contract', async (done) => {
      const contract = await Tezos.wallet.at(contractAddressEmoji, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual('https://storage.googleapis.com/tzip-16/emoji-in-metadata.json');
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({
        name: 'Taquito test with valid metadata containing emoji 😀 🤩',
        description:
          '👋 This is metadata test for Taquito integration tests 🧐 with the Ligo Taco shop contract modified to include metadata URI in the storage',
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
      //                 		// Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(27);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(15);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2HAiqucdFJ3fUoTpK5FWbVFqxgLHRuL4j7/balance`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(7);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2HAiqucdFJ3fUoTpK5FWbVFqxgLHRuL4j7/manager_key`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(12);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2HAiqucdFJ3fUoTpK5FWbVFqxgLHRuL4j7`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(6);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        3
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(3);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(3);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(26);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1LSP3d2cPZRxnmNSkv8wRvKkoAbUhaM7nm/script`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1LSP3d2cPZRxnmNSkv8wRvKkoAbUhaM7nm/entrypoints`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/138313/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz28j72A4X2DCcoqDxx92S2g51ycSQdzhSPK/balance`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz28j72A4X2DCcoqDxx92S2g51ycSQdzhSPK/manager_key`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz28j72A4X2DCcoqDxx92S2g51ycSQdzhSPK`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1CUw2AvCX6D8eVPVS7fdjG94tV3omjES45/script`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1CUw2AvCX6D8eVPVS7fdjG94tV3omjES45/entrypoints`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2C3KW1R83UJbANTDHBt8a9sEttWVQBSDoG/balance`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2C3KW1R83UJbANTDHBt8a9sEttWVQBSDoG/manager_key`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2C3KW1R83UJbANTDHBt8a9sEttWVQBSDoG`)).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmptyMetadata}/script`
        )
      ).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmptyMetadata}/entrypoints`
        )
      ).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/138315/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      done();
    });

    it('Deploy a wallet api contract having invalid metadata stored at an HTTPS URL', async (done) => {
      // location of the contract metadata
      const url = 'https://storage.googleapis.com/tzip-16/invalid.json';
      const bytesUrl = char2Bytes(url);

      const metadataBigMAp = new MichelsonMap();
      metadataBigMAp.set('', bytesUrl);

      // Ligo Taco shop contract modified to include metadata in storage
      // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

      const tacoShopStorageMap = new MichelsonMap();
      tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

      const op = await Tezos.wallet
        .originate({
          code: tacoContractTzip16,
          storage: {
            metadata: metadataBigMAp,
            taco_shop_storage: tacoShopStorageMap,
          },
        })
        .send();
      await op.confirmation();
      contractAddressInvalidMetadata = (await op.contract()).address;
      expect(op.opHash).toBeDefined();
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(32);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(20);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz29TQDyTYx387CkX5rGZS7r4dPZvJ9rKFaW/balance`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(9);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz29TQDyTYx387CkX5rGZS7r4dPZvJ9rKFaW/manager_key`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(15);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz29TQDyTYx387CkX5rGZS7r4dPZvJ9rKFaW`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(8);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        4
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(4);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(4);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(22);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1VGqczKRVioBzJH32WZzmjn4ZrxgdNRQh1/script`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1VGqczKRVioBzJH32WZzmjn4ZrxgdNRQh1/entrypoints`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/70850/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz28utgeTzjjfLTCRP6SFNS4vy3K39Nf2wpW/balance`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz28utgeTzjjfLTCRP6SFNS4vy3K39Nf2wpW/manager_key`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz28utgeTzjjfLTCRP6SFNS4vy3K39Nf2wpW`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1W69vHaJFYDmW7658m5yKDGXpqaZn1cTzv/script`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1W69vHaJFYDmW7658m5yKDGXpqaZn1cTzv/entrypoints`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2Fn11b72HY29z8jJH2pBPnV4qgvUSnvgS8/balance`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2Fn11b72HY29z8jJH2pBPnV4qgvUSnvgS8/manager_key`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2Fn11b72HY29z8jJH2pBPnV4qgvUSnvgS8`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1G9YpKjZw3euPtaac68sPbmJyJujz4fBL1/script`)).toEqual(3);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1G9YpKjZw3euPtaac68sPbmJyJujz4fBL1/entrypoints`)).toEqual(3);
      //  //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/70857/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressInvalidMetadata}/script`
        )
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressInvalidMetadata}/entrypoints`
        )
      ).toEqual(1);
      done();
    });

    it('Should fail to fetch invalid metadata of the wallet api contract', async (done) => {
      const contract = await Tezos.wallet.at(contractAddressInvalidMetadata, tzip16);
      try {
        await contract.tzip16().getMetadata();
      } catch (error) {
        expect(error.message).toContain(`Invalid metadata`);
      }
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(33);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(20);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2KGHemp9mWSqsZPW1DTzb8UA1nNbSmagDo/balance`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(9);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2KGHemp9mWSqsZPW1DTzb8UA1nNbSmagDo/manager_key`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(16);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2KGHemp9mWSqsZPW1DTzb8UA1nNbSmagDo`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(8);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        4
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(4);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(4);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(33);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1Nu5h2Yd5nEmVowTn9KYV4e1Bi5mrKmUwk/script`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1Nu5h2Yd5nEmVowTn9KYV4e1Bi5mrKmUwk/entrypoints`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(3);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/70859/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2PCB8Xc5RDx1SU17EVeYG1VwWwGtRpVWmX/balance`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2PCB8Xc5RDx1SU17EVeYG1VwWwGtRpVWmX/manager_key`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2PCB8Xc5RDx1SU17EVeYG1VwWwGtRpVWmX`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1A9D18aXvEx2sb8X2u43utYnXFDkHowbtK/script`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1A9D18aXvEx2sb8X2u43utYnXFDkHowbtK/entrypoints`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2KZHadrhCAR6BV16ZqagQFJUoBxo1vW2wM/balance`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2KZHadrhCAR6BV16ZqagQFJUoBxo1vW2wM/manager_key`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2KZHadrhCAR6BV16ZqagQFJUoBxo1vW2wM`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1NsdPyb2EEjJDVx8qqXHRusE6LWZgU4pwY/script`)).toEqual(3);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/KT1NsdPyb2EEjJDVx8qqXHRusE6LWZgU4pwY/entrypoints`)).toEqual(3);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/70864/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2WmEmvQVF46gb3YRgksuKPMvazad5yfhDn/balance`)).toEqual(1);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2WmEmvQVF46gb3YRgksuKPMvazad5yfhDn/manager_key`)).toEqual(2);
      //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2WmEmvQVF46gb3YRgksuKPMvazad5yfhDn`)).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressInvalidMetadata}/script`
        )
      ).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressInvalidMetadata}/entrypoints`
        )
      ).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/70866/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      done();
    });
  });
});
