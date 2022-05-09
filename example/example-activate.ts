import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer';
import Faucet from './faucet-interface';

// always use a new faucet to run this file. each faucet only usable once
// update Faucet below if failed to activate
const { activation_code, pkh } = JSON.parse(`{
	"pkh": "tz1X7iXM6Xf6EsRDNgDNscHRdFEi9rNs5JeF",
	"mnemonic": [
		"taxi",
		"close",
		"spice",
		"traffic",
		"rhythm",
		"rifle",
		"addict",
		"duty",
		"garbage",
		"feel",
		"spell",
		"quick",
		"alcohol",
		"cost",
		"cheese"
	],
	"email": "hhifwuvy.oknwpmth@teztnets.xyz",
	"password": "JQQenXuEEy",
	"amount": "20349803199",
	"activation_code": "e64f7566c5d5a9c59afa6e47361d2fd4e4a65a8c"
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
