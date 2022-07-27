import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { tacoContractTzip16 } from "../integration-tests/data/modified-taco-contract"
import { char2Bytes } from '@taquito/utils';
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
    console.log('Deploying Tzip16Storage contract...');
   
    const metadataJSON = {
      "name": "test",
      "description": "A metadata test",
      "version": "0.1",
      "license": "MIT",
      "authors": [
        "Taquito <https://tezostaquito.io/>"
      ],
      "homepage": "https://tezostaquito.io/"
    };

  const metadataBigMap = new MichelsonMap();
  metadataBigMap.set("", char2Bytes('tezos-storage:here'));
  metadataBigMap.set("here", char2Bytes(JSON.stringify(metadataJSON)))

  // Ligo Taco shop contract modified to include metadata in storage
  // https://ide.ligolang.org/p/-uS469slzUlSm1zwNqHl1A

  const tacoShopStorageMap = new MichelsonMap();

  const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
          metadata: metadataBigMap,
          taco_shop_storage: tacoShopStorageMap
      },
  });

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Tzip16Storage Contract address',contract.address)
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
