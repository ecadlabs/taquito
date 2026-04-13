import { mkdir, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { MichelsonMap, OriginateParams, TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { stringToBytes } from '@taquito/utils';
import { contractIncrementing } from '../../example/data/contractIncrementing';
import { contractJson } from '../../example/data/contractJson';
import { contractMap8pairs } from '../../example/data/contractMap8pairs';
import { contractMapBigMap } from '../../example/data/contractMapInitialStorage';
import { contractMapPairKey } from '../../example/data/contractMapPairKey';
import { contractOnChainViews } from '../../example/data/contractOnChainViews';
import { contractMapTacoShop } from '../../example/data/contractSingleMapStorage';
import { fa2Contract } from '../../integration-tests/data/fa2_contract';
import { fa2ForTokenMetadataView } from '../../integration-tests/data/fa2-for-token-metadata-view';
import { contractCode, metadataViewsExample1, metadataViewsExample2 } from '../../integration-tests/data/metadataViews';
import { tacoContractTzip16 } from '../../integration-tests/data/modified-taco-contract';
import { tokenCode } from '../../integration-tests/data/tokens';
import { tzip7Contract } from '../../integration-tests/data/tzip_7_contract';

type FixtureMap = Record<string, string>;

const DEFAULT_RPC_URL = process.env.TAQUITO_DOCS_FIXTURE_RPC_URL ?? 'https://shadownet.tezos.ecadinfra.com/';
const DEFAULT_KEYGEN_URL = process.env.TAQUITO_DOCS_FIXTURE_KEYGEN_URL ?? 'https://keygen.ecadinfra.com/v2/shadownet';
const DEFAULT_KEYGEN_TOKEN = process.env.TAQUITO_DOCS_FIXTURE_KEYGEN_TOKEN ?? 'taquito-example';
const DEFAULT_MIN_BALANCE_MUTEZ = Number.parseInt(
  process.env.TAQUITO_DOCS_FIXTURE_MIN_BALANCE_MUTEZ ?? '50000000',
  10
);
const OUTPUT_PATH = resolve(__dirname, '../src/generated/live-code-fixtures.mjs');

const USER_ADDRESSES = Object.freeze({
  testFunder: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  alice: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
  deborah: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY',
  eddy: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
  freda: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
  glen: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
  allowances: 'tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE',
  bigMapLedger: 'tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq',
  integrationTestUser: 'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1',
});

const CONTRACT_CALL_FIB_CODE = `parameter (pair nat address);
storage nat;
code { CAR ;
       UNPAIR ;
       VIEW "fib" nat ;
       { IF_NONE { { UNIT ; FAILWITH } } { NIL operation ; PAIR } } }`;

const WALLET_TRANSFER_CONTRACT_CODE = `parameter unit;
storage int;
code { PUSH address "tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr" ;
       CONTRACT unit ;
       IF_NONE { PUSH string "Not a contract" ; FAILWITH } { DUP ; DIP { DROP } } ;
       DUP ;
       AMOUNT ;
       UNIT ;
       TRANSFER_TOKENS ;
       NIL operation ;
       DIG 1 ;
       DUP ;
       DUG 2 ;
       CONS ;
       DIG 3 ;
       DUP ;
       DUG 4 ;
       CDR ;
       DIG 1 ;
       DUP ;
       DUG 2 ;
       PAIR ;
       DIP { DROP 4 } }`;

const WALLET_ENTRYPOINTS_CONTRACT_CODE = `parameter (or
  (or (or (pair %addName address string) (bool %areYouThere))
      (or (string %changeMessage) (int %decrement)))
  (int %increment));
storage (pair (pair (bool %areyouthere) (int %integer))
        (pair (string %message) (map %names address string)));
code { DUP ;
 CDR ;
 DIG 1 ;
 DUP ;
 DUG 2 ;
 CAR ;
 IF_LEFT
   { DUP ;
     IF_LEFT
       { DUP ;
         IF_LEFT
           { DUP ;
             DIG 4 ;
             DUP ;
             DUG 5 ;
             PAIR ;
             DUP ;
             CAR ;
             DIG 1 ;
             DUP ;
             DUG 2 ;
             CDR ;
             DIG 1 ;
             DUP ;
             DUG 2 ;
             CDR ;
             CDR ;
             DIG 1 ;
             DUP ;
             DUG 2 ;
             CAR ;
             GET ;
             IF_NONE
               { DIG 1 ;
                 DUP ;
                 DUG 2 ;
                 DIG 2 ;
                 DUP ;
                 DUG 3 ;
                 CDR ;
                 CDR ;
                 DIG 2 ;
                 DUP ;
                 DUG 3 ;
                 CDR ;
                 DIG 3 ;
                 DUP ;
                 DUG 4 ;
                 CAR ;
                 SWAP ;
                 SOME ;
                 SWAP ;
                 UPDATE ;
                 DIP { DUP ; CAR ; SWAP ; CDR ; CAR } ;
                 SWAP ;
                 PAIR ;
                 SWAP ;
                 PAIR }
               { DIG 2 ;
                 DUP ;
                 DUG 3 ;
                 DIG 3 ;
                 DUP ;
                 DUG 4 ;
                 CDR ;
                 CDR ;
                 DIG 3 ;
                 DUP ;
                 DUG 4 ;
                 CDR ;
                 SOME ;
                 DIG 4 ;
                 DUP ;
                 DUG 5 ;
                 CAR ;
                 UPDATE ;
                 DIP { DUP ; CAR ; SWAP ; CDR ; CAR } ;
                 SWAP ;
                 PAIR ;
                 SWAP ;
                 PAIR ;
                 DIP { DROP } } ;
             DIP { DROP 4 } }
           { DUP ;
             DIG 4 ;
             DUP ;
             DUG 5 ;
             PAIR ;
             DUP ;
             CAR ;
             DIG 1 ;
             DUP ;
             DUG 2 ;
             CDR ;
             DIP { DUP ; CDR ; SWAP ; CAR ; CDR } ;
             PAIR ;
             PAIR ;
             DIP { DROP 2 } } ;
         DIP { DROP } }
       { DUP ;
         IF_LEFT
           { DUP ;
             DIG 4 ;
             DUP ;
             DUG 5 ;
             PAIR ;
             DUP ;
             CAR ;
             DIG 1 ;
             DUP ;
             DUG 2 ;
             CDR ;
             DIP { DUP ; CAR ; SWAP ; CDR ; CDR } ;
             PAIR ;
             SWAP ;
             PAIR ;
             DIP { DROP 2 } }
           { DUP ;
             DIG 4 ;
             DUP ;
             DUG 5 ;
             PAIR ;
             DUP ;
             CAR ;
             DUP ;
             DIG 2 ;
             DUP ;
             DUG 3 ;
             CDR ;
             DIG 2 ;
             DUP ;
             DUG 3 ;
             CAR ;
             CDR ;
             SUB ;
             DIP { DUP ; CDR ; SWAP ; CAR ; CAR } ;
             SWAP ;
             PAIR ;
             PAIR ;
             DIP { DROP 3 } } ;
         DIP { DROP } } ;
     DIP { DROP } }
   { DUP ;
     DIG 2 ;
     DUP ;
     DUG 3 ;
     PAIR ;
     DUP ;
     CAR ;
     DUP ;
     DIG 2 ;
     DUP ;
     DUG 3 ;
     CDR ;
     DIG 2 ;
     DUP ;
     DUG 3 ;
     CAR ;
     CDR ;
     ADD ;
     DIP { DUP ; CDR ; SWAP ; CAR ; CAR } ;
     SWAP ;
     PAIR ;
     PAIR ;
     DIP { DROP 3 } } ;
 DUP ;
 NIL operation ;
 PAIR ;
 DIP { DROP 3 } }`;

const WALLET_ENTRYPOINTS_INIT = `(Pair (Pair True 0)
  (Pair ""
        { Elt 0x00006b82198cb179e8306c1bedd08f12dc863f328886 "Alice" ;
          Elt 0x0000b2e19a9e74440d86c59f13dab8a18ff873e889ea "HEllo!" }))`;

const fixtureKeyOrder = [
  'quickStartIncrementContract',
  'complexParametersContract',
  'mapsTacoShopContract',
  'mapsPairKeyContract',
  'mapsEightPairKeyContract',
  'mapsMapAndBigMapContract',
  'mapsMultipleBigMapValuesContract',
  'lambdaViewFa12Contract',
  'lambdaViewFa2Contract',
  'onChainViewTopLevelContract',
  'onChainViewCallerContract',
  'tzip12OffChainViewContract',
  'tzip16TezosStorageContract',
  'tzip16HttpsContract',
  'tzip16Sha256Contract',
  'tzip16IpfsContract',
  'tzip16OffChainJsonContract',
  'tzip16OffChainMultiplyContract',
  'walletTransferContract',
  'walletEntrypointsContract',
] as const;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchFreshSecretKey = async () => {
  const response = await fetch(DEFAULT_KEYGEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DEFAULT_KEYGEN_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      key_prefixes: ['tz1'],
      max_selection_attempts: 5,
      min_balance_mutez: DEFAULT_MIN_BALANCE_MUTEZ,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fixture signer key: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as { secret_key?: string };
  if (!payload.secret_key) {
    throw new Error('Fixture signer key response did not include secret_key');
  }

  return payload.secret_key;
};

const getSecretKey = async () =>
  process.env.TAQUITO_DOCS_FIXTURE_SECRET_KEY ||
  process.env.TEZOS_SECRET_KEY ||
  (await fetchFreshSecretKey());

const originate = async (tezos: TezosToolkit, label: string, params: OriginateParams) => {
  console.log(`Originating ${label}...`);
  const op = await tezos.contract.originate(params);
  const contract = await op.contract();
  console.log(`${label}: ${contract.address}`);
  await delay(750);
  return contract.address;
};

const writeFixtureModule = async (fixtures: FixtureMap) => {
  const lines = [
    'export const docsLiveCodeFixtures = Object.freeze({',
    ...fixtureKeyOrder.map((key) => `  ${key}: '${fixtures[key]}',`),
    '});',
    '',
  ];

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, lines.join('\n'));
};

const main = async () => {
  const secretKey = await getSecretKey();
  const tezos = new TezosToolkit(DEFAULT_RPC_URL);
  tezos.setSignerProvider(new InMemorySigner(secretKey));

  const signerPkh = await tezos.signer.publicKeyHash();
  const fixtures: FixtureMap = {};

  console.log(`Using RPC ${DEFAULT_RPC_URL}`);
  console.log(`Using signer ${signerPkh}`);

  fixtures.quickStartIncrementContract = await originate(tezos, 'quickStartIncrementContract', {
    code: contractIncrementing,
    init: '0',
  });

  const dataMap = new MichelsonMap();
  dataMap.set('Hello', { bool: true });

  const recordsBigMap = new MichelsonMap();
  recordsBigMap.set('FFFF', {
    data: dataMap,
    owner: USER_ADDRESSES.glen,
  });
  recordsBigMap.set('AAAA', {
    data: dataMap,
    owner: USER_ADDRESSES.glen,
    validator: '1',
  });

  const validatorsMap = new MichelsonMap();
  validatorsMap.set('1', USER_ADDRESSES.deborah);

  fixtures.complexParametersContract = await originate(tezos, 'complexParametersContract', {
    code: contractJson,
    storage: {
      owner: USER_ADDRESSES.glen,
      records: recordsBigMap,
      validators: validatorsMap,
    },
  });

  const tacoShopStorage = new MichelsonMap();
  tacoShopStorage.set('1', { current_stock: '10000', max_price: '50' });
  tacoShopStorage.set('2', { current_stock: '120', max_price: '20' });
  tacoShopStorage.set('3', { current_stock: '50', max_price: '60' });

  fixtures.mapsTacoShopContract = await originate(tezos, 'mapsTacoShopContract', {
    code: contractMapTacoShop,
    storage: tacoShopStorage,
  });

  const pairKeyStorage = new MichelsonMap();
  pairKeyStorage.set({ 0: '1', 1: USER_ADDRESSES.freda }, { quantity: '10', amount: '100' });
  pairKeyStorage.set({ 0: '2', 1: USER_ADDRESSES.deborah }, { quantity: '20', amount: '200' });
  pairKeyStorage.set({ 0: '3', 1: USER_ADDRESSES.eddy }, { quantity: '30', amount: '300' });

  fixtures.mapsPairKeyContract = await originate(tezos, 'mapsPairKeyContract', {
    code: contractMapPairKey,
    storage: {
      theAddress: USER_ADDRESSES.alice,
      theMap: pairKeyStorage,
      theNumber: 10,
    },
  });

  const complexKeyStorage = new MichelsonMap();
  complexKeyStorage.set(
    {
      0: '1',
      1: '2',
      2: 'test',
      3: 'cafe',
      4: '10',
      5: true,
      6: USER_ADDRESSES.eddy,
      7: '2019-09-06T15:08:29.000Z',
      8: USER_ADDRESSES.eddy,
    },
    100
  );
  complexKeyStorage.set(
    {
      0: '10',
      1: '20',
      2: 'Hello',
      3: 'ffff',
      4: '100',
      5: false,
      6: USER_ADDRESSES.freda,
      7: '2019-10-06T15:08:29.000Z',
      8: USER_ADDRESSES.freda,
    },
    1000
  );

  fixtures.mapsEightPairKeyContract = await originate(tezos, 'mapsEightPairKeyContract', {
    code: contractMap8pairs,
    storage: complexKeyStorage,
  });

  const mapStorage = new MichelsonMap();
  mapStorage.set({ 0: '1', 1: USER_ADDRESSES.freda }, 10);
  mapStorage.set({ 0: '2', 1: USER_ADDRESSES.freda }, 20);

  const bigMapStorage = new MichelsonMap();
  bigMapStorage.set({ 0: '10', 1: USER_ADDRESSES.eddy }, 100);
  bigMapStorage.set({ 0: '20', 1: USER_ADDRESSES.eddy }, 200);

  fixtures.mapsMapAndBigMapContract = await originate(tezos, 'mapsMapAndBigMapContract', {
    code: contractMapBigMap,
    storage: {
      thebigmap: bigMapStorage,
      themap: mapStorage,
    },
  });

  const multipleValuesBigMap = new MichelsonMap();
  multipleValuesBigMap.set(signerPkh, { 0: '1', 1: new MichelsonMap() });
  multipleValuesBigMap.set(USER_ADDRESSES.eddy, { 0: '2', 1: new MichelsonMap() });
  multipleValuesBigMap.set(USER_ADDRESSES.glen, { 0: '3', 1: new MichelsonMap() });
  multipleValuesBigMap.set(USER_ADDRESSES.freda, { 0: '4', 1: new MichelsonMap() });

  fixtures.mapsMultipleBigMapValuesContract = await originate(tezos, 'mapsMultipleBigMapValuesContract', {
    code: tokenCode,
    storage: {
      0: multipleValuesBigMap,
      1: signerPkh,
      2: true,
      3: '3',
    },
  });

  const lambdaAllowances1 = new MichelsonMap();
  lambdaAllowances1.set(USER_ADDRESSES.deborah, '25');
  lambdaAllowances1.set(USER_ADDRESSES.allowances, '25');

  const lambdaAllowances2 = new MichelsonMap();
  lambdaAllowances2.set(USER_ADDRESSES.eddy, '25');
  lambdaAllowances2.set(USER_ADDRESSES.freda, '25');

  const lambdaFa12Ledger = new MichelsonMap();
  lambdaFa12Ledger.set(USER_ADDRESSES.glen, {
    balance: '50',
    allowances: lambdaAllowances1,
  });
  lambdaFa12Ledger.set(USER_ADDRESSES.bigMapLedger, {
    balance: '50',
    allowances: lambdaAllowances2,
  });

  fixtures.lambdaViewFa12Contract = await originate(tezos, 'lambdaViewFa12Contract', {
    balance: '1',
    code: tzip7Contract,
    storage: {
      owner: signerPkh,
      totalSupply: '100',
      ledger: lambdaFa12Ledger,
    },
  });

  const lambdaFa2Ledger = new MichelsonMap();
  lambdaFa2Ledger.set(USER_ADDRESSES.integrationTestUser, {
    allowances: [USER_ADDRESSES.deborah],
    balance: '50',
  });
  lambdaFa2Ledger.set(USER_ADDRESSES.bigMapLedger, {
    allowances: [USER_ADDRESSES.allowances],
    balance: '50',
  });

  const lambdaFa2TokenMetadata = new MichelsonMap();
  lambdaFa2TokenMetadata.set('0', {
    token_id: '0',
    symbol: 'hello',
    name: 'test',
    decimals: '0',
    extras: new MichelsonMap(),
  });
  lambdaFa2TokenMetadata.set('1', {
    token_id: '1',
    symbol: 'world',
    name: 'test2',
    decimals: '0',
    extras: new MichelsonMap(),
  });

  fixtures.lambdaViewFa2Contract = await originate(tezos, 'lambdaViewFa2Contract', {
    balance: '1',
    code: fa2Contract,
    storage: {
      ledger: lambdaFa2Ledger,
      token_metadata: lambdaFa2TokenMetadata,
      total_supply: '100',
    },
  });

  fixtures.onChainViewTopLevelContract = await originate(tezos, 'onChainViewTopLevelContract', {
    code: contractOnChainViews,
    storage: 1,
  });

  fixtures.onChainViewCallerContract = await originate(tezos, 'onChainViewCallerContract', {
    code: CONTRACT_CALL_FIB_CODE,
    storage: 1,
  });

  const tzip12Ledger = new MichelsonMap();
  tzip12Ledger.set({ 0: USER_ADDRESSES.eddy, 1: 0 }, '20000');
  tzip12Ledger.set({ 0: USER_ADDRESSES.glen, 1: 1 }, '20000');

  const tzip12Metadata = new MichelsonMap();
  tzip12Metadata.set('', stringToBytes('https://storage.googleapis.com/tzip-16/fa2-views.json'));

  const tzip12Tokens = new MichelsonMap();
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

  tzip12Tokens.set('0', {
    metadata_map: metadataMap0,
    total_supply: '20000',
  });
  tzip12Tokens.set('1', {
    metadata_map: metadataMap1,
    total_supply: '20000',
  });
  tzip12Tokens.set('2', {
    metadata_map: metadataMap2,
    total_supply: '20000',
  });

  fixtures.tzip12OffChainViewContract = await originate(tezos, 'tzip12OffChainViewContract', {
    code: fa2ForTokenMetadataView,
    storage: {
      administrator: USER_ADDRESSES.testFunder,
      all_tokens: '2',
      ledger: tzip12Ledger,
      metadata: tzip12Metadata,
      operators: new MichelsonMap(),
      paused: false,
      tokens: tzip12Tokens,
    },
  });

  const tzip16StorageMetadata = new MichelsonMap();
  tzip16StorageMetadata.set('', stringToBytes('tezos-storage:here'));
  tzip16StorageMetadata.set(
    'here',
    stringToBytes(
      JSON.stringify({
        name: 'test',
        description: 'A metadata test',
        version: '0.1',
        license: 'MIT',
        authors: ['Taquito <https://taquito.io/>'],
        homepage: 'https://taquito.io/',
      })
    )
  );

  fixtures.tzip16TezosStorageContract = await originate(tezos, 'tzip16TezosStorageContract', {
    code: tacoContractTzip16,
    storage: {
      metadata: tzip16StorageMetadata,
      taco_shop_storage: new MichelsonMap(),
    },
  });

  const httpsMetadata = new MichelsonMap();
  httpsMetadata.set('', stringToBytes('https://storage.googleapis.com/tzip-16/taco-shop-metadata.json'));
  const httpsStorage = new MichelsonMap();
  httpsStorage.set('1', { current_stock: '10000', max_price: '50' });

  fixtures.tzip16HttpsContract = await originate(tezos, 'tzip16HttpsContract', {
    code: tacoContractTzip16,
    storage: {
      metadata: httpsMetadata,
      taco_shop_storage: httpsStorage,
    },
  });

  const sha256Metadata = new MichelsonMap();
  const sha256Url = `sha256://0x7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b/https:${encodeURIComponent(
    '//storage.googleapis.com/tzip-16/taco-shop-metadata.json'
  )}`;
  sha256Metadata.set('', stringToBytes(sha256Url));

  fixtures.tzip16Sha256Contract = await originate(tezos, 'tzip16Sha256Contract', {
    code: tacoContractTzip16,
    storage: {
      metadata: sha256Metadata,
      taco_shop_storage: httpsStorage,
    },
  });

  const ipfsMetadata = new MichelsonMap();
  ipfsMetadata.set('', stringToBytes('ipfs://QmXnASUptTDnfhmcoznFqz3S1Mxu7X1zqo2YwbTN3nW52V'));

  fixtures.tzip16IpfsContract = await originate(tezos, 'tzip16IpfsContract', {
    code: tacoContractTzip16,
    storage: {
      metadata: ipfsMetadata,
      taco_shop_storage: new MichelsonMap(),
    },
  });

  const offChainJsonMetadata = new MichelsonMap();
  offChainJsonMetadata.set('', stringToBytes('tezos-storage:here'));
  offChainJsonMetadata.set('here', stringToBytes(JSON.stringify(metadataViewsExample1)));

  fixtures.tzip16OffChainJsonContract = await originate(tezos, 'tzip16OffChainJsonContract', {
    code: contractCode,
    storage: {
      0: 7,
      metadata: offChainJsonMetadata,
    },
  });

  const offChainMultiplyMetadata = new MichelsonMap();
  offChainMultiplyMetadata.set('', stringToBytes('tezos-storage:here'));
  offChainMultiplyMetadata.set('here', stringToBytes(JSON.stringify(metadataViewsExample2)));

  fixtures.tzip16OffChainMultiplyContract = await originate(tezos, 'tzip16OffChainMultiplyContract', {
    code: contractCode,
    storage: {
      0: 7,
      metadata: offChainMultiplyMetadata,
    },
  });

  fixtures.walletTransferContract = await originate(tezos, 'walletTransferContract', {
    balance: '0',
    code: WALLET_TRANSFER_CONTRACT_CODE,
    init: '0',
  });

  fixtures.walletEntrypointsContract = await originate(tezos, 'walletEntrypointsContract', {
    code: WALLET_ENTRYPOINTS_CONTRACT_CODE,
    init: WALLET_ENTRYPOINTS_INIT,
  });

  await writeFixtureModule(fixtures);
  console.log(`Wrote fixture catalogue to ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
