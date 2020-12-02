import { TezosToolkit } from "@taquito/taquito";
import { composeTzip16 } from '../packages/taquito-tzip16/src/composer'

async function example() {
  try {

    const tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
    const contract = await tezos.contract.at("KT1GPiBGM2sQ7DjPqCmGbHBDzkhweTR2spZA", composeTzip16)
    const metadata = await contract.tzip16().getMetadata();
    console.log('metadata:', JSON.stringify(metadata));

    const tezos2 = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
    const contract2 = await tezos2.wallet.at("KT1GPiBGM2sQ7DjPqCmGbHBDzkhweTR2spZA", composeTzip16)
    const metadata2 = await contract2.tzip16().getMetadata();
    console.log('metadata:', JSON.stringify(metadata2));


} catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
