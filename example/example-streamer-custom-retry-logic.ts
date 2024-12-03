import { PollingSubscribeProvider, TezosToolkit } from '@taquito/taquito';
import { delay, retryWhen, tap, scan } from 'rxjs/operators';

async function example() {
  // This example will intentionally fail after two attempts as the RPC URL is invalid.
  const provider = 'https://mainnet.tezos.ecadinfra.com/notValid';
  const tezos = new TezosToolkit(provider);
  tezos.setStreamProvider(tezos.getFactory(PollingSubscribeProvider)({
    shouldObservableSubscriptionRetry: true, observableSubscriptionRetryFunction:
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
      ) as any
  }));

  const bakerAttestationFilter = {
    and: [{ source: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'attestation' }]
  }

  const bakerEndorsementFilter = {
    and: [{ source: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'endorsement' }]
  }

  const bakerDelegation = {
    and: [{ destination: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'delegation' }]
  }

  tezos.stream.subscribeOperation({
    or: [bakerAttestationFilter, bakerEndorsementFilter, bakerDelegation]
  })
}

example();
