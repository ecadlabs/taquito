import { CONFIGS } from "../../config";
import { tzip16, Tzip16Module } from '@taquito/tzip16';
import { stringToBytes } from '@taquito/utils';
import { tacoContractTzip16 } from "../../data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());
  let contractAddress: string;
  let contractMetadataInAnotherContract: string;

  describe(`Test contract origination having metadata stored on chain through contract api using: ${rpc}`, () => {

    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 })

      // Originate contract with metadata inside its own storage
      const metadataJSON = {
        "name": "test",
        "description": "A metadata test",
        "version": "0.1",
        "license": "MIT",
        "authors": [
          "Taquito <https://taquito.io/>"
        ],
        "homepage": "https://taquito.io/"
      };

      const metadataBigMap = new MichelsonMap();
      metadataBigMap.set("", stringToBytes('tezos-storage:here'));
      metadataBigMap.set("here", stringToBytes(JSON.stringify(metadataJSON)))

      const tacoShopStorageMap = new MichelsonMap();

      const op = await Tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: metadataBigMap,
          taco_shop_storage: tacoShopStorageMap
        },
      });
      await op.confirmation();
      contractAddress = (await op.contract()).address;
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      // Originate contract with metadata pointing to the first contract
      const metadataBigMap2 = new MichelsonMap();
      metadataBigMap2.set("", stringToBytes(`tezos-storage://${contractAddress}/here`));

      const tacoShopStorageMap2 = new MichelsonMap();

      const op2 = await Tezos.contract.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: metadataBigMap2,
          taco_shop_storage: tacoShopStorageMap2
        },
      });
      await op2.confirmation();
      contractMetadataInAnotherContract = (await op2.contract()).address;
      expect(op2.hash).toBeDefined();
      expect(op2.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    })

    it('Verify the metadata for a contract having metadata inside its own storage can be fetched', async () => {

      const contract = await Tezos.wallet.at(contractAddress, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual('tezos-storage:here');
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({
        "name": "test",
        "description": "A metadata test",
        "version": "0.1",
        "license": "MIT",
        "authors": [
          "Taquito <https://taquito.io/>"
        ],
        "homepage": "https://taquito.io/"
      });

      expect(await (await contract.tzip16()).metadataName()).toEqual('test')
      expect(await (await contract.tzip16()).metadataDescription()).toEqual('A metadata test')
      expect(await (await contract.tzip16()).metadataVersion()).toEqual('0.1')
      expect(await (await contract.tzip16()).metadataLicense()).toEqual('MIT')
      expect(await (await contract.tzip16()).metadataAuthors()).toEqual(["Taquito <https://taquito.io/>"])
      expect(await (await contract.tzip16()).metadataHomepage()).toEqual('https://taquito.io/')
      expect(await (await contract.tzip16()).metadataSource()).toBeUndefined()
      expect(await (await contract.tzip16()).metadataInterfaces()).toBeUndefined()
      expect(await (await contract.tzip16()).metadataErrors()).toBeUndefined()
      expect(await (await contract.tzip16()).metadataViews()).toEqual({});

    });

    it('Verify that metadata for contract having metadata inside another contract on the same network can be fetched', async () => {

      const contract = await Tezos.wallet.at(contractMetadataInAnotherContract, tzip16);
      const metadata = await contract.tzip16().getMetadata();

      expect(metadata.uri).toEqual(`tezos-storage://${contractAddress}/here`);
      expect(metadata.integrityCheckResult).toBeUndefined();
      expect(metadata.sha256Hash).toBeUndefined();
      expect(metadata.metadata).toEqual({
        "name": "test",
        "description": "A metadata test",
        "version": "0.1",
        "license": "MIT",
        "authors": [
          "Taquito <https://taquito.io/>"
        ],
        "homepage": "https://taquito.io/"
      });

      expect(await (await contract.tzip16()).metadataName()).toEqual('test')
      expect(await (await contract.tzip16()).metadataDescription()).toEqual('A metadata test')
      expect(await (await contract.tzip16()).metadataVersion()).toEqual('0.1')
      expect(await (await contract.tzip16()).metadataLicense()).toEqual('MIT')
      expect(await (await contract.tzip16()).metadataAuthors()).toEqual(["Taquito <https://taquito.io/>"])
      expect(await (await contract.tzip16()).metadataHomepage()).toEqual('https://taquito.io/')
      expect(await (await contract.tzip16()).metadataSource()).toBeUndefined()
      expect(await (await contract.tzip16()).metadataInterfaces()).toBeUndefined()
      expect(await (await contract.tzip16()).metadataErrors()).toBeUndefined()
      expect(await (await contract.tzip16()).metadataViews()).toEqual({});

    });

  });
})
