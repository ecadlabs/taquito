import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet, Context } from "@taquito/taquito";
import { MetadataProvider } from "../src/metadataProvider";
import { } from "module";

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const provider = new MetadataProvider();
const c = new Context('https://api.tez.ie/rpc/carthagenet');

let testContractAbstraction: ContractAbstraction<ContractProvider | Wallet>;


class ContractAbstractionTest {
    constructor(private abs: ContractAbstraction<Wallet>) { }

    storage() {
        return { metadata: {} };
    }
}

function composeContractAbstractionTest<T extends ContractAbstraction<Wallet>>(abs: T) {
    return Object.assign(abs, {
        constractAbstractionTest(this: ContractAbstraction<Wallet>) {
            return new ContractAbstractionTest(this);
        }
    });
}

beforeAll(async () => {
    testContractAbstraction = await Tezos.contract.at("KT1FeMKGGvdWiA4r5RaucoEUAa8cTEXSSpCX");
})

describe('FetcherProviderTests', () => {
    jest.setTimeout(10000);
    it('fetch metadata on itself', async (done) => {
        expect(await provider.provideMetadata(testContractAbstraction, 'https://storage.googleapis.com/tzip-16/empty-metadata.json', c)).toMatchObject({
            uri: 'https://storage.googleapis.com/tzip-16/empty-metadata.json',
            metadata:
            {
            },
            integrityCheckResult: false,
            sha256Hash: undefined
        })
        done();
    })

    test.todo('Gets UTF-8 data');
    test.todo('fails on an invalid uri');
    test.todo('throws on no data')
    test.todo('throws on invalid json')
    test.todo('check for huge strings');
})