import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

const provider = 'https://ithacanet.ecadinfra.com/'

async function example() {
  const tezos = new TezosToolkit(provider);
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
    console.log('Deploying Michelson Tutorial contract...');
    const op = await tezos.contract.originate({
      code: `parameter (pair address mutez);
      storage (map address mutez);
      code { DUP ; CAR ; SWAP ; CDR ; SWAP ; DUP ; DUG 2 ; CDR ; DIG 2 ; CAR ; SWAP ; SOME ; SWAP ; UPDATE ; NIL operation ; PAIR }`,
      init: [{
        prim: 'Elt',
        args: [{ string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }, { int: '0' }],
      }],
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Michelson Tutorial Contract address', contract.address);
    console.log('Gas Used', op.consumedGas);
    console.log('Storage Paid', op.storageDiff);
    console.log('Storage Size', op.storageSize);
    console.log('Storage', await contract.storage());
    console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);
  } catch (ex) {
    console.error(ex);
  }
}

example();
