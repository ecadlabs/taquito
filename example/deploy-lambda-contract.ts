import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';

const provider = 'http://192.168.86.86:8732';

async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
    tezos,
    'peqjckge.qkrrajzs@tezos.example.org',
    'y4BX7qS1UE',
    [
      'skate',
      'damp',
      'faculty',
      'morning',
      'bring',
      'ridge',
      'traffic',
      'initial',
      'piece',
      'annual',
      'give',
      'say',
      'wrestle',
      'rare',
      'ability',
    ].join(' '),
    '7d4c8c3796fdbf4869edb5703758f0e5831f5081'
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
