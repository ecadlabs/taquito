import { PollingSubscribeProvider, TezosToolkit } from '@taquito/taquito';
import { delay, retryWhen, tap, scan } from 'rxjs/operators';

async function example() {
    // This example will intentionally fail after two attempts as the RPC URL is invalid. 
    const provider = 'https://api.tez.ie/rpc/notValid';
    const tezos = new TezosToolkit(provider);
    tezos.setStreamProvider(tezos.getFactory(PollingSubscribeProvider)({ shouldObservableSubscriptionRetry: true, observableSubscriptionRetryFunction:
        retryWhen(error =>
            error.pipe(
                scan((acc, error) => {
                    if (acc > 2) throw error;
                    console.log("attempt " + acc);
                    return acc + 1;
                }, 1),
                delay(3),
                tap(() => console.log("Retrying ..."))
            )
        ) }));

    const bakerEndorsementFilter = {
        and: [{ source: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'endorsement' }]
    }

    const bakerDelegation = {
        and: [{ destination: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'delegation' }]
    }

    tezos.stream.subscribeOperation({
        or: [bakerEndorsementFilter, bakerDelegation]
    })
}

example();
