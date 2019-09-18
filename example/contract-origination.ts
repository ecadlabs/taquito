import { Tezos } from '@tezos-ts/tezos-ts';

const provider = 'https://alphanet-node.tzscan.io';

async function example() {
    Tezos.setProvider({ rpc: provider } as any)
    Tezos.importKey("edsk3xkqabYfWWpcEKTWk75cRQv2bgHA3EHuuHSFH3ejqzKPx69Zh9")

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
        const contract = await op.contract()
        console.log('Storage', await contract.storage())
        console.log("Operation hash:", op.hash, "Included in block level:", op.includedInBlock)
    } catch (ex) {
        console.error(ex)
    }
}

// tslint:disable-next-line: no-floating-promises
example();
