import { HttpBackend } from '@taquito/http-utils';
import { importKey, InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
const nodeCrypto = require('crypto');

async function example() {
	const provider = 'https://api.tez.ie/rpc/carthagenet';
	const keyUrl = 'https://api.tez.ie/keys/carthagenet';
	const Tezos = new TezosToolkit(provider);

	const httpClient = new HttpBackend();
	const key = await httpClient.createRequest<string>({
		url: keyUrl,
		method: 'POST',
		headers: { Authorization: 'Bearer taquito-example' },
		json: false
	});
	const signer = new InMemorySigner(key);
	Tezos.setSignerProvider(signer);

	try {
		//create a new implicit account (the receiver)
		const tezos = new TezosToolkit(provider);
		const keyBytes = Buffer.alloc(32);
		nodeCrypto.randomFillSync(keyBytes);
		const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.P2SK]);
		await importKey(tezos, key);

		// We first make a transfer to reveal the sender address
		const op = await Tezos.contract.transfer({ to: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', amount: 0.1 });
        console.log(`Waiting for ${op.hash} to be confirmed...`);
        await op.confirmation(1);

		const address = await Tezos.signer.publicKeyHash();
		const balance = await Tezos.tz.getBalance(address);
		console.log(
			`The account we want to drain is ${address}.\nIts initial balance is ${balance.toNumber() / 1000000} ꜩ.`
		);
		const estimate = await Tezos.estimate.transfer({
			to: await tezos.signer.publicKeyHash(),
            amount: balance.toNumber() - 257000,
            mutez: true
		});
        const totalFees = estimate.suggestedFeeMutez + estimate.burnFeeMutez;
		 const maxAmount = balance.minus(totalFees).toNumber();
            console.log(
                `The estimated fees related to the emptying operation are ${totalFees} mutez.\n
                Considering the fees, the amount we need to send to empty the account is ${maxAmount / 1000000} ꜩ.`
            );
            const opTransfer = await Tezos.contract.transfer({
                to: await tezos.signer.publicKeyHash(),
                mutez: true,
                amount: maxAmount,
                fee: estimate.suggestedFeeMutez,
                gasLimit: estimate.gasLimit,
                storageLimit: estimate.storageLimit
            });
            console.log(`Waiting for confirmation of the draining operation...`);
            await opTransfer.confirmation(1);
            console.log(`The account has been emptied.`);
            const finalBalance = await Tezos.tz.getBalance(address);
            console.log(`The balance is now ${finalBalance.toNumber() / 1000000} ꜩ.`); 
	} catch (ex) {
		console.error(ex);
	}
}

// tslint:disable-next-line: no-floating-promises
example();
