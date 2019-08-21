import { Tezos } from '../packages/tezos-ts/src/tezos-ts';
import { RpcClient } from '../packages/tezos-ts-rpc/src/tezos-ts-rpc';

const provider = 'https://alphanet-node.tzscan.io';
const client = new RpcClient(provider);

async function example() {
  try {
    Tezos.setProvider(provider);
    console.log('Getting storage...');
    await Tezos.contract.getStorage('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN').then(console.log);
    console.log('Getting balance...');
    await Tezos.tz.getBalance('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN').then(console.log);

    console.log('Getting big map key...');
    await Tezos.contract
      .getBigMapKey('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN', 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')
      .then(console.log);
  } catch (ex) {
    console.error(ex);
  }

  console.log('Getting constants from head...');
  try {
    await client.getConstants().then(console.log);
  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
