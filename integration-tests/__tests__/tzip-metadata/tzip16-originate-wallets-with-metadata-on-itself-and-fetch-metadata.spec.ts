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

  describe(`Test contract origination having metadata stored on chain through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify wallet.originate for a contract having metadata inside its own storage', async () => {

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

      const metadataBigMAp = new MichelsonMap();
      metadataBigMAp.set("", stringToBytes('tezos-storage:here'));
      metadataBigMAp.set("here", stringToBytes(JSON.stringify(metadataJSON)))

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

    it('Verify wallet.originate for a contract having metadata inside another contract same network', async () => {

      const metadataBigMAp = new MichelsonMap();
      metadataBigMAp.set("", stringToBytes(`tezos-storage://${contractAddress}/here`));

      const tacoShopStorageMap = new MichelsonMap();

      const op = await Tezos.wallet.originate({
        code: tacoContractTzip16,
        storage: {
          metadata: metadataBigMAp,
          taco_shop_storage: tacoShopStorageMap
        },
      }).send();
      await op.confirmation();
      contractMetadataInAnotherContract = (await op.contract()).address;
      expect(op.opHash).toBeDefined();
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
