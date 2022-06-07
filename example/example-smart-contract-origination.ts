import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import Faucet from './faucet-interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
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
    console.log('Deploying SmartContract for tests...');
    const op = await tezos.contract.originate({
     // balance: '0',
      code: `{ parameter (or (int %decrement) (int %increment)) ;
        storage int ;
        code { DUP ;
               CDR ;
               DIP { DUP } ;
               SWAP ;
               CAR ;
               IF_LEFT
                 { DIP { DUP } ;
                   SWAP ;
                   DIP { DUP } ;
                   PAIR ;
                   DUP ;
                   CAR ;
                   DIP { DUP ; CDR } ;
                   SUB ;
                   DIP { DROP 2 } }
                 { DIP { DUP } ;
                   SWAP ;
                   DIP { DUP } ;
                   PAIR ;
                   DUP ;
                   CAR ;
                   DIP { DUP ; CDR } ;
                   ADD ;
                   DIP { DROP 2 } } ;
               NIL operation ;
               PAIR ;
               DIP { DROP 2 } } }
            `,
      init: `0`,
    });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log("SmartContract address is : "+contract.address);
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
