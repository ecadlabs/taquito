import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet, Context } from "@taquito/taquito";
import { MetadataEnvelope } from "../src/interfaceMetadataProvider";
import { MetadataProvider } from "../src/metadataProvider";
import { Validator } from "../src/URIHandlers/validator";
import { } from "module";

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const f = new MetadataProvider();
const v = new Validator;
const c = new Context('https://api.tez.ie/rpc/carthagenet');

let testContractAbstraction: ContractAbstraction<ContractProvider | Wallet>;
let testContractTezosStorage: ContractAbstraction<ContractProvider | Wallet>;
let testContractSHA256: ContractAbstraction<ContractProvider | Wallet>
let testURL = "http://echo.jsontest.com/1/2/3/4"

beforeAll(async () => {
    testContractAbstraction = await Tezos.contract.at("KT1A1DmqFa8eusnpp8eLhwc8NPw29b2ddEHQ");
    testContractTezosStorage = await Tezos.contract.at("KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg");
    testContractSHA256 = await Tezos.contract.at("KT1FeMKGGvdWiA4r5RaucoEUAa8cTEXSSpCX");
})

describe('FetcherProviderTests', () => {
    jest.setTimeout(10000);
    it('fetch metadata on itself', async (done) => {
        expect(await f.provideMetadata(testContractAbstraction, 'https://storage.googleapis.com/tzip-16/empty-metadata.json', c)).toMatchObject({
            uri: 'https://storage.googleapis.com/tzip-16/empty-metadata.json',
            metadata:
            {
            },
            integrityCheckResult: false,
            sha256Hash: undefined
        })
        done();
    })

    // it('fetch metadata on itself', async (done) => {
    //     expect(await f.provideMetadata(testContractTezosStorage, 'tezos-storage:here', c)).toMatchObject({
    //         uri: 'tezos-storage:here',
    //         metadata:
    //         {
    //             name: 'test',
    //             description: 'A metadata test',
    //             version: '0.1',
    //             license: 'MIT',
    //             authors: ['Taquito <https://tezostaquito.io/>'],
    //             homepage: 'https://tezostaquito.io/'
    //         },
    //         integrityCheckResult: false,
    //         sha256Hash: undefined
    //     })
    //     done();
    // })

    // it('fetch metadata on sha256', async (done) => {
    //     const sha256URL = "sha256://0x5fba33eccc1b310add3e66a76fe7c9cd8267b519f2f78a88b72868936a5cb28d/https:%2F%2Fraw.githubusercontent.com%2Ftqtezos%2FTZComet%2F8d95f7b%2Fdata%2Fmetadata_example0.json";
    //     expect(await v.validateSHA256(sha256URL)).toBeTruthy()
    //     done();
    // })

    // it('validates tezos-storage uri', (done) => {
    //     const validation = v.validateTezosStorage("tezos-storage://KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX/%2Ffoo");
    //     expect(validation).toMatchObject({
    //         host: 'KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX',
    //         network: undefined,
    //         path: '%2Ffoo'
    //     })
    //     done();
    // })

    // it('validates tezos-storage uri', (done) => {
    //     const validation = v.validateTezosStorage("tezos-storage:here");
    //     expect(validation).toMatchObject({
    //         host: undefined,
    //         network: undefined,
    //         path: 'here'
    //     })
    //     done();
    // })

    test.todo('check for huge strings');
})