import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { voteInitSample, voteSample } from '../integration-tests/data/vote-contract';

async function example() {
  const provider = 'https://ghostnet.tezos.ecadinfra.com';
    const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
    const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Ligo Vote contract...');
    const op = await tezos.contract.originate({
      balance: '1',
      code: voteSample,
      init: voteInitSample,
      fee: 30000,
      storageLimit: 2000,
      gasLimit: 90000,
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Ligo Vote Contract address',contract.address)
    console.log('Gas Used', op.consumedGas);
    console.log('Storage Paid', op.storageDiff);
    console.log('Storage Size', op.storageSize);
    console.log('Storage', await contract.storage());
    console.log('Operation hash:', op.hash, 'Included in block level:', op.includedInBlock);
  } catch (ex) {
    console.error(ex);
  }
}

example();
