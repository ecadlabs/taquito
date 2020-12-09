import { CONFIGS } from "./config";
import { char2Bytes } from "../packages/taquito-tzip16/src/tzip16-utils"
import { tacoContractTzip16 } from "./data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";
import { tzip16 } from '../packages/taquito-tzip16/src/composer';
import { Tzip16Module } from "../packages/taquito-tzip16/src/tzip16-extension";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    Tezos.addExtension(new Tzip16Module());
    let contractAddress: string;
    let contractMetadataInAnotherContract: string;

    describe(`Originating contracts having metadata stored on chain: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })
        it('Deploy a contract having metadata inside its own storage', async (done) => {
            // carthagenet: KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg
            // delphinet: KT1KTkzGMHN4P1XvT4X1kFT5ubcvzxs6ZfSq

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

            const op = await Tezos.contract.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            });
            await op.confirmation();
            contractAddress = (await op.contract()).address;
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });

        it('Fetch the metadata in the contract itself', async (done) => {
            // carthagenet: KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg
            // delphinet: KT1KTkzGMHN4P1XvT4X1kFT5ubcvzxs6ZfSq

            const contract = await Tezos.contract.at(contractAddress, tzip16);
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual('tezos-storage:here');
            //expect(metadata.integrityCheckResult).toBeUndefined();
            //expect(metadata.sha256Hash).toBeUndefined();
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

        it('Deploy a contract having metadata inside another contract same network', async (done) => {
            // carthagenet: KT1Ud3D2oyE27Xz7wh5AhD9wz8wc4pkuXeT4
            // delphinet: KT1BAQ3nEsLrEeZdkij8KiekaWUVQERNF1Hi

            const metadataBigMAp = new MichelsonMap();
            metadataBigMAp.set("", char2Bytes(`tezos-storage://${contractAddress}/here`));

            const tacoShopStorageMap = new MichelsonMap();

            const op = await Tezos.contract.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMAp,
                    taco_shop_storage: tacoShopStorageMap
                },
            });
            await op.confirmation();
            contractMetadataInAnotherContract = (await op.contract()).address;
            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            done();
        });

        it('Fetch the metadata in the storage of the other contract', async (done) => {
            // carthagenet: KT1Ud3D2oyE27Xz7wh5AhD9wz8wc4pkuXeT4
            // delphinet: KT1BAQ3nEsLrEeZdkij8KiekaWUVQERNF1Hi 

            const contract = await Tezos.contract.at(contractMetadataInAnotherContract, tzip16);
            const metadata = await contract.tzip16().getMetadata();

            expect(metadata.uri).toEqual(`tezos-storage://${contractAddress}/here`);
            //expect(metadata.integrityCheckResult).toBeUndefined();
            //expect(metadata.sha256Hash).toBeUndefined();
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
