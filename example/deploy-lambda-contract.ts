import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';

const provider = 'https://idiazabalnet.ecadinfra.com';

async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
    tezos,
    'pqugfnyp.aricovrw@teztnets.xyz',
    'PwMXISc7HK',
    [
      "drift",
      "winner",
      "prevent",
      "sorry",
      "loud",
      "pattern",
      "easy",
      "buffalo",
      "surround",
      "exist",
      "accuse",
      "volume",
      "loop",
      "day",
      "club",
    ].join(' '),
    '844a986d27f7989859bc82ebce16f293ab0f2da6'
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
