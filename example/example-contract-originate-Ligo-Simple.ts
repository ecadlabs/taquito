import { TezosToolkit } from '@taquito/taquito';
import { ligoSample } from '../integration-tests/data/ligo-simple-contract';
import { InMemorySigner } from '@taquito/signer';

async function example() {
  const provider = 'https://ghostnet.tezos.ecadinfra.com';
    const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
    const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Ligo simple contract...');

    const op = await tezos.contract.originate({
      balance: '1',
      code: ligoSample,
      init: { int: '0' },
      fee: 30000,
      storageLimit: 2000,
      gasLimit: 90000,
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Ligo simple Contract address',contract.address)
    console.log('Storage', await contract.storage());
    console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);
  } catch (ex) {
    console.error(ex);
  }
}

example();
