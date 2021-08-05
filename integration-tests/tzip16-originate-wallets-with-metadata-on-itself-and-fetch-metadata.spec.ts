import { CONFIGS } from "./config";
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { tacoContractTzip16 } from "./data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    Tezos.addExtension(new Tzip16Module());
    let contractAddress: string;
    let contractMetadataInAnotherContract: string;

    describe(`Originating wallet api contracts having metadata stored on chain: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })
        it('Deploy a wallet api contract having metadata inside its own storage', async (done) => {

            const metadataJSON = {
                "name": "test",
                "description": "A metadata test",
                "version": "0.1",
                "license": "MIT",
                "authors": [
                  "Taquito <https://tezostaquito.io/>"
                ],
                "homepage": "https://tezostaquito.io/"
              };

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", char2Bytes('tezos-storage:here'));
            metadataBigMAp.set("here", char2Bytes(JSON.stringify(metadataJSON)))

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
            console.log("contract address : "+contractAddress)
            expect(op.opHash).toBeDefined();
            done();
        });

        it('Fetch the metadata in the wallet api contract itself', async (done) => {

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
                  "Taquito <https://tezostaquito.io/>"
                ],
                "homepage": "https://tezostaquito.io/"
              });
            done();
        });

        it('Deploy a wallet api contract having metadata inside another contract same network', async (done) => {

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", char2Bytes(`tezos-storage://${contractAddress}/here`));

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
            done();
        });

        it('Fetch the metadata in the storage of the other wallet api contract', async (done) => {

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
                  "Taquito <https://tezostaquito.io/>"
                ],
                "homepage": "https://tezostaquito.io/"
              });
            done();
        });
        
    });
})
