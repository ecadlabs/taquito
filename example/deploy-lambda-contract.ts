import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';

const provider = 'https://idiazabalnet.ecadinfra.com';

async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
    tezos,
    "tvpdppwu.malcebyl@teztnets.xyz",
    'RPz8wnGw6q',
    [
      "young",
      "you",
      "issue",
      "belt",
      "kitten",
      "three",
      "face",
      "ocean",
      "myth",
      "tag",
      "athlete",
      "purpose",
      "farm",
      "room",
      "grant"
    ].join(' '),
    '3da657a79c89a3a39c762d95ea6cb01b99d3e0a2'
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
