import { MichelsonMap, TezosToolkit, importKey } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { b58Encode, stringToBytes, PrefixV2 } from '@taquito/utils';
import { fa2TokenFactory } from '../integration-tests/data/fa2-token-factory';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeCrypto = require('crypto');

const provider = 'https://ghostnet.tezos.ecadinfra.com';

async function createAddress() {
  const tezos = new TezosToolkit(provider)

  const keyBytes = Buffer.alloc(32);
  nodeCrypto.randomFillSync(keyBytes)

  const key = b58Encode(new Uint8Array(keyBytes), PrefixV2.P256SecretKey);
  await importKey(tezos, key);

  return tezos;
}

async function example() {

    const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
    const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Tzip12BigMapsTokenMetadata contract...');

    const LocalTez1 = await createAddress();
			const localTez1Pkh = await LocalTez1.signer.publicKeyHash();
			const LocalTez2 = await createAddress();
			const localTez2Pkh = await LocalTez2.signer.publicKeyHash();

			const ledger = new MichelsonMap();
			ledger.set(
				{
					owner: localTez1Pkh,
					token_id: 1
				},
				'18000000'
			);
			ledger.set(
				{
					owner: localTez2Pkh,
					token_id: 2
				},
				'9990000'
			);

			const url = 'https://storage.googleapis.com/tzip-16/fa2-token-factory.json';
			const bytesUrl = stringToBytes(url);
			const metadata = new MichelsonMap();
			metadata.set('', bytesUrl);

			const operators = new MichelsonMap();

			const token_admins = new MichelsonMap();
			token_admins.set('1', {
				0: localTez1Pkh,
				1: true
			});
			token_admins.set('2', {
				0: localTez2Pkh,
				1: true
			});

			const token_metadata = new MichelsonMap();
			const token1 = new MichelsonMap();
			token1.set('name', stringToBytes('wToken'));
			token1.set('symbol', stringToBytes('wTK'));
			token1.set('decimals', '36');
			const token2 = new MichelsonMap();
			token2.set('name', stringToBytes('AliceToken'));
			token2.set('symbol', stringToBytes('ALC'));
			token2.set('decimals', '30');
			token_metadata.set('1', {
				token_id: '1',
				token_info: token1
			});
			token_metadata.set('2', {
				token_id: '2',
				token_info: token2
			});

			const token_total_supply = new MichelsonMap();
			token_total_supply.set('1', '54000000');
			token_total_supply.set('2', '10000000');

			const op = await tezos.contract.originate({
				code: fa2TokenFactory,
				storage: {
					admin: await tezos.signer.publicKeyHash(),
					exchange_address: 'KT1DGRPQUwLJyCZnM8WKtwDGiKDSMv4hftk4',
					last_token_id: '2',
					ledger,
					metadata,
					operators,
					token_admins,
					token_metadata,
					token_total_supply
				}
			});

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Tzip12BigMapsTokenMetadata Contract address',contract.address)
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
