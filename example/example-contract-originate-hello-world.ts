import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import Faucet from './faucet-interface';


const {email, password, mnemonic, activation_code} = require("./faucet-default-values.json") as Faucet

const provider = 'https://ithacanet.ecadinfra.com/'

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
    console.log('Deploying Hello world contract...');
    const op = await tezos.contract.originate({
      balance: '0',
      code: `parameter string;
            storage string;
            code {CAR;
                  PUSH string "Hello ";
                  CONCAT;
                  NIL operation; PAIR};
            `,
      init: `"test1234"`,
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
