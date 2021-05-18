import {TezosToolkit} from '@taquito/taquito';
import {importKey} from '@taquito/signer';
const tezos = new TezosToolkit("https://api.tez.ie/rpc/florencenet");
const contractJSON = require('./code-json/beacon-code-main.json');

async function deploy() {
  await importKey(
    tezos, 
    "ahzahfuy.nymukxzz@tezos.example.org",
    "zCiXvkVJDB",
    [
      "blood",
      "predict",
      "enact",
      "change",
      "fresh",
      "clever",
      "test",
      "segment",
      "health",
      "famous",
      "cash",
      "wet",
      "slow",
      "snack",
      "reduce"
    ].join(" "),
    "0e4fb76262187b84cb60e307dd5aa7c4562adb2e"
    );

  tezos.contract
    .originate({
      code: contractJSON,
      storage: {
        simple: 427,
        complex: {
          1: 414,
          2: 'Taquito'
        },
        optional: {
          3: { int: 4 },
          4: { string: 'Tezos' }
        }
      },
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