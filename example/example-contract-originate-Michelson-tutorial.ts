import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

async function example() {
  const provider = 'https://ghostnet.tezos.ecadinfra.com';
    const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
    const tezos = new TezosToolkit(provider);
    tezos.setSignerProvider(signer);

  try {
    console.log('Deploying Michelson Tutorial contract...');
    const op = await tezos.contract.originate({
      code: `parameter (pair address mutez);
      storage (map address mutez);
      code { DUP ; CAR ; SWAP ; CDR ; SWAP ; DUP ; DUG 2 ; CDR ; DIG 2 ; CAR ; SWAP ; SOME ; SWAP ; UPDATE ; NIL operation ; PAIR }`,
      init: [{
        prim: 'Elt',
        args: [{ string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }, { int: '0' }],
      }],
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Michelson Tutorial Contract address', contract.address);
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
