import { MichelsonMap, TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { contractCode, metadataViewsExample2 } from '../integration-tests/data/metadataViews';
import { char2Bytes } from '@taquito/utils';
import Faucet from './faucet-interface';

const {email, password, mnemonic, activation_code} = require("./faucet-default-values.json") as Faucet

const provider = 'https://kathmandunet.ecadinfra.com/'

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
    console.log('Deploying Tzip16OffChainTwo contract...');
   
    const metadataBigMAp = new MichelsonMap();
			metadataBigMAp.set("", char2Bytes('tezos-storage:here'));
			metadataBigMAp.set("here", char2Bytes(JSON.stringify(metadataViewsExample2)))

			const op = await tezos.contract.originate({
				code: contractCode,
				storage: {
					0: 7,
					metadata: metadataBigMAp
				}
			});

    console.log('Awaiting confirmation...');
    const contract = await op.contract();
    console.log('Tzip16OffChainTwo Contract address',contract.address)
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
