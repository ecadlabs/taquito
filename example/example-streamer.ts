import { PollingSubscribeProvider, TezosToolkit } from '@taquito/taquito';

async function example() {
  const provider = 'https://ghostnet.tezos.ecadinfra.com/';
  const tezos = new TezosToolkit(provider)
  tezos.setStreamProvider(tezos.getFactory(PollingSubscribeProvider)({ shouldObservableSubscriptionRetry: true, pollingIntervalMilliseconds: 15000 }));
  try {

    const bakerAttestationFilter = {
      and: [{ source: 'tz1bQMn5xYFbX6geRxqvuAiTywsCtNywawxH' }, { kind: 'attestation' }]
    }

    const bakerEndorsementFilter = {
      and: [{ source: 'tz1bQMn5xYFbX6geRxqvuAiTywsCtNywawxH' }, { kind: 'endorsement' }]
    }

    const bakerDelegation = {
      and: [{ destination: 'tz1bQMn5xYFbX6geRxqvuAiTywsCtNywawxH' }, { kind: 'delegation' }]
    }

    const sub = tezos.stream.subscribeOperation({
      or: [bakerAttestationFilter, bakerEndorsementFilter, bakerDelegation]
    })

    sub.on('data', console.log)
  }
  catch (ex) {
    console.error(ex)
  }
}

example();
