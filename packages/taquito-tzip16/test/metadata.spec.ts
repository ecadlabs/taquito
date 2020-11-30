import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet, MichelsonMap } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { FetcherProvider } from "../src/interfaceFetcherProvider";
import { char2Bytes } from "../src/tzip16-utils";

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const f = new FetcherProvider();

const FAUCET_KEY = { "mnemonic": ["unknown", "hub", "eye", "sport", "walk", "oil", "outdoor", "donkey", "poet", "expire", "just", "indicate", "response", "lawsuit", "thank"], "secret": "71c2c58c6b1fadef14fd5ac8f380ee595b804938", "amount": "40032467721", "pkh": "tz1VtHKUzDac9oGUmt2ReLrPj3kh3zyzF6GR", "password": "1knvgG5AQJ", "email": "lrsfvdev.aomudkjy@tezos.example.org" };
importKey(Tezos, FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(' '), FAUCET_KEY.secret);

let testContractAddress: string;
let testURL = "http://echo.jsontest.com/1/2/3/4"

beforeAll(async () => {
    testContractAddress = await originateContract(testURL)
},15000)

describe('FetcherProviderTests', () => {
    it('successfully fetches a contract, for a given address', async (done) => {
        jest.setTimeout(10000);
        let fetchedContract;
        try {
            fetchedContract = await Tezos.contract.at(testContractAddress);
        } catch (error) {
            throw error;
        }

        const fetchedMetadata = await f.fetchMetadata(fetchedContract, "http://echo.jsontest.com/1/2/3/4");
        // expect(fetchedMetadata).toBeInstanceOf(String);
        done();
    })
    test.todo('something');
})


// Originates a contract with a desired uri string at empty key in storage
async function originateContract(_uri: string): Promise<string> {
    try {
        const initialMetadataBigmap = new MichelsonMap();
        initialMetadataBigmap.set("", char2Bytes(_uri));
        const simpleContract = `parameter unit;
      storage (pair nat (big_map %metadata string bytes));
      code { FAILWITH };`;
        const op = await Tezos.contract.originate({
            code: simpleContract, // Taken from TZComet sample
            storage: {
                0: 42,
                metadata: initialMetadataBigmap
            },
        });
        console.log('Attempted origination of contract : ' + op.contractAddress);
        // await op.confirmation(1);
        // console.log('Contract Originated. View details at https://better-call.dev/carthagenet/' + op.contractAddress)
        if (op.contractAddress) {
            return op.contractAddress;
        } else { throw new Error("Unexpected") }
    } catch (err) {
        return (err);
    }
}
