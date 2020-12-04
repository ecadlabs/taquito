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
let testURL = "http://echo.jsontest.com/1/2/3/4"

beforeAll(async () => {
    testContractAbstraction = await Tezos.contract.at("KT1D3TCYU6BeGjj3kvLW4D9hnaoLAhX6rGhM");
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

    // it('successfully throws, for no address', async () => {
    //     jest.setTimeout(10000);
    //     const testUndefinedContractAbstraction = await Tezos.contract.at("");
    //     expect(f.fetchMetadata(testUndefinedContractAbstraction, testURL)).toThrow(Error);
    //     //done();
    // })

    it('hashes', (done) => {
        expect(c.sha256("{}")).toEqual(
            expect.stringMatching("44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a")
        )
        done();
    })

    it('validates tezos-storage uri', (done) => {
        const validation = v.validateTezosStorage("tezos-storage://KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX/%2Ffoo");
        expect(validation).toMatchObject({
            host: 'KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX',
            network: undefined,
            path: '%2Ffoo'
        })
        done();
    })

    test.todo('check for huge strings');
})