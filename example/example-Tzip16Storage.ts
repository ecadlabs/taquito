import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { tacoContractTzip16 } from "../integration-tests/data/modified-taco-contract"
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
    console.log('Deploying Tzip16Storage contract...');
   
    const metadataJSON = {
      "name": "test",
      "description": "A metadata test",
      "version": "0.1",
      "license": "MIT",
      "authors": [
        "Taquito <https://tezostaquito.io/>"
      ],
      "homepage": "https://tezostaquito.io/"
    };

  const metadataBigMap = new MichelsonMap();
  metadataBigMap.set("", char2Bytes('tezos-storage:here'));
  metadataBigMap.set("here", char2Bytes(JSON.stringify(metadataJSON)))

  // Ligo Taco shop contract modified to include metadata in storage
  // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

  const tacoShopStorageMap = new MichelsonMap();

  const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
          metadata: metadataBigMap,
          taco_shop_storage: tacoShopStorageMap
      },
  });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Tzip16Storage Contract address',contract.address)
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
