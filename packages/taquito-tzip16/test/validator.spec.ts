import { Validator } from "../src/URIHandlers/validator";

import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet, MichelsonMap } from "@taquito/taquito";

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const v = new Validator();

let testContractTezosStorage: ContractAbstraction<ContractProvider | Wallet>;

beforeAll(async () => {
    // testContractTezosStorage = await Tezos.contract.at("KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg");
})

describe('ValidatorTests', () => {

    it("prevalidates", async (done) => {
        jest.setTimeout(10000);
        testContractTezosStorage = await Tezos.contract.at("KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg");
        await v.prevalidate(testContractTezosStorage);
        done();
    });

})