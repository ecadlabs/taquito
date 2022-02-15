import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';

const provider = 'https://ithacanet.ecadinfra.com/';

async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
    tezos,
    'noriqgjl.gtsyulgy@teztnets.xyz',
    'st3sZBRLWF',
    [
     "escape",
     "camera",
     "credit",
     "endorse",
     "auto",
     "lamp",
     "advance",
     "orange",
     "fluid",
     "virus",
     "argue",
     "knee",
     "pluck",
     "remove",
     "scheme"
    ].join(' '),
    '7d414378d9071328313cca699d6922f1b59d076a'
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

example();
