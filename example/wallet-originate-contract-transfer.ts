import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

const provider = 'https://api.tez.ie/rpc/granadanet';

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
    console.log('Deploying Wallet Test contract...');
    const op = await tezos.contract.originate({
      balance: '0',
      code: `parameter unit;
      storage int;
      code { PUSH address "tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr" ;
             CONTRACT unit ;
             IF_NONE { PUSH string "Not a contract" ; FAILWITH } { DUP ; DIP { DROP } } ;
             DUP ;
             AMOUNT ;
             UNIT ;
             TRANSFER_TOKENS ;
             NIL operation ;
             DIG 1 ;
             DUP ;
             DUG 2 ;
             CONS ;
             DIG 3 ;
             DUP ;
             DUG 4 ;
             CDR ;
             DIG 1 ;
             DUP ;
             DUG 2 ;
             PAIR ;
             DIP { DROP 4 } }
            `,
      init: `0`,
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    const contractAddress = (await op.contract()).address;
    console.log('contractAddress', contractAddress);
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