import { TezosToolkit } from '@taquito/taquito';
import { ligoSample } from '../integration-tests/data/ligo-simple-contract';

import { importKey } from '@taquito/signer';

const provider = 'https://ithacanet.ecadinfra.com/'

async function example() {
  const tezos = new TezosToolkit(provider)
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
    console.log('Deploying Ligo simple contract...');
    
    const op = await tezos.contract.originate({
      balance: '1',
      code: ligoSample,
      init: { int: '0' },
      fee: 30000,
      storageLimit: 2000,
      gasLimit: 90000,
    });
    
    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Ligo simple Contract address',contract.address)
    console.log('Storage', await contract.storage());
    console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);
  } catch (ex) {
    console.error(ex);
  }
}

example();
