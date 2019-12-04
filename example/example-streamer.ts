import { Tezos } from '@taquito/taquito';


async function example() {
  const provider = 'https://api.tez.ie/rpc/mainnet';
  Tezos.setProvider({ rpc: provider });
  try {

    const bakerEndorsementFilter = {
      and: [{ source: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'endorsement' }]
    }

    const bakerDelegation = {
      and: [{ destination: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'delegation' }]
    }

    const sub = Tezos.stream.subscribeOperation({
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
