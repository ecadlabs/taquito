import { Tezos } from '@tezos-ts/tezos-ts';
import { InMemorySigner } from '@tezos-ts/signer';

const provider = 'https://alphanet-node.tzscan.io';

async function example() {
    const signer: any = new InMemorySigner('edskS3DtVSbWbPD1yviMGebjYwWJtruMjDcfAZsH9uba22EzKeYhmQkkraFosFETmEMfFNVcDYQ5QbFerj9ozDKroXZ6mb5oxV');
    Tezos.setProvider({ rpc: provider, signer, } as any)

    try {
        console.log('Deploying Hello world contract...')
        const op = await Tezos.contract.originate({
            balance: "0",
            code: `parameter string;
            storage string;
            code {CAR;
                  PUSH string "Hello ";
                  CONCAT;
                  NIL operation; PAIR};
            `,
            init: `""`,
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
