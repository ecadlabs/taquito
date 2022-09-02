import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { tokenCode } from '../integration-tests/data/tokens';

const provider = 'https://kathmandunet.ecadinfra.com/'

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
    console.log('Deploying MapValuesMultipleBigMaps contract...');
    
    const signer = await tezos.signer.publicKeyHash();

            const bigMapInit = new MichelsonMap();
            bigMapInit.set(signer, { 0: '1', 1: new MichelsonMap() });
            bigMapInit.set('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1', { 0: '2', 1: new MichelsonMap() });
            bigMapInit.set('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD', { 0: '3', 1: new MichelsonMap() });
            bigMapInit.set('tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2', { 0: '4', 1: new MichelsonMap() });
            // Deploy a contract with a big map
            const op = await tezos.contract.originate({
                code: tokenCode,
                storage: {
                    0: bigMapInit,
                    1: signer,
                    2: true,
                    3: '3'
                }
            });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('MapValuesMultipleBigMaps Contract address',contract.address)
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
