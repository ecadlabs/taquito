import { CONFIGS } from './config';
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { tacoContractTzip16 } from './data/modified-taco-contract';
import { MichelsonMap } from '@taquito/taquito';
import { HttpBackendForRPCCache } from './HttPBackendForRPCCache';
import { RpcClient } from '@taquito/rpc';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());
  Tezos.setProvider({ rpc: new RpcClient(rpc, 'main', new HttpBackendForRPCCache()) });
  let contractAddress: string;
  let contractMetadataInAnotherContract: string;

  describe(`Originating contracts having metadata stored on chain: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });
    it('Deploy a contract having metadata inside its own storage', async (done) => {
      const metadataJSON = {
        name: 'test',
        description: 'A metadata test',
        version: '0.1',
        license: 'MIT',
        authors: ['Taquito <https://tezostaquito.io/>'],
        homepage: 'https://tezostaquito.io/',
      };

      const metadataBigMap = new MichelsonMap();
      metadataBigMap.set('', char2Bytes('tezos-storage:here'));
      metadataBigMap.set('here', char2Bytes(JSON.stringify(metadataJSON)));

      // Ligo Taco shop contract modified to include metadata in storage
      // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

      const tacoShopStorageMap = new MichelsonMap();

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
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(2);
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

    it('Fetch the metadata in the contract itself', async (done) => {
      const contract = await Tezos.wallet.at(contractAddress, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual('tezos-storage:here');
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({
        name: 'test',
        description: 'A metadata test',
        version: '0.1',
        license: 'MIT',
        authors: ['Taquito <https://tezostaquito.io/>'],
        homepage: 'https://tezostaquito.io/',
      });
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(17);
      const signer = await Tezos.signer.publicKeyHash();
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2TBTN62BcCQExEDHMQVZ4FJfRzxCVgazWt/balance`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(5);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(5);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2TBTN62BcCQExEDHMQVZ4FJfRzxCVgazWt/manager_key`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(5);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2TBTN62BcCQExEDHMQVZ4FJfRzxCVgazWt`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        2
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(1);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(6);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(3);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/68938/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/68938/expruaHzyjwFcmFKHqR49qdxwJupAna6ygSKo2mFJQtqZQjid5t8GK`)).toEqual(1);
      done();
    });

    it('Deploy a contract having metadata inside another contract same network', async (done) => {
      const metadataBigMap = new MichelsonMap();
      metadataBigMap.set('', char2Bytes(`tezos-storage://${contractAddress}/here`));

      const tacoShopStorageMap = new MichelsonMap();

      const op = await Tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: metadataBigMap,
          taco_shop_storage: tacoShopStorageMap,
        },
      });
      await op.confirmation();
      contractMetadataInAnotherContract = (await op.contract()).address;
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(22);
      const signer = await Tezos.signer.publicKeyHash();
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2WhgQ1VPY9uhpZEafFMe11CXDmWvfKyWKM/balance`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(9);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(10);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2WhgQ1VPY9uhpZEafFMe11CXDmWvfKyWKM/manager_key`)).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(9);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/tz2WhgQ1VPY9uhpZEafFMe11CXDmWvfKyWKM`)).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(6);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        4
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(22);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(3);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/68954/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/68954/expruaHzyjwFcmFKHqR49qdxwJupAna6ygSKo2mFJQtqZQjid5t8GK`)).toEqual(1);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/balance`)
      ).toEqual(2);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}/manager_key`)
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${signer}`)).toEqual(3);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractMetadataInAnotherContract}/script`
        )
      ).toEqual(1);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractMetadataInAnotherContract}/entrypoints`
        )
      ).toEqual(1);
      done();
    });

    it('Fetch the metadata in the storage of the other contract', async (done) => {
      const contract = await Tezos.wallet.at(contractMetadataInAnotherContract, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual(`tezos-storage://${contractAddress}/here`);
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({
        name: 'test',
        description: 'A metadata test',
        version: '0.1',
        license: 'MIT',
        authors: ['Taquito <https://tezostaquito.io/>'],
        homepage: 'https://tezostaquito.io/',
      });
      // Count the Rpc calls
      const countRpc = (Tezos.rpc['httpBackend'] as HttpBackendForRPCCache).rpcCountingMap;
      expect(countRpc.size).toEqual(23);
      const signer = await Tezos.signer.publicKeyHash();
      //   expect(
      //     countRpc.get(
      //       `${rpc}/chains/main/blocks/head/context/contracts/tz2J7b3GUQgJfiU6MtBFAx7cshc8LtQ8cGvF/balance`
      //     )
      //   ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/constants`)).toEqual(9);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/metadata`)).toEqual(10);
      //   expect(
      //     countRpc.get(
      //       `${rpc}/chains/main/blocks/head/context/contracts/tz2J7b3GUQgJfiU6MtBFAx7cshc8LtQ8cGvF/manager_key`
      //     )
      //   ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/header`)).toEqual(10);
      //   expect(
      //     countRpc.get(
      //       `${rpc}/chains/main/blocks/head/context/contracts/tz2J7b3GUQgJfiU6MtBFAx7cshc8LtQ8cGvF`
      //     )
      //   ).toEqual(3);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/forge/operations`)).toEqual(6);
      expect(countRpc.get(`${rpc}/chains/main/chain_id`)).toEqual(4);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/run_operation`)).toEqual(
        4
      );
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/preapply/operations`)).toEqual(2);
      expect(countRpc.get(`${rpc}/injection/operation`)).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head`)).toEqual(15);
      expect(
        countRpc.get(`${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/script`)
      ).toEqual(4);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractAddress}/entrypoints`
        )
      ).toEqual(2);
      expect(countRpc.get(`${rpc}/chains/main/blocks/head/helpers/scripts/pack_data`)).toEqual(4);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/69041/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/69041/expruaHzyjwFcmFKHqR49qdxwJupAna6ygSKo2mFJQtqZQjid5t8GK`)).toEqual(2);
      //   expect(
      //     countRpc.get(
      //       `${rpc}/chains/main/blocks/head/context/contracts/tz2WB9BCWjTnQ3ffhY6bBQLgkaWzsyneCtAm/balance`
      //     )
      //   ).toEqual(2);
      //   expect(
      //     countRpc.get(
      //       `${rpc}/chains/main/blocks/head/context/contracts/tz2WB9BCWjTnQ3ffhY6bBQLgkaWzsyneCtAm/manager_key`
      //     )
      //   ).toEqual(2);
      //   expect(
      //     countRpc.get(
      //       `${rpc}/chains/main/blocks/head/context/contracts/tz2WB9BCWjTnQ3ffhY6bBQLgkaWzsyneCtAm`
      //     )
      //   ).toEqual(3);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractMetadataInAnotherContract}/script`
        )
      ).toEqual(2);
      expect(
        countRpc.get(
          `${rpc}/chains/main/blocks/head/context/contracts/${contractMetadataInAnotherContract}/entrypoints`
        )
      ).toEqual(2);
      //expect(countRpc.get(`${rpc}/chains/main/blocks/head/context/big_maps/69042/expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo`)).toEqual(1);
      done();
    });
  });
});
