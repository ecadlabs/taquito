import { Tezos } from '@tezos-ts/tezos-ts';

async function example() {
  try {
    Tezos.setProvider({ rpc: 'https://alphanet-node.tzscan.io' });
    console.log('Getting storage...');
    await Tezos.contract.getStorage('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN').then(console.log);
    console.log('Getting balance...');
    await Tezos.tz.getBalance('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN').then(console.log);

    console.log('Getting big map key...');
    await Tezos.contract
      .getBigMapKey('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN', 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')
      .then(console.log);

    console.log('Query balance history...');
    await Tezos.query.balanceHistory('KT1DzGefKWdrwWn9HxcYtKR46todiC66bxsH', {start: '2018-09-20T03:36:47Z', end: new Date(), limit: 100}).then(console.log);
  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
