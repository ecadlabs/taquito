import { CONFIGS } from "../../config";
import { tzip16, Tzip16Module } from '@taquito/tzip16';
import { stringToBytes } from '@taquito/utils';
import { tacoContractTzip16 } from "../../data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  Tezos.addExtension(new Tzip16Module());

  const createEmbeddedMetadataMap = () => {
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
    metadataBigMap.set("here", stringToBytes(JSON.stringify(metadataJSON)));
    return metadataBigMap;
  };

  describe(`Test contract origination having metadata stored on chain through wallet api using: ${rpc}`, () => {
    beforeAll(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 })
    })

    describe('contract metadata inside its own storage', () => {
      let contractAddress: string;

      beforeAll(async () => {
        const op = await Tezos.wallet.originate({
          code: tacoContractTzip16,
          storage: {
            metadata: createEmbeddedMetadataMap(),
            taco_shop_storage: new MichelsonMap()
          },
        }).send();
        await op.confirmation();
        contractAddress = (await op.contract()).address;
      });

      it('Verify wallet.originate for a contract having metadata inside its own storage', async () => {
        expect(contractAddress).toBeDefined();
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
    });

    describe('contract metadata inside another contract on the same network', () => {
      let sourceContractAddress: string;
      let contractMetadataInAnotherContract: string;

      beforeAll(async () => {
        const sourceContractOp = await Tezos.wallet.originate({
          code: tacoContractTzip16,
          storage: {
            metadata: createEmbeddedMetadataMap(),
            taco_shop_storage: new MichelsonMap()
          },
        }).send();
        await sourceContractOp.confirmation();
        sourceContractAddress = (await sourceContractOp.contract()).address;

        const metadataBigMap = new MichelsonMap();
        metadataBigMap.set("", stringToBytes(`tezos-storage://${sourceContractAddress}/here`));

        const targetOp = await Tezos.wallet.originate({
          code: tacoContractTzip16,
          storage: {
            metadata: metadataBigMap,
            taco_shop_storage: new MichelsonMap()
          },
        }).send();
        await targetOp.confirmation();
        contractMetadataInAnotherContract = (await targetOp.contract()).address;
      });

      it('Verify wallet.originate for a contract having metadata inside another contract same network', async () => {
        expect(contractMetadataInAnotherContract).toBeDefined();
      });

      it('Verify that metadata for contract having metadata inside another contract on the same network can be fetched', async () => {
        const contract = await Tezos.wallet.at(contractMetadataInAnotherContract, tzip16);
        const metadata = await contract.tzip16().getMetadata();

        expect(metadata.uri).toEqual(`tezos-storage://${sourceContractAddress}/here`);
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
  });
})
