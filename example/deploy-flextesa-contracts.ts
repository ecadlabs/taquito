import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { knownContract } from './data/knownContract';
import { knownBigMapContract } from './data/knownBigMapContract';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';
import { fa2ForTokenMetadataView } from '../integration-tests/data/fa2-for-token-metadata-view';
import { b58cencode, char2Bytes, Prefix, prefix } from '@taquito/utils';

const { exec } = require("child_process");
const nodeCrypto = require('crypto');
const provider = 'http://macmini:20000';

async function createAddress() {
  const tezos = new TezosToolkit(provider)

  const keyBytes = Buffer.alloc(32);
  nodeCrypto.randomFillSync(keyBytes)

  const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.P2SK]);
  await importKey(tezos, key);

  return tezos;
}

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
    console.log('Deploying the knownContract...');
    const opknownContract = await tezos.contract.originate({
      balance: '0',
      code: knownContract,
      init: {
        prim: 'Pair',
        args: [
          { int: '0' },
          {
            prim: 'Pair',
            args: [
              { int: '1' },
              [{ bytes: '005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' }],
            ],
          },
        ],
      },
    });
    console.log('Awaiting confirmation...');
    const contractknownContract = await opknownContract.contract();
    console.log('The address of the knownContract is: ', contractknownContract.address);

    console.log('Deploying the knownBigMapContract...');
    const allowances = new MichelsonMap();
    const ledger = new MichelsonMap();
    ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '100' });

    const opknownBigMapContract = await tezos.contract.originate({
      code: knownBigMapContract,
      storage: {
        ledger,
        owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        paused: true,
        totalSupply: '100',
      },
    });
    console.log('Awaiting confirmation...');
    const contractknownBigMapContract = await opknownBigMapContract.contract();
    console.log('The address of the knownBigMapContract is: ', contractknownBigMapContract.address);
  
    console.log('Deploying lambda contract...');
    const op = await tezos.contract.originate({
      code: VIEW_LAMBDA.code,
      storage: VIEW_LAMBDA.storage,
    });

    console.log('Awaiting confirmation...');
    const lambdaContract = await op.contract();
    const lambdaContractAddress = lambdaContract.address
    console.log(lambdaContractAddress);

    exec("cd ../integration-tests && sed -i 's/sandbox_known_contract/"+contractknownContract.address+"/g' config.ts", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log("Integration tests sandbox config updated with know contract: "+contractknownContract.address);
    });

    exec("cd ../integration-tests && sed -i 's/sandbox_known_bigmap_contract/"+contractknownBigMapContract.address+"/g' config.ts", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log("Integration tests sandbox config updated with know bigmap contract: "+contractknownBigMapContract.address);
    });

    exec("cd ../integration-tests && sed -i 's/flextesa_default_lambda_address/"+lambdaContractAddress+"/g' lambda-view.spec.ts", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log("Integration test lambda-view.spec.ts file updated with flextesa default lambda address: "+lambdaContractAddress);
    });
    // tslint:disable-next-line: no-floating-promises
    await exampleTzip12();
  } catch (ex) {
    console.error(ex);
  }
}

async function exampleTzip12() {
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
    console.log('Deploying Tzip12BigMapsOffChain contract...');
    
    const LocalTez1 = await createAddress();
			const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
			const LocalTez2 = await createAddress();
			const localTez2Pkh = await LocalTez2.signer.publicKeyHash();

			const ledger = new MichelsonMap();
			ledger.set(
				{
					0: localTez1Pkh,
					1: 0
				},
				'20000'
			);
			ledger.set(
				{
					0: localTez2Pkh,
					1: 1
				},
				'20000'
			);

			const url = 'https://storage.googleapis.com/tzip-16/fa2-views.json';
			const bytesUrl = char2Bytes(url);
			const metadata = new MichelsonMap();
			metadata.set('', bytesUrl);

			const operators = new MichelsonMap();

			const tokens = new MichelsonMap();
			const metadataMap0 = new MichelsonMap();
			metadataMap0.set('', char2Bytes('https://storage.googleapis.com/tzip-16/token-metadata.json'));
			metadataMap0.set('name', char2Bytes('Name from URI is prioritized!'));
			const metadataMap1 = new MichelsonMap();
			metadataMap1.set('name', char2Bytes('AliceToken'));
			metadataMap1.set('symbol', char2Bytes('ALC'));
			metadataMap1.set('decimals', '30');
			metadataMap1.set('extra', char2Bytes('Add more data'));
			const metadataMap2 = new MichelsonMap();
			metadataMap2.set('name', char2Bytes('Invalid token metadata'));
			tokens.set('0', {
				metadata_map: metadataMap0,
				total_supply: '20000'
			});
			tokens.set('1', {
				metadata_map: metadataMap1,
				total_supply: '20000'
			});
			tokens.set('2', {
				metadata_map: metadataMap2,
				total_supply: '20000'
			});


			const op = await tezos.contract.originate({
				code: fa2ForTokenMetadataView,
				storage: {
					administrator: await tezos.signer.publicKeyHash(),
					all_tokens: '2',
					ledger,
					metadata,
					operators,
					paused: false,
					tokens
				}
			});
			await op.confirmation();

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Tzip12BigMapsOffChain Contract address',contract.address)
    console.log('Gas Used', op.consumedGas);
    console.log('Storage Paid', op.storageDiff);
    console.log('Storage Size', op.storageSize);
    console.log('Storage', await contract.storage());
    console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);

    exec("cd ../integration-tests && sed -i 's/sandbox_known_tzip1216_contract/"+contract.address+"/g' config.ts", (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log("Integration tests sandbox config updated with Tzip12BigMapsOffChain contract address: "+contract.address);
    });

  } catch (ex) {
    console.error(ex);
  }
}
example();
