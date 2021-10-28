import { TezosToolkit } from "@taquito/taquito";
import { tzip16, Tzip16Module } from '@taquito/tzip16';

async function example() {
  try {

    const tezos = new TezosToolkit('https://hangzhounet.api.tez.ie');
    tezos.addExtension(new Tzip16Module());
    const contract = await tezos.contract.at("KT1FT56z7FFJz2jTvEsjECj16cqNQfyrePhX", tzip16)
    const metadata = await contract.tzip16().getMetadata();
    console.log(JSON.stringify(metadata, null, 2));

  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
