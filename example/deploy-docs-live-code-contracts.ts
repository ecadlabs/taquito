/// How to use:
///   Ensure the Testfunder account tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys has at least 2k tokens
///   for the testnet in use. The script will first check if addresses used in the script are funded,
///   and top them up if needed. The script will then originate each contract needed for Live Code
///   examples in Taquito Docs and produce a JSON file with each Contract Identifier and its PKH.
///   Use the testpad script Docs Live Code Contract Origination (in https://ecadlabs.ontestpad.com/project/18/)
///   with the desired chain (e.g. hangzhou) to match the originated scripts with their locations in the Docs.
///   The script will also print to console a json file of contracts to use in the code examples in taquito/examples
///   Execute this script with
///     node -r ts-node/register deploy-docs-live-code-contracts.ts

import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { tzip7Contract } from '../integration-tests/data/tzip_7_contract';
import { contractMapPairKey } from './data/contractMapPairKey';
import { contractIncrementing } from './data/contractIncrementing';
import { contractMapBigMap } from './data/contractMapInitialStorage';
import { contractMapTacoShop } from './data/contractSingleMapStorage';
import { contractJson } from './data/contractJson';
import { contractOnChainViews } from './data/contractOnChainViews';
import { tokenCode, tokenInit } from '../integration-tests/data/tokens';
import { fa2ForTokenMetadataView } from '../integration-tests/data/fa2-for-token-metadata-view';
import { tacoContractTzip16 } from '../integration-tests/data/modified-taco-contract';
import {
  contractCode,
  metadataViewsExample1,
  metadataViewsExample2,
} from '../integration-tests/data/metadataViews';
import { contractMap8pairs } from './data/contractMap8pairs';
import { char2Bytes } from '@taquito/utils';

const provider = 'https://ithacanet.ecadinfra.com/';
export const signer: any = new InMemorySigner(
  'edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca'
);
export const tezos = new TezosToolkit(provider);

const contract_catalogue = new Map();

const users: Array<string> = [
  //live code examples
  'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
  'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
  'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY',
  'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
  'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
  'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
  'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx',
  'tz1NhNv9g7rtcjyNsH8Zqu79giY5aTqDDrzB',
  'tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE',
  'tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq',
];

const user_addresses = new Map();
user_addresses.set('TestFunder', users[0]);
user_addresses.set('Alice', users[1]);
user_addresses.set('Deborah', users[2]);
user_addresses.set('Eddy', users[3]);
user_addresses.set('Freda', users[4]);
user_addresses.set('Glen', users[5]);
user_addresses.set('Validation', users[6]);
user_addresses.set('WalletReceiver', users[7]);
user_addresses.set('Allowances', users[8]);
user_addresses.set('BigMapLedger', users[9]);
user_addresses.set('IntegrationTestUser', users[10]);

const low_balance: Array<string> = [];

const min_balance = 100000000;

async function checkBalances(users: string | any[]) {
  console.log('checking funds...');
  try {
    for (var i = 0; i < users.length; i++) {
      const user_balance: any = await tezos.tz.getBalance(users[i]);
      if (user_balance < min_balance) {
        low_balance.push(users[i]);
      }
      console.log(users[i], user_balance);
    }
  } catch (ex) {
    console.error(ex);
  }

  console.log(`Low balance addresses : ` + low_balance);
  tezos.setSignerProvider(signer);
  try {
    for (var i = 0; i < low_balance.length; i++) {
      console.log('Funding low balance address :' + low_balance[i]);
      const fundAccountFirst = await tezos.contract.transfer({
        to: low_balance[i],
        amount: min_balance / 1000000,
      });
      await fundAccountFirst.confirmation();
    }
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTheContracts() {
  await checkBalances(users);

  console.log('originating...');
  contract_catalogue.set('IncrementContract', await originateIncrementContract());
  contract_catalogue.set('MichelsonMapContract', await originateMichelsonMap());
  contract_catalogue.set('LambdaViewContract', await originateLambda1());
  contract_catalogue.set('LambdaViewWithTokenContract', await originateLambda2());
  contract_catalogue.set(
    'MapWithWithSingleMapForStorage',
    await originateMapWithSingleMapForStorage()
  );
  contract_catalogue.set('MapWithPairasMapContract', await originateMapWithPairasMapKeys());
  contract_catalogue.set('MapWithComplexKeysContract', await originateMapWithComplexKeys());
  contract_catalogue.set(
    'MapWithInitialStorageContract',
    await originateInitialStorageWithMapAndBigMap()
  );
  contract_catalogue.set('BigMapsMultipleValuesContract', await originateMapValueMultipleBigMaps());
  contract_catalogue.set(
    'BigMapsComplexStorageContract',
    await originateSmartContractComplexStorage()
  );
  contract_catalogue.set('ContractCallFib', await originateContractCallFib());
  contract_catalogue.set('ContractTopLevelViews', await originateContractTopLevelViews());
  contract_catalogue.set('TokenContract', await originateTokenContract());
  contract_catalogue.set('Tzip12BigMapOffChainContract', await originateTZip12BigMapOffChain());
  contract_catalogue.set('Tzip16StorageContract', await originateTzip16Storage());
  contract_catalogue.set('Tzip16HTTPSContract', await originateTzip16Https());
  contract_catalogue.set('Tzip16SHA256Contract', await originateTzip16SHA256());
  contract_catalogue.set('Tzip16IPFSContract', await originateTzip16IPFS());
  contract_catalogue.set('Tzip16OffChainContractJSON', await originateTzip16OnChainJSON());
  contract_catalogue.set('Tzip16OffChainContractMultiply', await originateTzip16OnChainMultiply());
  contract_catalogue.set('WalletContract', await originateWalletOriginateContractTransfer());
  contract_catalogue.set('WalletAreYouThereContract', await originateWalletOriginateAreYouThere());
  contract_catalogue.set('BigMapPackContract', await originateBigMapPackContract());

  json_contract_catalogue();

  function json_contract_catalogue() {
    console.log(' ');
    console.log('The Contract Catalogue :');
    let jsonObject: any = {};
    contract_catalogue.forEach((value, key) => {
      jsonObject[key] = value;
    });
    console.log(JSON.stringify(jsonObject));
  }
}

async function originateIncrementContract() {
  tezos.setSignerProvider(signer);
  try {
    const op = await tezos.contract.originate({
      code: contractIncrementing,
      init: `0`,
    });
    const increment_contract = await op.contract();
    console.log('IncrementContract : ' + increment_contract.address);
    return increment_contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateLambda1() {
  tezos.setSignerProvider(signer);
  try {
    const mapAccount1 = new MichelsonMap();
    mapAccount1.set(user_addresses.get('Deborah'), '25');
    mapAccount1.set(user_addresses.get('Allowances'), '25');

    const mapAccount2 = new MichelsonMap();
    mapAccount2.set(user_addresses.get('Eddy'), '25');
    mapAccount2.set(user_addresses.get('Freda'), '25');

    const bigMapLedger = new MichelsonMap();
    bigMapLedger.set(user_addresses.get('Glen'), {
      balance: '50',
      allowances: mapAccount1,
    });
    bigMapLedger.set(user_addresses.get('BigMapLedger'), {
      balance: '50',
      allowances: mapAccount2,
    });

    const op = await tezos.contract.originate({
      balance: '1',
      code: tzip7Contract,
      storage: {
        owner: await tezos.signer.publicKeyHash(),
        totalSupply: '100',
        ledger: bigMapLedger,
      },
    });

    await op.confirmation();
    const lambda1_contract = await op.contract();
    console.log('LambdaViewContract : ' + lambda1_contract.address);
    return lambda1_contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateLambda2() {
  tezos.setSignerProvider(signer);
  try {
    const mapAccount1 = new MichelsonMap();
    mapAccount1.set(user_addresses.get('Deborah'), '25');
    mapAccount1.set(user_addresses.get('Allowances'), '25');

    const mapAccount2 = new MichelsonMap();
    mapAccount2.set(user_addresses.get('Eddy'), '25');
    mapAccount2.set(user_addresses.get('Freda'), '25');

    const bigMapLedger = new MichelsonMap();
    bigMapLedger.set(user_addresses.get('Glen'), {
      balance: '50',
      allowances: mapAccount1,
    });
    bigMapLedger.set(user_addresses.get('BigMapLedger'), {
      balance: '50',
      allowances: mapAccount2,
    });

    const op = await tezos.contract.originate({
      balance: '1',
      code: tzip7Contract,
      storage: {
        owner: await tezos.signer.publicKeyHash(),
        totalSupply: '100',
        ledger: bigMapLedger,
      },
    });

    await op.confirmation();
    const lambda2_contract = await op.contract();
    console.log('LambdaViewWithTokenContract : ' + lambda2_contract.address);
    return lambda2_contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateMapWithPairasMapKeys() {
  tezos.setSignerProvider(signer);
  try {
    const storageMap = new MichelsonMap();
    storageMap.set(
      {
        0: '1',
        1: user_addresses.get('Freda'),
      },
      { quantity: '10', amount: '100' }
    );
    storageMap.set(
      {
        0: '2',
        1: user_addresses.get('Deborah'),
      },
      { quantity: '20', amount: '200' }
    );
    storageMap.set(
      {
        0: '3',
        1: user_addresses.get('Eddy'),
      },
      { quantity: '30', amount: '300' }
    );

    const op = await tezos.contract.originate({
      code: contractMapPairKey,
      storage: {
        theAddress: user_addresses.get('Alice'),
        theMap: storageMap,
        theNumber: 10,
      },
    });

    await op.confirmation();
    const contract = await op.contract();
    console.log('MapWithPairasMapContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateMapWithComplexKeys() {
  tezos.setSignerProvider(signer);
  try {
    const storageMap = new MichelsonMap();
    storageMap.set(
      {
        0: '1',
        1: '2',
        2: 'test',
        3: 'cafe',
        4: '10',
        5: true,
        6: user_addresses.get('Eddy'),
        7: '2019-09-06T15:08:29.000Z',
        8: user_addresses.get('Eddy'),
      },
      100
    );

    storageMap.set(
      {
        0: '10',
        1: '20',
        2: 'Hello',
        3: 'ffff',
        4: '100',
        5: false,
        6: user_addresses.get('Freda'),
        7: '2019-10-06T15:08:29.000Z',
        8: user_addresses.get('Freda'),
      },
      1000
    );

    const op = await tezos.contract.originate({
      code: contractMap8pairs,
      storage: storageMap,
    });

    await op.confirmation();
    const contract = await op.contract();
    console.log('MapWithComplexKeysContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateInitialStorageWithMapAndBigMap() {
  tezos.setSignerProvider(signer);
  try {
    const storageMap = new MichelsonMap();
    storageMap.set(
      {
        0: '1',
        1: user_addresses.get('Freda'),
      },
      10
    );
    storageMap.set(
      {
        0: '2',
        1: user_addresses.get('Freda'),
      },
      20
    );

    const storageBigMap = new MichelsonMap();
    storageBigMap.set(
      {
        0: '10',
        1: user_addresses.get('Eddy'),
      },
      100
    );
    storageBigMap.set(
      {
        0: '20',
        1: user_addresses.get('Eddy'),
      },
      200
    );

    const op = await tezos.contract.originate({
      code: contractMapBigMap,
      storage: {
        thebigmap: storageBigMap,
        themap: storageMap,
      },
    });

    await op.confirmation();
    const contract = await op.contract();
    console.log('MapWithInitialStorageContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateMapWithSingleMapForStorage() {
  tezos.setSignerProvider(signer);
  try {
    const storageMap = new MichelsonMap();
    storageMap.set('1', { current_stock: '10000', max_price: '50' });
    storageMap.set('2', { current_stock: '120', max_price: '20' });
    storageMap.set('3', { current_stock: '50', max_price: '60' });

    const op = await tezos.contract.originate({
      code: contractMapTacoShop,
      storage: storageMap,
    });

    await (await op).confirmation();
    const contract = await op.contract();
    console.log('MapWithSingleMapForStorage : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateMapValueMultipleBigMaps() {
  tezos.setSignerProvider(signer);
  try {
    const signer = await tezos.signer.publicKeyHash();
    const bigMapInit = new MichelsonMap();
    bigMapInit.set(signer, { 0: '1', 1: new MichelsonMap() });
    bigMapInit.set(user_addresses.get('Eddy'), { 0: '2', 1: new MichelsonMap() });
    bigMapInit.set(user_addresses.get('Glen'), { 0: '3', 1: new MichelsonMap() });
    bigMapInit.set(user_addresses.get('Freda'), { 0: '4', 1: new MichelsonMap() });

    const op = await tezos.contract.originate({
      code: tokenCode,
      storage: {
        0: bigMapInit,
        1: signer,
        2: true,
        3: '3',
      },
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('BigMapsMultipleValuesContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateSmartContractComplexStorage() {
  tezos.setSignerProvider(signer);
  try {
    const dataMap = new MichelsonMap();
    dataMap.set('Hello', { bool: true });

    const recordsBigMap = new MichelsonMap();
    recordsBigMap.set('FFFF', {
      data: dataMap,
      owner: user_addresses.get('Glen'),
    });
    recordsBigMap.set('AAAA', {
      data: dataMap,
      owner: user_addresses.get('Glen'),
      validator: '1',
    });

    const validatorsMap = new MichelsonMap();
    validatorsMap.set('1', user_addresses.get('Deborah'));

    const op = await tezos.contract.originate({
      code: contractJson,
      storage: {
        owner: user_addresses.get('Glen'),
        records: recordsBigMap,
        validators: validatorsMap,
      },
    });

    await op.confirmation();
    const contract = await op.contract();
    console.log('BigMapsComplexStorageContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateContractCallFib() {
  tezos.setSignerProvider(signer);
  try {
    const op = await tezos.contract.originate({
      code: ` parameter (pair nat address);
      storage nat;
      code { CAR ;
             UNPAIR ;
             VIEW "fib" nat ;
             { IF_NONE { { UNIT ; FAILWITH } } { NIL operation ; PAIR } } }`,
      storage: 1,
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('ContractCallFib : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateContractTopLevelViews() {
  tezos.setSignerProvider(signer);
  try {
    const op = await tezos.contract.originate({
      code: contractOnChainViews,
      storage: 1,
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('ContractOnChainViews : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTZip12BigMapOffChain() {
  tezos.setSignerProvider(signer);
  try {
    const ledger = new MichelsonMap();
    ledger.set(
      {
        0: user_addresses.get('Eddy'),
        1: 0,
      },
      '20000'
    );
    ledger.set(
      {
        0: user_addresses.get('Glen'),
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
        administrator: user_addresses.get('TestFunder'),
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
    console.log('Tzip12BigMapOffChainContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16Storage() {
  tezos.setSignerProvider(signer);
  try {
    const metadataJSON = {
      name: 'test',
      description: 'A metadata test',
      version: '0.1',
      license: 'MIT',
      authors: ['Taquito <https://tezostaquito.io/>'],
      homepage: 'https://tezostaquito.io/',
    };

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set('', char2Bytes('tezos-storage:here'));
    metadataBigMap.set('here', char2Bytes(JSON.stringify(metadataJSON)));

    const tacoShopStorageMap = new MichelsonMap();

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap,
      },
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('Tzip16StorageContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16Https() {
  tezos.setSignerProvider(signer);
  try {
    const url = 'https://storage.googleapis.com/tzip-16/taco-shop-metadata.json';
    const bytesUrl = char2Bytes(url);

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set('', bytesUrl);

    const tacoShopStorageMap = new MichelsonMap();
    tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap,
      },
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('Tzip16HTTPSContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16SHA256() {
  tezos.setSignerProvider(signer);
  try {
    const urlPercentEncoded = encodeURIComponent(
      '//storage.googleapis.com/tzip-16/taco-shop-metadata.json'
    );
    const metadataSha256 = '0x7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b';
    const url = 'sha256://' + metadataSha256 + '/https:' + urlPercentEncoded;
    const bytesUrl = char2Bytes(url);

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set('', bytesUrl);

    const tacoShopStorageMap = new MichelsonMap();
    tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap,
      },
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('Tzip16SHA256Contract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16IPFS() {
  tezos.setSignerProvider(signer);
  try {
    const uri = 'ipfs://QmXnASUptTDnfhmcoznFqz3S1Mxu7X1zqo2YwbTN3nW52V';
    const bytesUrl = char2Bytes(uri);

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set('', bytesUrl);

    const tacoShopStorageMap = new MichelsonMap();

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap,
      },
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('Tzip16IPFSContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16OnChainJSON() {
  tezos.setSignerProvider(signer);
  try {
    const metadataBigMAp = new MichelsonMap();
    metadataBigMAp.set('', char2Bytes('tezos-storage:here'));
    metadataBigMAp.set('here', char2Bytes(JSON.stringify(metadataViewsExample1)));

    const op = await tezos.contract.originate({
      code: contractCode,
      storage: {
        0: 7,
        metadata: metadataBigMAp,
      },
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('Tzip16OnChainContractJSON : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16OnChainMultiply() {
  tezos.setSignerProvider(signer);
  try {
    const metadataBigMAp = new MichelsonMap();
    metadataBigMAp.set('', char2Bytes('tezos-storage:here'));
    metadataBigMAp.set('here', char2Bytes(JSON.stringify(metadataViewsExample2)));

    const op = await tezos.contract.originate({
      code: contractCode,
      storage: {
        0: 7,
        metadata: metadataBigMAp,
      },
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('Tzip16OnChainContractMultiply : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateWalletOriginateContractTransfer() {
  tezos.setSignerProvider(signer);
  try {
    const op = await tezos.contract.originate({
      balance: '0',
      code: `parameter unit;
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
             DIP { DROP 4 } }
            `,
      init: `0`,
    });
    await op.confirmation();
    const contract = await op.contract();
    console.log('WalletContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateWalletOriginateAreYouThere() {
  tezos.setSignerProvider(signer);
  try {
    const op = await tezos.wallet
      .originate({
        code: `parameter (or
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
   DIP { DROP 3 } }
            `,
        init: `(Pair (Pair True 0)
      (Pair ""
            { Elt 0x00006b82198cb179e8306c1bedd08f12dc863f328886 "Alice" ;
              Elt 0x0000b2e19a9e74440d86c59f13dab8a18ff873e889ea "HEllo!" }))`,
      })
      .send();
    await op.confirmation();
    const contract = await op.contract();
    console.log('WalletAreYouThereContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTokenContract() {
  tezos.setSignerProvider(signer);
  try {
    const op = await tezos.contract.originate({
      balance: '1',
      code: tokenCode,
      init: tokenInit(await tezos.signer.publicKeyHash()),
      fee: 150000,
      storageLimit: 10000,
      gasLimit: 400000,
    });

    const contract = await op.contract();
    console.log('TokenContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateBigMapPackContract() {
  tezos.setSignerProvider(signer);
  try {
    const code = [
      { prim: 'parameter', args: [{ prim: 'unit' }] },
      {
        prim: 'storage',
        args: [
          {
            prim: 'pair',
            args: [
              { prim: 'nat' },
              { prim: 'big_map', args: [{ prim: 'nat' }, { prim: 'string' }] },
            ],
          },
        ],
      },
      {
        prim: 'code',
        args: [[{ prim: 'CDR' }, { prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }]],
      },
    ];

    const bigmap = new MichelsonMap();

    for (let i = 1; i <= 410; i++) {
      bigmap.set(i, `${i}`);
    }

    const op = await tezos.contract.originate({
      code,
      storage: {
        0: '10',
        1: bigmap,
      },
      storageLimit: 32500,
    });

    await op.confirmation();
    const contract = await op.contract();
    console.log('BigMapPackContract : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateMichelsonMap() {
  tezos.setSignerProvider(signer);
  try {
    console.log('Deploying Michelson Tutorial contract...');
    const op = await tezos.contract.originate({
      code: `parameter (pair address mutez);
      storage (map address mutez);
      code { DUP ; CAR ; SWAP ; CDR ; SWAP ; DUP ; DUG 2 ; CDR ; DIG 2 ; CAR ; SWAP ; SOME ; SWAP ; UPDATE ; NIL operation ; PAIR }`,
      init: [
        {
          prim: 'Elt',
          args: [{ string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }, { int: '0' }],
        },
      ],
    });

    const contract = await op.contract();
    console.log('Michelson Tutorial Contract address', contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}
originateTheContracts();
