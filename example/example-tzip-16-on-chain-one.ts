import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { contractCode, metadataViewsExample1 } from '../integration-tests/data/metadataViews';
import { char2Bytes } from '@taquito/utils';
import { InMemorySigner } from '@taquito/signer';
import { stringify } from '@taquito/core';

async function example() {
  const provider = 'https://ghostnet.ecadinfra.com';
  const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
  const tezos = new TezosToolkit(provider);
  tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Tzip16OffChainOne contract...');

    const metadataBigMAp = new MichelsonMap();
    metadataBigMAp.set("", char2Bytes('tezos-storage:here'));
    metadataBigMAp.set("here", char2Bytes(stringify(metadataViewsExample1)))

    const op = await tezos.contract.originate({
      code: contractCode,
      storage: {
        0: 7,
        metadata: metadataBigMAp
      }
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Tzip16OffChainOne Contract address', contract.address)
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
