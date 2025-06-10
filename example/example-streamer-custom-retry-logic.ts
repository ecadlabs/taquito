import { PollingSubscribeProvider, TezosToolkit } from '@taquito/taquito';
import { retry } from 'rxjs/operators';
import { timer } from 'rxjs';

async function example() {
  // This example will intentionally fail after two attempts as the RPC URL is invalid.
  const provider = 'https://mainnet.tezos.ecadinfra.com/notValid';
  const tezos = new TezosToolkit(provider);
  tezos.setStreamProvider(tezos.getFactory(PollingSubscribeProvider)({
    shouldObservableSubscriptionRetry: true, observableSubscriptionRetryFunction:
    retry({
      count: 2,
      delay: (error, retryCount) => {
        console.log("attempt " + retryCount);
        console.log("Retrying ...");
        return timer(3);
      }
    })
  }));

  const bakerAttestationFilter = {
    and: [{ source: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'attestation' }]
  }
  const bakerDelegation = {
    and: [{ destination: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'delegation' }]
  }
  tezos.stream.subscribeOperation({
    or: [bakerAttestationFilter, bakerDelegation]
  })
}
example();