import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner, importKey } from '@taquito/signer';
import Faucet from './faucet-interface';
import BigNumber from 'bignumber.js';

const {email, password, mnemonic, activation_code} = require("./faucet-default-values.json") as Faucet


async function example() {
    const provider = 'https://jakartanet.ecadinfra.com/';
    const signer: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
    const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider( signer );

    // additional lender if sender is broke
    const tezosLender = new TezosToolkit(provider);
    await importKey(
        tezosLender,
        email,
        password,
        mnemonic.join(' '),
        activation_code
      );
    try {
        console.log("signer pkh:");
        console.log(await signer.publicKeyHash());
        const contract = await tezos.contract.at('KT1AhKTHfwKvEQeJ13X9M1TSF6pGJnZZCCau');
        console.log("Printing contract methods...");
        console.log(contract.methods);
        console.log("Showing initial storage...");
        console.log(await contract.storage());
        console.log("checking balance")
        const balance = await tezos.tz.getBalance(await signer.publicKeyHash());
        const balanceMin = new BigNumber(100);
        if (balance < balanceMin) {
            console.log("topping up funds")
            console.log("Balance before", balance)
            const sendMutez = await tezosLender.contract.transfer({ to: await signer.publicKeyHash(), amount: 100 });
            await sendMutez.confirmation();
            const newBalance = await tezos.tz.getBalance(await signer.publicKeyHash());
            console.log("Balance after", newBalance)
        }
        console.log("Sending")
        const op = await contract.methods.mint("tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys", 100).send()
        console.log('Awaiting confirmation...');
        await op.confirmation();
        console.log(op.hash, op.includedInBlock);
        console.log("Showing final storage...");
        console.log(await contract.storage())
    } catch (ex) {
        console.log(ex)
    }
}

example();
