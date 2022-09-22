import { CONFIGS } from './config';
import { MichelsonMap, OriginateParams, RpcForger, TezosToolkit } from '@taquito/taquito';
import { singleSaplingStateContractJProtocol } from './data/single_sapling_state_contract_jakarta_michelson';
import { fa2ForTokenMetadataView } from './data/fa2-for-token-metadata-view';
import { char2Bytes } from '@taquito/utils';
import BigNumber from 'bignumber.js';
import { codeViewsTopLevel } from './data/contract_views_top_level';
import { knownBigMapContract } from './data/knownBigMapContract';
import { knownContract } from './data/knownContract';
const fs = require('fs');

const MUTEZ_UNIT = new BigNumber(1000000);

CONFIGS().forEach(({ lib, setup, protocol }) => {
  const tezos = lib;
  let keyPkh: string = "";
  let keyInitialBalance: BigNumber = new BigNumber(0);

  (async () => {
    await setup(true);
    fs.writeFile(`known-contracts-${protocol.substring(0,9)}.ts`, '', (err: any) => {
      if (err) {
        console.error(err);
      }
    });

    keyPkh = await tezos.signer.publicKeyHash();
    keyInitialBalance = await tezos.tz.getBalance(keyPkh);

    // KnownContract
    await originateKnownContract('Contract', tezos, {
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
      }
    });

    // KnownBigMapContract
    const allowancesBigMap = new MichelsonMap();
    const ledgerBigMap = new MichelsonMap();
    ledgerBigMap.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances: allowancesBigMap, balance: '100' });
    await originateKnownContract('BigMapContract', tezos, {
      code: knownBigMapContract,
      storage: {
        ledger: ledgerBigMap,
        owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        paused: true,
        totalSupply: '100',
      }
    });

    // KnownTzip12BigMapOffChainContract
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

    await originateKnownContract('Tzip12BigMapOffChainContract', tezos, {
      code: fa2ForTokenMetadataView,
      storage: {
        administrator: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
        all_tokens: '2',
        ledger: ledger,
        metadata,
        operators,
        paused: false,
        tokens,
      }
    });

    // KnownSaplingContract
    await originateKnownContract('SaplingContract', tezos, {
      code: singleSaplingStateContractJProtocol(),
      init: '{}'
    });

    // knownOnChainViewContract
    await originateKnownContract('OnChainViewContractAddress', tezos, {
      code: codeViewsTopLevel,
      storage: 2
    });

    console.log(`
################################################################################
Public Key Hash : ${keyPkh}
Initial Balance : ${keyInitialBalance.dividedBy(MUTEZ_UNIT)} XTZ
Final Balance   : ${(await tezos.tz.getBalance(keyPkh)).dividedBy(MUTEZ_UNIT)} XTZ

Total XTZ Spent : ${keyInitialBalance.minus(await tezos.tz.getBalance(keyPkh)).dividedBy(MUTEZ_UNIT)} XTZ
`)
  })();


  async function originateKnownContract(contractName: string, tezos: TezosToolkit, contractOriginateParams: OriginateParams): Promise<void> {
    try {
      const operation = await tezos.contract.originate(contractOriginateParams);
      const contract = await operation.contract();
      console.log(`known${contractName} address:  ${contract.address}`);
      console.log(`::set-output name=known${contractName}Address::${contract.address}\n`);
      fs.appendFile(`known-contracts-${protocol.substring(0,9)}.ts`, `export const known${contractName}${protocol.substring(0,9)} = "${contract.address}";\n`, (err: any) => {
        if (err) {
          console.error(err);
        }
      });
    } catch (e: any) {
      console.error(`Failed to deploy ${contractName} known contract | Error: ${e.stack}`);

      if (e.name === "ForgingMismatchError") {
        console.log(`Composite forger failed to originate ${contractName}. Trying to originate the contract by using RPC forger...`);

        tezos.setForgerProvider(tezos.getFactory(RpcForger)());

        await originateKnownContract(contractName, tezos, contractOriginateParams);
      }
    }
  }

  async function printBalance(pkh: string, tezos: TezosToolkit): Promise<void> {
    let balance = await tezos.tz.getBalance(pkh);
    console.log(`${pkh} balance: ${balance}`);
  }
})