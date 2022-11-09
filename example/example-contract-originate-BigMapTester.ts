import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { contractBigMapTester } from './data/bigmaptest';
import { contractBigMapCreateRemove } from './data/bigmaptestcreateremove';

import { importKey } from '@taquito/signer';

const provider = 'https://ghostnet.ecadinfra.com'

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
     console.log('Deploying BigMapTester contract...');
    
     const op = await tezos.contract.originate({
       code: contractBigMapTester,
       storage: {
         compound_keys: new MichelsonMap(),
         compound_keys_compound_values: new MichelsonMap(),
         compound_values: new MichelsonMap(),
         simple_values: new MichelsonMap()
     }
     });   


     console.log('Awaiting confirmation...');
     const contract = await op.contract();
     console.log('Ligo simple Contract address',contract.address)
     console.log('Storage', await contract.storage());
     console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);
   } catch (ex) {
     console.error(ex);
   }

  try {
    console.log('Deploying BigMapCreateRemove contract...');  

    const op = await tezos.contract.originate({
      code: contractBigMapCreateRemove,
      storage: new MichelsonMap() 
    })
     
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
