// This contract relates to Test #7 for the beacon-test-dapp
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import {importKey} from '@taquito/signer';
const tezos = new TezosToolkit("https://api.tez.ie/rpc/florencenet");
const contractJSON = require('./code-json/beacon-code-receiving.json');

async function deploy() {
  await importKey(
    tezos, 
    "dnbwgvmv.ehimuneg@tezos.example.org",
    "irSIO7ZItW",
    [
    "brand",
    "lawsuit",
    "setup",
    "edit",
    "useless",
    "correct",
    "parent",
    "biology",
    "capable",
    "dial",
    "lumber",
    "unaware",
    "chest",
    "sausage",
    "fatigue"
    ].join(" "),
    "e56507e1d7550291b2929b94fb674902fef067f3"
    );

  tezos.contract
    .originate({
      code: contractJSON,
      storage: new MichelsonMap(),
    })
    .then((originationOp) => {
      console.log(`Waiting for confirmation of origination for ${originationOp.contractAddress}...`);
      return originationOp.contract();
    })
    .then((contract) => {
      console.log(`Origination completed.`);
    })
    .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
}

deploy();