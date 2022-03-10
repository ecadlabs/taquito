import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { knownContract } from '../example/data/knownContract';
import { knownBigMapContract } from '../example/data/knownBigMapContract';
import { singleSaplingStateContract } from './data/single_sapling_state_contract';
import { fa2ForTokenMetadataView } from './data/fa2-for-token-metadata-view';
import { InMemorySigner } from '@taquito/signer';
import { char2Bytes } from '@taquito/utils';


const provider = 'http://mondaynet.ecadinfra.com:8732';
const signer: any = new InMemorySigner(process.env['MONDAYNET_ORIGINATE_CONTRACTS_PK'] || '');
const tezos = new TezosToolkit(provider);
tezos.setSignerProvider(signer);

async function originateContract() {
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
    const contractknownContract = await opknownContract.contract();
    console.log('The address of the knownContract is: ', contractknownContract.address);
}

async function originateBigMapContract() {
  try {
    const allowances = new MichelsonMap();
    const ledger = new MichelsonMap();
    ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '1' });

    const opknownBigMapContract = await tezos.contract.originate({
      code: knownBigMapContract,
      storage: {
        ledger,
        owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        paused: true,
        totalSupply: '1',
      },
    });
    const contractknownBigMapContract = await opknownBigMapContract.contract();
    console.log('The address of the knownBigMapContract is: ', contractknownBigMapContract.address);
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTZip12BigMapOffChain() {
  try {
    const ledger = new MichelsonMap();
    ledger.set(
      {
        0: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
        1: 0,
      },
      '20000'
    );
    ledger.set(
      {
        0: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
        1: 1,
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
      total_supply: '20000',
    });
    tokens.set('1', {
      metadata_map: metadataMap1,
      total_supply: '20000',
    });
    tokens.set('2', {
      metadata_map: metadataMap2,
      total_supply: '20000',
    });

    const op = await tezos.contract.originate({
      code: fa2ForTokenMetadataView,
      storage: {
        administrator: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
        all_tokens: '2',
        ledger,
        metadata,
        operators,
        paused: false,
        tokens,
      },
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('The address of the Tzip12BigMapOffChainContract is: ' + contract.address);
  } catch (ex) {
    console.error(ex);
  }
}

async function originateSaplingContract() {
  const op = await tezos.contract.originate({
    code: singleSaplingStateContract,
      init: '{}'
  });
  await op.confirmation();
  const contract = await op.contract();
  console.log('The address of the SaplingContract is: ' + contract.address);
}

(async () => {
  await originateContract();
  await originateBigMapContract();
  await originateTZip12BigMapOffChain();
  await originateSaplingContract();
})()

