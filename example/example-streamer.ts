import { PollingSubscribeProvider, TezosToolkit } from '@taquito/taquito';

async function example() {
  const provider = 'https://ghostnet.tezos.ecadinfra.com/';
  const tezos = new TezosToolkit(provider)
  tezos.setStreamProvider(tezos.getFactory(PollingSubscribeProvider)({ shouldObservableSubscriptionRetry: true, pollingIntervalMilliseconds: 15000 }));
  try {

    const bakerAttestationFilter = {
      and: [{ source: 'tz1bQMn5xYFbX6geRxqvuAiTywsCtNywawxH' }, { kind: 'attestation' }]
    }

    const bakerDelegation = {
      and: [{ destination: 'tz1bQMn5xYFbX6geRxqvuAiTywsCtNywawxH' }, { kind: 'delegation' }]
    }

    const sub = tezos.stream.subscribeOperation({
      or: [bakerAttestationFilter, bakerDelegation]
    })

    sub.on('data', console.log)
  }
  catch (ex) {
    console.error(ex)
  }
}

example();
