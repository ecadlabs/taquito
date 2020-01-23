import { Tezos } from '../packages/taquito/src/taquito';
import { RpcClient } from '../packages/taquito-rpc/src/taquito-rpc';
import { castToString } from '../packages/taquito-rpc/src/utils/utils';

const provider = 'https://api.tez.ie/rpc/carthagenet';
const client = new RpcClient(provider);

async function example() {
  try {
    Tezos.setProvider({ rpc: provider });
    console.log('Getting storage...');
    await Tezos.contract.getStorage('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN').then(console.log);
    console.log('Getting balance...');
    await Tezos.tz.getBalance('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN').then(console.log);

    console.log('Getting big map key...');
    await Tezos.contract
      .getBigMapKey('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN', 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')
      .then(console.log);

    console.log('Query balance history...');
    await Tezos.query
      .balanceHistory('KT1DzGefKWdrwWn9HxcYtKR46todiC66bxsH', {
        start: '2018-09-20T03:36:47Z',
        end: new Date(),
        limit: 100,
      })
      .then(console.log);
  } catch (ex) {
    console.error(ex);
  }

  console.log('Getting constants from head...');
  try {
    await client.getConstants().then(res => {
      console.log('The output we get with BigNumbers:');
      console.log(res);
      console.log('Converted BigNumbers to strings for readability:');
      console.log(castToString(res));
    });
  } catch (ex) {
    console.error(ex);
  }

  console.log('Getting block from head...');
  try {
    await client.getBlock().then(res => {
      console.log(res);
    });
  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
