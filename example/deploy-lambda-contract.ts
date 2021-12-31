import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';

const provider = 'https://ithacanet.ecadinfra.com/';

async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
    tezos,
    "xexzfhgt.nwvacnio@teztnets.xyz",
    'xdsz5UTW70',
    [
      "behave",
		"code",
		"cover",
		"toilet",
		"width",
		"device",
		"blush",
		"minimum",
		"abuse",
		"inform",
		"shop",
		"spare",
		"scrub",
		"sponsor",
		"end"
    ].join(' '),
    'd0c4280b41417965c6d6454ff1b0881762565f52'
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
