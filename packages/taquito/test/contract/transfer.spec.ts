import { importKey } from "@taquito/signer";
import { TezosToolkit } from "../../src/taquito";

describe('Tranfer tests', () => {
    let mockRpcClient: any;
    let toolkit: TezosToolkit;

    beforeEach(() => {

        toolkit = new TezosToolkit();
        toolkit.setProvider({ rpc: 'https://api.tez.ie/rpc/carthagenet' });

        const FAUCET_KEY = { "mnemonic": ["unknown", "hub", "eye", "sport", "walk", "oil", "outdoor", "donkey", "poet", "expire", "just", "indicate", "response", "lawsuit", "thank"], "secret": "71c2c58c6b1fadef14fd5ac8f380ee595b804938", "amount": "40032467721", "pkh": "tz1VtHKUzDac9oGUmt2ReLrPj3kh3zyzF6GR", "password": "1knvgG5AQJ", "email": "lrsfvdev.aomudkjy@tezos.example.org" };
        importKey(toolkit, FAUCET_KEY.email, FAUCET_KEY.password, FAUCET_KEY.mnemonic.join(' '), FAUCET_KEY.secret);
    });

    it('Verify transfer estimate', async done => {
        jest.setTimeout(60000 * 10);
        const estimate = await toolkit.transfer({ to: 'tz1VtHKUzDac9oGUmt2ReLrPj3kh3zyzF6GR', amount: 2.1 })._estimate();
        expect(estimate).toMatchObject({
            _gasLimit: 10207,
            _storageLimit: 0,
            opSize: 92,
            baseFeeMutez: 100
        });
        done();
    });
});