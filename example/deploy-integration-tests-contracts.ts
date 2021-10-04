import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { knownContract } from './data/knownContract';
import { knownBigMapContract } from './data/knownBigMapContract';

const provider = 'https://hangzhounet.api.tez.ie';

async function example() {
  const tezos = new TezosToolkit(provider);

  await importKey(
    tezos,
    'eqzzjrdx.pevbfgbe@teztnets.xyz',
    'O1lemsWcJh',
    [
      "shift",
    "pattern",
    "palm",
    "report",
    "pulp",
    "sample",
    "brick",
    "term",
    "final",
    "health",
    "talk",
    "artwork",
    "scatter",
    "midnight",
    "boost",
    ].join(' '),
    '7cbbab0f4e55c200f8a508e262f8e5be7f5e21da'
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
  } catch (ex) {
    console.error(ex);
  }
}
example();
