import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';

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
    console.log('Deploying lambda contract...');
    const op = await tezos.contract.originate({
      code: VIEW_LAMBDA.code,
      storage: VIEW_LAMBDA.storage,
    });

    console.log('Awaiting confirmation...');
    const lambdaContract = await op.contract();
    const lambdaContractAddress = lambdaContract.address
    console.log(lambdaContractAddress);
  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
