import { StorageFetcher } from "../src/URIHandlers/storageHandler";

import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet, MichelsonMap } from "@taquito/taquito";

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const f = new StorageFetcher();

let testContractAbstraction: ContractAbstraction<ContractProvider | Wallet>;
let testContractTezosStorage: ContractAbstraction<ContractProvider | Wallet>;

beforeAll(async () => {
    testContractAbstraction = await Tezos.contract.at("KT1D3TCYU6BeGjj3kvLW4D9hnaoLAhX6rGhM");
    testContractTezosStorage = await Tezos.contract.at("KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg");
})

describe('StorageFetcherTests', () => {
    jest.setTimeout(30000)

    it("gets storage", async (done) => {
        expect(await f.getMetadataStorage(testContractTezosStorage, "here")).toMatchObject({
            name: 'test',
            description: 'A metadata test',
            version: '0.1',
            license: 'MIT',
            authors: ['Taquito <https://tezostaquito.io/>'],
            homepage: 'https://tezostaquito.io/'
        })
        done();
    })
    // it("gets storage", async (done) => {
    //     expect(await f.getMetadataType(testContractTezosStorage)).toMatchObject({
    //         prim: 'big_map',
    //         args: [{ prim: 'string' }, { prim: 'bytes' }],
    //         annots: ['%metadata']
    //     })
    //     done();
    // })

    // it("gets storage", async (done) => {
    //     expect(await f.getMetadataStorage(testContractTezosStorage, "")).toThrowError("Metadata is not JSON.");
    //     done();
    // })
})