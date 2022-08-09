import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { knownContract } from './data/knownContract';
import { knownBigMapContract } from './data/knownBigMapContract';
import { singleSaplingStateContractJProtocol } from '../integration-tests/data/single_sapling_state_contract_jakarta_michelson';
import Faucet from './faucet-interface';
import { char2Bytes } from '@taquito/utils';
import { fa2ForTokenMetadataView } from '../integration-tests/data/fa2-for-token-metadata-view';

const { email, password, mnemonic, activation_code } =
  require('./faucet-default-values.json') as Faucet;

<<<<<<< HEAD
const provider = 'http://mondaynet.ecadinfra.com:8732';
=======
const provider = 'https://kathmandunet.ecadinfra.com/';
>>>>>>> af632c6257f5ea2a696addae4fa1f142962d189a

async function example() {
  const tezos = new TezosToolkit(provider);

  const users: Array<string> = [
    'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
    'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
    'tz1NhNv9g7rtcjyNsH8Zqu79giY5aTqDDrzB',
  ];

  const user_addresses = new Map();
  user_addresses.set('TestFunder', users[0]);
  user_addresses.set('Eddy', users[1]);
  user_addresses.set('Glen', users[2]);

  await importKey(tezos, email, password, mnemonic.join(' '), activation_code);

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
              [
                {
                  bytes:
                    '005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9',
                },
              ],
            ],
          },
        ],
      },
    });
    console.log('Awaiting confirmation...');
    const contractknownContract = await opknownContract.contract();
    console.log(
      'The address of the knownContract is: ',
      contractknownContract.address
    );

    console.log('Deploying the knownBigMapContract...');
    const allowances = new MichelsonMap();
    const ledger = new MichelsonMap();
    ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', {
      allowances,
      balance: '100',
    });

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
<<<<<<< HEAD
    console.log('The address of the knownBigMapContract is: ', contractknownBigMapContract.address);

    console.log('Deploying the Sapling State Contract...');
    const opknownSaplingContract = await tezos.contract.originate({
       code: singleSaplingStateContractJProtocol,
        init: '{}'
      });
      await opknownSaplingContract.confirmation();
      const contract = await opknownSaplingContract.contract();
      console.log(contract.address)

      console.log('Awaiting confirmation...');
      const contractSaplingStateContract = await opknownSaplingContract.contract();
      console.log('The address of the  Sapling Contract is: ', contractSaplingStateContract.address);

=======
    console.log(
      'The address of the knownBigMapContract is: ',
      contractknownBigMapContract.address
    );

    console.log('Deploying the Sapling State Contract...');
    const opknownSaplingContract = await tezos.contract.originate({
      code: singleSaplingStateContractJProtocol,
      init: '{}',
    });
    await opknownSaplingContract.confirmation();
    const sapling_contract = await opknownSaplingContract.contract();
    console.log(sapling_contract.address);

    console.log('Awaiting confirmation...');
    const contractSaplingStateContract =
      await opknownSaplingContract.contract();
    console.log(
      'The address of the  Sapling Contract is: ',
      contractSaplingStateContract.address
    );
  } catch (ex) {
    console.error(ex);
  }
  try {
    console.log('Deploying the Tzip12BigMapOffChain Contract...');
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
    metadataMap0.set(
      '',
      char2Bytes('https://storage.googleapis.com/tzip-16/token-metadata.json')
    );
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
>>>>>>> af632c6257f5ea2a696addae4fa1f142962d189a
  } catch (ex) {
    console.error(ex);
  }
}
example();
