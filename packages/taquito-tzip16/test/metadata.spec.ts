import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from "@taquito/taquito";
import { FetcherProvider } from "../src/interfaceFetcherProvider";

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const f = new FetcherProvider();

describe('FetcherProviderTests', () => {
    it('successfully fetches a contract, for a given address', async (done) => {
        jest.setTimeout(10000);
        const fetchedContract = await Tezos.contract.at("KT1U3y2a2ZdkbayEAjGX4qNkVSCvcZPgbCW9");
        const fetchedMetadata = await f.fetchMetadata(fetchedContract, "https://api.tez.ie/rpc/delphinet/chains/main/blocks/1/context/constants");
        // expect(fetchedMetadata).toBeInstanceOf(String);
        done();
    })
    test.todo('something');
})