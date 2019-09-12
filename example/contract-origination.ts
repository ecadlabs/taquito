import { Tezos } from '@tezos-ts/tezos-ts';
import { InMemorySigner } from '@tezos-ts/signer';

const provider = 'https://alphanet-node.tzscan.io';

async function example() {
    const signer: any = new InMemorySigner('edsk3xkqabYfWWpcEKTWk75cRQv2bgHA3EHuuHSFH3ejqzKPx69Zh9');
    Tezos.setProvider({ rpc: provider, signer, } as any)

    try {
        // const op = await Tezos.contract.transfer({ to: "tz1R726RSR2L9pYK2ALiqfdVnDZuugkrAh5o", "amount": 2000000 })
        console.log('Deploying Hello world contract...')
        const op = await Tezos.contract.originate({
            balance: "1",
            code: `parameter string;
            storage string;
            code {CAR;
                  PUSH string "Hello ";
                  CONCAT;
                  NIL operation; PAIR};
            `,
            init: `"test"`,
            fee: 30000,
            storageLimit: 2000,
            gasLimit: 90000,
        })
        console.log('Awaiting confirmation...')
        await op.confirmation()
        console.log("Operation hash:", op.hash, "Included in block level:", op.includedInBlock)
    } catch (ex) {
        console.error(ex)
    }
}

// tslint:disable-next-line: no-floating-promises
example();
