import { TezosToolkit } from '@taquito/taquito';
import { ligoSample } from '../integration-tests/data/ligo-simple-contract';
import { importKey } from '@taquito/signer';
import Faucet from './faucet-interface';


const {email, password, mnemonic, activation_code} = require("./faucet-default-values.json") as Faucet

const provider = 'https://jakartanet.ecadinfra.com/'

async function example() {
  const tezos = new TezosToolkit(provider)
  await importKey(
     tezos,
     email,
     password,
     mnemonic.join(' '),
     activation_code
   );

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
