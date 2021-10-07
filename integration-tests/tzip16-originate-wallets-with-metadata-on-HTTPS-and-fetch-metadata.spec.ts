import { CONFIGS } from './config';
import { tacoContractTzip16 } from './data/modified-taco-contract';
import { MichelsonMap } from '@taquito/taquito';
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { RpcClient, RpcClientCache } from '@taquito/rpc';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());

  let contractAddressEmptyMetadata: string;
  let contractAddressEmoji: string;
  let contractAddressInvalidMetadata: string;

  describe(`Originating contracts made with wallet api having metadata stored at HTTPS URL using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup(false);
      Tezos.setRpcProvider(new RpcClientCache(new RpcClient(rpc, 'main', new HttpBackendForRPCCache())))
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
       const countRpc = (((Tezos.rpc as RpcClientCache)['rpcClient']as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(14);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toBeLessThanOrEqual(3);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(2);
       expect(
         countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
       ).toBeLessThanOrEqual(2);
    expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toBeLessThanOrEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(1);
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
       const countRpc = (((Tezos.rpc as RpcClientCache)['rpcClient']as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(5);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddressEmptyMetadata}/entrypoints`
        )
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/73631/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
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
       const countRpc = (((Tezos.rpc as RpcClientCache)['rpcClient']as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(14);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toBeLessThanOrEqual(3);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toBeLessThanOrEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toBeLessThanOrEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toBeLessThanOrEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(4);
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
       const countRpc = (((Tezos.rpc as RpcClientCache)['rpcClient']as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(14);
      const signer = await Tezos.signer.publicKeyHash();
    //  expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(3); //2 //3
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(1);
       expect(
         countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
       ).toBeLessThanOrEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toBeLessThanOrEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(1); //2
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(4);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(1); //2
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(1); //2
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
      // Count the Rpc calls
      const countRpc = (((Tezos.rpc as RpcClientCache)['rpcClient']as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(5); //6
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
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/73739/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
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
       const countRpc = (((Tezos.rpc as RpcClientCache)['rpcClient']as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(14);
      const signer = await Tezos.signer.publicKeyHash();
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toBeLessThanOrEqual(3);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toBeLessThanOrEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toBeLessThanOrEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toBeLessThanOrEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        1
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(18);
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
       const countRpc = (((Tezos.rpc as RpcClientCache)['rpcClient']as RpcClient)['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap
      expect(countRpc.size).toEqual(5);
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
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(1);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/73818/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      done();
    });
  });
});
