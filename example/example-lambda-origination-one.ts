import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { tzip7Contract } from '../integration-tests/data/tzip_7_contract';

const provider = 'http://ecad-ithacanet-archive.i.tez.ie:8732/'

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
    console.log('Deploying LambdaOne contract...');
    
    const mapAccount1 = new MichelsonMap();
    mapAccount1.set('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', '25');
    mapAccount1.set('tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE', '25');
  
    const mapAccount2 = new MichelsonMap();
    mapAccount2.set('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM', '25');
    mapAccount2.set('tz1bmyy6QX9HVf7EnBJ6avmWZJbPYGAgXhbH', '25');
  
    const bigMapLedger = new MichelsonMap();
    bigMapLedger.set('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1', {
      balance: '50',
      allowances: mapAccount1
    });
    bigMapLedger.set('tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq', {
      balance: '50',
      allowances: mapAccount2
    });

    const the_owner = await tezos.signer.publicKeyHash()
    
    const op = await tezos.contract.originate({
      balance: "1",
      code: tzip7Contract,
      storage: {
        owner: the_owner,
        totalSupply: '100',
        ledger: bigMapLedger
      },
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('LambdaOne Contract address',contract.address)
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
