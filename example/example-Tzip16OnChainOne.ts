import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { contractCode, metadataViewsExample1 } from '../integration-tests/data/metadataViews';
import { char2Bytes } from '@taquito/utils';

const provider = 'https://api.tez.ie/rpc/granadanet';

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
    console.log('Deploying Tzip16OffChainOne contract...');
   
    const metadataBigMAp = new MichelsonMap();
    metadataBigMAp.set("", char2Bytes('tezos-storage:here'));
    metadataBigMAp.set("here", char2Bytes(JSON.stringify(metadataViewsExample1)))

    const op = await tezos.contract.originate({
      code: contractCode,
      storage: {
        0: 7,
        metadata: metadataBigMAp
      }
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Tzip16OffChainOne Contract address',contract.address)
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
