import { TezosToolkit } from "@taquito/taquito";
import { tzip16 } from '../packages/taquito-tzip16/src/composer'
import { Tzip16Module } from "../packages/taquito-tzip16/src/tzip16-extension";

async function example() {
  try {

    const tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
    tezos.addExtension(new Tzip16Module());
    const contract = await tezos.contract.at("KT1GPiBGM2sQ7DjPqCmGbHBDzkhweTR2spZA", tzip16)
    const metadata = await contract.tzip16().getMetadata();
    console.log(JSON.stringify(metadata, null, 2));

  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
