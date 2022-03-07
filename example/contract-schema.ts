import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';


async function example() {
    const provider = 'https://ithacanet.ecadinfra.com/';
    const signer: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
        const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider( signer );
    try {
        console.log("signer pkh:");
        console.log(await signer.publicKeyHash());
        const contract = await tezos.contract.at('KT1ERpZEpgtXni64q87VQd6MxgSMrt6Ek65o');
        console.log("Printing contract methods...");
        console.log(contract.methods);
        console.log("Showing initial storage...");
        console.log(await contract.storage())
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
