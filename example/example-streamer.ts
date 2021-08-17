import { TezosToolkit } from '@taquito/taquito';

async function example() {
  const provider = 'https://api.tez.ie/rpc/mainnet';
  const tezos = new TezosToolkit(provider)
  tezos.setProvider({ config: { shouldObservableSubscriptionRetry: true, streamerPollingIntervalMilliseconds: 15000 } });
  try {

    const bakerEndorsementFilter = {
      and: [{ source: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'endorsement' }]
    }

    const bakerDelegation = {
      and: [{ destination: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'delegation' }]
    }

    const sub = tezos.stream.subscribeOperation({
      or: [bakerEndorsementFilter, bakerDelegation]
    })

    sub.on('data', console.log)
  }
  catch (ex) {
    console.error(ex)
  }
}

// tslint:disable-next-line: no-floating-promises
example();
