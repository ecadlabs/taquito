import { CONFIGS } from './config';
import { MichelsonMap, OriginateParams, RpcForger } from '@taquito/taquito';
import { singleSaplingStateContractJProtocol } from './data/single_sapling_state_contract_jakarta_michelson';
import { fa2ForTokenMetadataView } from './data/fa2-for-token-metadata-view';
import { stringToBytes } from '@taquito/utils';
import BigNumberJs from 'bignumber.js';
type BigNumber = InstanceType<typeof BigNumberJs>;
const BigNumber = BigNumberJs;
import { codeViewsTopLevel } from './data/contract_views_top_level';
import { knownBigMapContract } from './data/knownBigMapContract';
import { knownContract } from './data/knownContract';
import * as fs from 'fs/promises';
import { join } from 'node:path';
import { ticketsSendTz } from './data/code_with_ticket_transfer';

// before running the test with secret key make sure tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD is funded
const MUTEZ_UNIT = new BigNumber(1000000);

const deployments = CONFIGS().map(async ({ lib: tezos, setup, networkName }) => {
  await setup(true);
  console.log(`networkName: ${networkName}`);

  const outputPath = `known-contracts-${networkName.toLowerCase()}.ts`;
  const addresses: { name: string; address: string }[] = [];

  const originate = async (params: OriginateParams): Promise<string> => {
    const operation = await tezos.contract.originate(params);
    await operation.confirmation();
    return (await operation.contract()).address;
  };

  const originateKnownContract = async (
    contractName: string,
    params: OriginateParams
  ): Promise<void> => {
    let address: string;
    try {
      address = await originate(params);
    } catch (error) {
      if (!(error instanceof Error) || error.name !== 'ForgingMismatchError') {
        throw Object.assign(new Error(`Failed to deploy ${contractName} on ${networkName}`), { cause: error });
      }
      console.log(`Composite forger failed for ${contractName}. Retrying with the RPC forger.`);
      tezos.setForgerProvider(tezos.getFactory(RpcForger)());
      try {
        address = await originate(params);
      } catch (retryError) {
        throw Object.assign(new Error(`Failed to deploy ${contractName} on ${networkName} with the RPC forger`), { cause: retryError });
      }
    }
    addresses.push({ name: contractName, address });
    console.log(`known ${contractName} address:  ${address}`);
  };

  const keyPkh = await tezos.signer.publicKeyHash();
  const keyInitialBalance = await tezos.tz.getBalance(keyPkh);

  // KnownContract
  await originateKnownContract('contract', {
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
  await originateKnownContract('bigMapContract', {
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

  await originateKnownContract('tzip12BigMapOffChainContract', {
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
  await originateKnownContract('saplingContract', {
    code: singleSaplingStateContractJProtocol(),
    init: '{}'
  });

  // knownOnChainViewContract
  await originateKnownContract('onChainViewContractAddress', {
    code: codeViewsTopLevel,
    storage: 2
  });

  // knownTicketContract
  await originateKnownContract('ticketContract', {
    code: ticketsSendTz,
    storage: null
  });

  const suffix = networkName.charAt(0) + networkName.slice(1).toLowerCase();
  const output = [
    "import { KnownContracts } from './known-contracts';",
    `export const knownContracts${suffix}: KnownContracts = {`,
    ...addresses.map(({ name, address }) => `  ${name}: ${JSON.stringify(address)},`),
    '};',
    '',
  ].join('\n');

  const stagingDirectory = await fs.mkdtemp(`${outputPath}.tmp-`);
  try {
    const stagingFile = join(stagingDirectory, 'known-contracts.ts');
    await fs.writeFile(stagingFile, output);
    await fs.rename(stagingFile, outputPath);
  } finally {
    await fs.rm(stagingDirectory, { recursive: true, force: true });
  }

  for (const { name, address } of addresses) {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    console.log(`::set-output name=known${capitalized}Address::${address}\n`);
  }

  const keyFinalBalance = await tezos.tz.getBalance(keyPkh);
  console.log(`
################################################################################
Public Key Hash : ${keyPkh}
Initial Balance : ${keyInitialBalance.dividedBy(MUTEZ_UNIT)} XTZ
Final Balance   : ${keyFinalBalance.dividedBy(MUTEZ_UNIT)} XTZ

Total XTZ Spent : ${keyInitialBalance.minus(keyFinalBalance).dividedBy(MUTEZ_UNIT)} XTZ
`);
});

void Promise.allSettled(deployments).then((results) => {
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error(result.reason);
      process.exitCode = 1;
    }
  }
});
