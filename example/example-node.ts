import { BigMapAbstraction, TezosToolkit } from '../packages/taquito/src/taquito';
import { RpcClient } from '../packages/taquito-rpc/src/taquito-rpc';
import { castToString } from '../packages/taquito-rpc/src/utils/utils';
import BigNumber from 'bignumber.js';

const provider = 'https://ghostnet.tezos.ecadinfra.com';

const client = new RpcClient(provider);

async function example() {
  try {
    const tezos = new TezosToolkit(provider);

    console.log('Getting storage...');
    const contract = await tezos.contract.at('KT1LRBZUde7PbmKEELT829Ts3HjownyYmW2F') // knownBigMapContract used in integration tests
    const storage = await contract.storage();
    console.log(storage);

    console.log('Getting balance...');
    const balance = await tezos.tz.getBalance('tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys');
    console.log(`${balance.toNumber() / 1000000} ꜩ`)

    console.log('Getting big map key...');

      const contractStorage: {
        ledger: BigMapAbstraction;
        owner: string;
        paused:boolean;
        totalSupply: BigNumber;
      } = await contract.storage();

      const bigMapKey = await contractStorage.ledger.get('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP');
      console.log(bigMapKey);


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

example();
