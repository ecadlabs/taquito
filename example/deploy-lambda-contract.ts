import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';

const provider = 'https://hangzhounet.api.tez.ie';

async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
    tezos,
    'dkpiyvzn.dsijlnlh@teztnets.xyz',
    'R5eBIrotRR',
    [
      "rebuild",
      "local",
      "wasp",
      "quantum",
      "illegal",
      "pattern",
      "write",
      "torch",
      "practice",
      "this",
      "abuse",
      "recipe",
      "door",
      "diesel",
      "garment",
    ].join(' '),
    '30f062741f625b373ad735cd4bd1049b8a4028fe'
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
