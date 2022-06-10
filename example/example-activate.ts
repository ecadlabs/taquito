import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer';
import Faucet from './faucet-interface';

// always use a new faucet to run this file. each faucet only usable once
// update Faucet below if failed to activate
// Match Provider eco system
// https://teztnets.xyz/ithacanet-faucet
const { activation_code, pkh } = JSON.parse(`{
	"pkh": "tz1MUCsnsGUV6uS5xFiWXsUhJxQjB5bCkP7a",
	"mnemonic": [
		"book",
		"top",
		"system",
		"security",
		"tent",
		"chat",
		"awesome",
		"tape",
		"tackle",
		"glimpse",
		"disagree",
		"riot",
		"bicycle",
		"monitor",
		"forest"
	],
	"email": "hyptbzfd.jcvshscv@teztnets.xyz",
	"password": "iy1z24cHtt",
	"amount": "1317744395",
	"activation_code": "79216f0872d5b5be3390262d295cca3fc7118b24"
}`) as Faucet

async function example() {
    const provider = 'https://ithacanet.ecadinfra.com/'
    const signer: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
    const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider( signer );
    try {
        const op = await tezos.tz.activate(pkh, activation_code)
        console.log('Awaiting confirmation...');
        await op.confirmation();
        console.log(op.hash, op.includedInBlock);
    } catch (ex) {
        console.log(ex)
    }
}

example();
