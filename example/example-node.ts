import { TezosToolkit } from '../packages/taquito/src/taquito';
import { RpcClient } from '../packages/taquito-rpc/src/taquito-rpc';
import { castToString } from '../packages/taquito-rpc/src/utils/utils';

const provider = 'https://api.tez.ie/rpc/granadanet';
const client = new RpcClient(provider);

async function example() {
  try {
    const tezos = new TezosToolkit(provider);

    console.log('Getting storage...');
    await tezos.contract.at('KT1VyQwS4oZAdYxuWmMNqJ6CtJFtXQbLZDjJ').then(async contract => { // knownBigMapContract used in integration tests
      const storage = await contract.storage()
      console.log(storage)
    });

    console.log('Getting balance...');
    await tezos.tz.getBalance('tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw').then(balance => {
      console.log(`${balance.toNumber() / 1000000} ꜩ`)
    });

    console.log('Getting big map key...');
    await tezos.contract.at('KT1W1jh5C5NbcVVvpnBLQT9ekMbR5a8fg6mc').then(async contract => {
      const contractStorage = await contract.storage();
      const bigMapKey = await (contractStorage as any).ledger.get('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP')
      console.log(bigMapKey)
    });

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
