import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet, MichelsonMap } from "@taquito/taquito";
import { MetadataEnvelope } from "../src/interfaceFetcherProvider";
import { FetcherProvider } from "../src/fetcherProvider";

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const f = new FetcherProvider();

let testContractAbstraction: ContractAbstraction<ContractProvider | Wallet>;
let testURL = "http://echo.jsontest.com/1/2/3/4"

beforeAll(async () => {
    testContractAbstraction = await Tezos.contract.at("KT1D3TCYU6BeGjj3kvLW4D9hnaoLAhX6rGhM");
})

describe('FetcherProviderTests', () => {
    it('successfully fetches a contract, for a given address', async (done) => {
        jest.setTimeout(10000);
        const fetchedMetadata = await f.fetchMetadata(testContractAbstraction, testURL);
        expect(fetchedMetadata).toMatchObject({
            uri: 'http://echo.jsontest.com/1/2/3/4',
            metadata: { '1': '2', '3': '4' },
            integrityCheckResult: true
        })
        done();
    })

    // it('successfully throws, for no address', async () => {
    //     jest.setTimeout(10000);
    //     const testUndefinedContractAbstraction = await Tezos.contract.at("");
    //     expect(f.fetchMetadata(testUndefinedContractAbstraction, testURL)).toThrow(Error);
    //     //done();
    // })

    test.todo('check for huge strings');
})