import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { voteInitSample, voteSample } from '../integration-tests/data/vote-contract';
import Faucet from './faucet-interface';

const {email, password, mnemonic, activation_code} = require("./faucet-default-values.json") as Faucet

const provider = 'https://jakartanet.ecadinfra.com/'

async function example() {
  const tezos = new TezosToolkit(provider);
  await importKey(
     tezos,
     email,
     password,
     mnemonic.join(' '),
     activation_code
   );

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
