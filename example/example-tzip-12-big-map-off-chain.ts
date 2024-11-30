import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey, InMemorySigner } from '@taquito/signer';
import { fa2ForTokenMetadataView } from '../integration-tests/data/fa2-for-token-metadata-view';
import { b58cencode, stringToBytes, Prefix, prefix } from '@taquito/utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeCrypto = require('crypto');

const provider = 'https://ghostnet.tezos.ecadinfra.com';

async function createAddress() {
  const tezos = new TezosToolkit(provider)

  const keyBytes = Buffer.alloc(32);
  nodeCrypto.randomFillSync(keyBytes)

  const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.P2SK]);
  await importKey(tezos, key);

  return tezos;
}

async function example() {
  const tezos = new TezosToolkit(provider)
  const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
  tezos.setSignerProvider(signer);
  
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
			const bytesUrl = stringToBytes(url);
			const metadata = new MichelsonMap();
			metadata.set('', bytesUrl);

			const operators = new MichelsonMap();

			const tokens = new MichelsonMap();
			const metadataMap0 = new MichelsonMap();
			metadataMap0.set('', stringToBytes('https://storage.googleapis.com/tzip-16/token-metadata.json'));
			metadataMap0.set('name', stringToBytes('Name from URI is prioritized!'));
			const metadataMap1 = new MichelsonMap();
			metadataMap1.set('name', stringToBytes('AliceToken'));
			metadataMap1.set('symbol', stringToBytes('ALC'));
			metadataMap1.set('decimals', '30');
			metadataMap1.set('extra', stringToBytes('Add more data'));
			const metadataMap2 = new MichelsonMap();
			metadataMap2.set('name', stringToBytes('Invalid token metadata'));
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
  } catch (ex) {
    console.error(ex);
  }
}

example();
