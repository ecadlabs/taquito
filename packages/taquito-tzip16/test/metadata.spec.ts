import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet, MichelsonMap } from "@taquito/taquito";
import { MetadataEnvelope } from "../src/interfaceMetadataProvider";
import { MetadataProvider } from "../src/metadataProvider";
import { Crypto } from "../src/URIHandlers/utils";
import { Validator } from "../src/URIHandlers/validator";

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const f = new MetadataProvider();
const c = new Crypto;
const v = new Validator;

let testContractAbstraction: ContractAbstraction<ContractProvider | Wallet>;
let testContractTezosStorage: ContractAbstraction<ContractProvider | Wallet>;
let testContractSHA256: ContractAbstraction<ContractProvider | Wallet>
let testURL = "http://echo.jsontest.com/1/2/3/4"

beforeAll(async () => {
    testContractAbstraction = await Tezos.contract.at("KT1D3TCYU6BeGjj3kvLW4D9hnaoLAhX6rGhM");
    testContractTezosStorage = await Tezos.contract.at("KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg");
    testContractSHA256 = await Tezos.contract.at("KT1FeMKGGvdWiA4r5RaucoEUAa8cTEXSSpCX");
})

describe('FetcherProviderTests', () => {
    // it('successfully fetches a contract, for a given address', async (done) => {
    //     jest.setTimeout(10000);
    //     const fetchedMetadata = await f.provideMetadata(testContractAbstraction, testURL);
    //     expect(fetchedMetadata).toMatchObject({
    //         uri: 'http://echo.jsontest.com/1/2/3/4',
    //         metadata: { '1': '2', '3': '4' },
    //     })
    //     done();
    // })

    // it('fetch metadata on itself', async (done) => {
    //     jest.setTimeout(10000);
    //     console.log(await f.provideMetadata(testContractTezosStorage, 'tezos-storage:here'))
    //     done();
    // })

    it('fetch metadata on sha256', async (done) => {
        jest.setTimeout(10000);
        const sha256URL = "sha256://0x5fba33eccc1b310add3e66a76fe7c9cd8267b519f2f78a88b72868936a5cb28d/https:%2F%2Fraw.githubusercontent.com%2Ftqtezos%2FTZComet%2F8d95f7b%2Fdata%2Fmetadata_example0.json";
        console.log(await v.validateSHA256(sha256URL))
        done();
    })

    // it('hashes', (done) => {
    //     expect(c.sha256("{}")).toEqual(
    //         expect.stringMatching("44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a")
    //     )
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