/// How to use:
///   Ensure the Testfunder account tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys has at least 2k tokens
///   for the testnet in use. The script will first check if addresses used in the script are funded,
///   and top them up if needed. The script will then originate each contract needed for Live Code
///   examples in Taquito Docs and produce a JSON file with each Contract Identifier and its PKH.
///   Use the testpad script Docs Live Code Contract Origination (in https://ecadlabs.ontestpad.com/project/18/)
///   with the desired chain (e.g. hangzhou) to match the originated scripts with their locations in the Docs.
///   The script will also produce a json file of contracts to use in the code examples in taquito/examples
///   Execute this script with
///    node -r ts-node/register ~/taquito/example/deploy-docs-live-code-contracts.ts

import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { tzip7Contract } from '../integration-tests/data/tzip_7_contract';
import { contractMapPairKey } from './data/contractMapPairKey';
import { contractIncrementing } from './data/contractIncrementing';
import { contractMapBigMap } from './data/contractMapInitialStorage';
import { contractJson } from './data/contractJson';
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

const provider = 'https://hangzhounet.api.tez.ie';
export const signer: any = new InMemorySigner(
  'edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca'
);
export const tezos = new TezosToolkit(provider);

let contract_catalogue = new Map();

let user_addresses = new Map();
user_addresses.set('TestFunder', 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys');
user_addresses.set('Alice', 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb');
user_addresses.set('Deborah', 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY');
user_addresses.set('Eddy', 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5');
user_addresses.set('Freda', 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx');
user_addresses.set('Glen', 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr');
user_addresses.set('Validation', 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx');
user_addresses.set('WalletReceiver', 'tz1NhNv9g7rtcjyNsH8Zqu79giY5aTqDDrzB');
user_addresses.set('Allowances', 'tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE');
user_addresses.set('BigMapLedger', 'tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq');

const min_balance = 100;

async function checkBalances() {
  console.log('checking funds...');
  try {
    user_addresses.forEach(async (value: string, key: string) => {
      const user_balance: any = await tezos.tz.getBalance(value);
      if (user_balance < min_balance) {
        tezos.setSignerProvider(signer);
        console.log(`${key} has a too-low balance of ${user_balance / 1000000}.`);
        console.log(`Transfering ${min_balance} ꜩ to ${key}...`);
        await transferMinBalance();
        console.log(`Transfer complete`);
      } else {
        console.log(`${key} has an ok balance of ${user_balance / 1000000}.`);
      }

      async function transferMinBalance() {
        await tezos.contract
          .transfer({ to: value, amount: min_balance })
          .then((op) => {
            console.log(`Waiting for ${op.hash} of transfer to ${value} to be confirmed...`);
            return op.confirmation(1).then(() => op.hash);
          })
          .catch((error) => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
      }
    });
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTheContracts() {
  checkBalances();

  console.log('originating...');
  // tslint:disable-next-line: no-floating-promises
  contract_catalogue.set('IncrementContract', await originateIncrementContract());
  contract_catalogue.set('LambdaViewOne', await originateLambda1());
  contract_catalogue.set('LambdaViewTwo', await originateLambda2());
  contract_catalogue.set('BigMapPairasMap', await originateBigMapsPairasMapKeys());
  contract_catalogue.set('BigMapValuesComplexKeys', await originateBigMapsComplexKeys());
  contract_catalogue.set('BigMapInitialStorage', await originateBigMapsInitialStorage());
  contract_catalogue.set('BigMapsMultipleValues', await originateMapValueMultipleBigMaps());
  contract_catalogue.set(
    'SmartContractComplexStorage',
    await originateSmartContractComplexStorage()
  );
  contract_catalogue.set('Tzip12BigMapOffChain', await originateTZip12BigMapOffChain());
  contract_catalogue.set('Tzip16Storage', await originateTzip16Storage());
  contract_catalogue.set('Tzip16HTTPS', await originateTzip16Https());
  contract_catalogue.set('Tzip16SHA256', await originateTzip16SHA256());
  contract_catalogue.set('Tzip16IPFS', await originateTzip16IPFS());
  contract_catalogue.set('Tzip16OffChainOne', await originateTzip16OnChainOne());
  contract_catalogue.set('Tzip16OffChainTwo', await originateTzip16OnChainTwo());
  contract_catalogue.set('WalletContract', await originateWalletOriginateContractTransfer());
  contract_catalogue.set('WalletAreYouThereContract', await originateWalletOriginateAreYouThere());
  contract_catalogue.set('TokenContract', await originateTokenContract());
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
    console.log('LambdaViewOne : ' + lambda1_contract.address);
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
    console.log('LambdaViewTwo : ' + lambda2_contract.address);
    return lambda2_contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateBigMapsPairasMapKeys() {
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
    console.log('BigMapPairasMap : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateBigMapsComplexKeys() {
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
    console.log('BigMapValuesComplexKeys : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateBigMapsInitialStorage() {
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
        theMap: storageMap,
      },
    });

    await op.confirmation();
    const contract = await op.contract();
    console.log('BigMapInitialStorage : ' + contract.address);
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
    console.log('BigMapsMultipleValues : ' + contract.address);
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
    console.log('SmartContractComplexStorage : ' + contract.address);
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
    console.log('Tzip12BigMapOffChain : ' + contract.address);
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
    console.log('Tzip16Storage : ' + contract.address);
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
    console.log('Tzip16HTTPS : ' + contract.address);
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
    console.log('Tzip16SHA256 : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16IPFS() {
  tezos.setSignerProvider(signer);
  try {
    const uri = 'ipfs://QmcMUKkhXowQjCPtDVVXyFJd7W9LmC92Gs5kYH1KjEisdj';
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
    console.log('Tzip16IPFS : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16OnChainOne() {
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
    console.log('Tzip16OnChainOne : ' + contract.address);
    return contract.address;
  } catch (ex) {
    console.error(ex);
  }
}

async function originateTzip16OnChainTwo() {
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
    console.log('Tzip16OnChainTwo : ' + contract.address);
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

originateTheContracts();
