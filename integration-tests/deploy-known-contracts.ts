import { MichelsonMap } from '@taquito/taquito';
import { knownContract } from '../example/data/knownContract';
import { knownBigMapContract } from '../example/data/knownBigMapContract';
import { CONFIGS } from './config';

export async function deployContract() {
  CONFIGS().forEach( async ({ lib, rpc, setup }) => {
    const Tezos = lib;

    await setup(true);

    try {
      console.log('Deploying the knownContract...');
      const opknownContract = await tezos.contract.originate({
        balance: '0',
        code: knownContract,
        init: {
          prim: 'Pair',
          args: [
            { int: '0' },
            {
              prim: 'Pair',
              args: [
                { int: '1' },
                [{ bytes: '005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' }],
              ],
            },
          ],
        },
      });
      console.log('Awaiting confirmation...');
      const contractknownContract = await opknownContract.contract();
      console.log('The address of the knownContract is: ', contractknownContract.address);

      return contractknownContract.address;
    } catch (ex) {
      console.error(ex);
    }
  });
}

export async function deployBigMapContract() {
  CONFIGS().forEach( async ({ lib, rpc, setup }) => {
    const Tezos = lib;

    await setup(true);

    try {
      console.log('Deploying the knownBigMapContract...');
      const allowances = new MichelsonMap();
      const ledger = new MichelsonMap();
      ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '1' });
  
      const opknownBigMapContract = await tezos.contract.originate({
        code: knownBigMapContract,
        storage: {
          ledger,
          owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
          paused: true,
          totalSupply: '1',
        },
      });
      console.log('Awaiting confirmation...');
      const contractknownBigMapContract = await opknownBigMapContract.contract();
      console.log('The address of the knownBigMapContract is: ', contractknownBigMapContract.address);
      return contractknownBigMapContract.address
    } catch (ex) {
      console.error(ex);
    }
  });
}
