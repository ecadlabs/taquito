import { Tezos } from '../packages/taquito/src/taquito';
import { RpcClient } from '../packages/taquito-rpc/src/taquito-rpc';
import { castToString } from '../packages/taquito-rpc/src/utils/utils';

const provider = 'https://api.tez.ie/rpc/carthagenet';
const client = new RpcClient(provider);

async function example() {
  try {
    Tezos.setProvider({ rpc: provider });

    console.log('Getting storage...');
    await Tezos.contract.at('KT1HqWsXrGbHWc9muqkApqWu64WsxCU3FoRf').then(async contract => {
      const storage = await contract.storage()
      console.log(storage)
    });

    console.log('Getting balance...');
    await Tezos.tz.getBalance('tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw').then(balance => {
      console.log(`${balance.toNumber() / 1000000} ꜩ`)
    });

    console.log('Getting big map key...');
    await Tezos.contract.at('KT1HqWsXrGbHWc9muqkApqWu64WsxCU3FoRf').then(async contract => {
      const contractStorage = await contract.storage();
      const bigMapKey = await (contractStorage as any).ledger.get('tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx')
      console.log(bigMapKey)
    });

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
