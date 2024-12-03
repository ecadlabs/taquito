import { TezosToolkit } from "@taquito/taquito";
import { tzip16, Tzip16Module } from '@taquito/tzip16';

async function example() {
  try {

    const tezos = new TezosToolkit('https://ghostnet.tezos.ecadinfra.com');
    tezos.addExtension(new Tzip16Module());
    const contract = await tezos.contract.at("KT1JZVozQHLZN7TaACnX6NGBxUkhNjn6tmTB", tzip16)
    const metadata = await contract.tzip16().getMetadata();
    console.log(JSON.stringify(metadata, null, 2));

  } catch (ex) {
    console.error(ex);
  }
}

example();