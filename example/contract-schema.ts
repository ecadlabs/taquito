import { Tezos } from '@tezos-ts/tezos-ts';
import { InMemorySigner } from '@tezos-ts/signer';


async function example() {
    const provider = 'https://alphanet-node.tzscan.io';
    const signer: any = new InMemorySigner('edsk3xkqabYfWWpcEKTWk75cRQv2bgHA3EHuuHSFH3ejqzKPx69Zh9');
    Tezos.setProvider({ rpc: provider, signer });
    try {
        const contract = await Tezos.contract.at('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN');
        console.log("Printing contract methods...");
        console.log(contract.methods);
        console.log("Showing initial storage...");
        console.log(await contract.storage())
        const op = await contract.methods.mint("tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn", 100).send({ fee: 30000, gasLimit: 200000 })
        console.log('Awaiting confirmation...');
        await op.confirmation();
        console.log(op.hash, op.includedInBlock);
        console.log("Showing final storage...");
        console.log(await contract.storage())
    } catch (ex) {
        console.log(ex)
    }
}

// tslint:disable-next-line: no-floating-promises
example();
