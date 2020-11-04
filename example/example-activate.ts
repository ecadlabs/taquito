import { TezosToolkit } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer';

async function example() {
    const provider = 'https://api.tez.ie/rpc/carthagenet';
    const signer: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
    const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider( signer );
    try {
        const op = await tezos.tz.activate("tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu", "161d907951bf5594bedb1d70bb03c938d63c22be")
        console.log('Awaiting confirmation...');
        await op.confirmation();
        console.log(op.hash, op.includedInBlock);
    } catch (ex) {
        console.log(ex)
    }
}

// tslint:disable-next-line: no-floating-promises
example();
