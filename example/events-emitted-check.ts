import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

const provider = 'https://ghostnet.ecadinfra.com';

async function example() {
  const tezos = new TezosToolkit(provider);
  const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
  tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Hello world contract...');
    const op = await tezos.contract.originate({
      balance: '0',
      code: ` parameter unit ;
      storage unit ;
      code { CDR ; NIL operation ; PUSH bool True ; EMIT %main bool ; CONS ; PAIR }
            `,
      storage: `unit`,
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Hello world Contract address',contract.address)
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
