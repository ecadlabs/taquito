import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

const provider = 'http://ecad-ithacanet-archive.i.tez.ie:8732/'

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
    console.log('Deploying SmartContract for tests...');
    const op = await tezos.contract.originate({
     // balance: '0',
      code: `{ parameter (or (int %decrement) (int %increment)) ;
        storage int ;
        code { DUP ;
               CDR ;
               DIP { DUP } ;
               SWAP ;
               CAR ;
               IF_LEFT
                 { DIP { DUP } ;
                   SWAP ;
                   DIP { DUP } ;
                   PAIR ;
                   DUP ;
                   CAR ;
                   DIP { DUP ; CDR } ;
                   SUB ;
                   DIP { DROP 2 } }
                 { DIP { DUP } ;
                   SWAP ;
                   DIP { DUP } ;
                   PAIR ;
                   DUP ;
                   CAR ;
                   DIP { DUP ; CDR } ;
                   ADD ;
                   DIP { DROP 2 } } ;
               NIL operation ;
               PAIR ;
               DIP { DROP 2 } } }
            `,
      init: `0`,
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log("SmartContract address is : "+contract.address);
    console.log('Gas Used', op.consumedGas);
    console.log('Storage Paid', op.storageDiff);
    console.log('Storage Size', op.storageSize);
    console.log('Storage', await contract.storage());
    console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);
  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
