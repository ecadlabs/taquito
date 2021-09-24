import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { RpcCacheDecorator } from '../packages/taquito-rpc/src/rpc-cache'

const provider = 'https://granadanet.api.tez.ie';

async function example() {
  const tezos = new TezosToolkit(new RpcCacheDecorator(provider));
  await importKey(
    tezos,
    'peqjckge.qkrrajzs@tezos.example.org',
    'y4BX7qS1UE',
    [
      'skate',
      'damp',
      'faculty',
      'morning',
      'bring',
      'ridge',
      'traffic',
      'initial',
      'piece',
      'annual',
      'give',
      'say',
      'wrestle',
      'rare',
      'ability',
    ].join(' '),
    '7d4c8c3796fdbf4869edb5703758f0e5831f5081'
  );

  try {
    const b = await tezos.rpc.getBlockHash();
    console.log(b)
    setTimeout(async () => {
      const b2 = await tezos.rpc.getBlockHash();
      console.log(b2)
    }, 500);
  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
