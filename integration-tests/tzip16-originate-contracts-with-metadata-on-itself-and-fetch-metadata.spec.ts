import { CONFIGS } from "./config";
import { tzip16, Tzip16Module, char2Bytes } from '@taquito/tzip16';
import { tacoContractTzip16 } from "./data/modified-taco-contract"
import { MichelsonMap } from "@taquito/taquito";

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

            const metadataBigMap = new MichelsonMap();
            metadataBigMap.set("", char2Bytes('tezos-storage:here'));
            metadataBigMap.set("here", char2Bytes(JSON.stringify(metadataJSON)))

            // Ligo Taco shop contract modified to include metadata in storage
            // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

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
            done();
        });

        it('Fetch the metadata in the contract itself', async (done) => {

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

        it('Deploy a contract having metadata inside another contract same network', async (done) => {

            const metadataBigMap = new MichelsonMap();
            metadataBigMap.set("", char2Bytes(`tezos-storage://${contractAddress}/here`));

            const tacoShopStorageMap = new MichelsonMap();

            const op = await Tezos.contract.originate({
                code: tacoContractTzip16,
                storage: {
                    metadata: metadataBigMap,
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
