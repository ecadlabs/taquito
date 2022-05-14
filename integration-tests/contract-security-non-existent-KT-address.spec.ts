import { CONFIGS } from './config';
import { RpcClient } from '@taquito/rpc';
import { TezosToolkit } from '@taquito/taquito';

// non-existing KT addresses can not be prefunded

// KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn is the tzBTC contract on mainnet

const Tezos = new TezosToolkit(new RpcClient(' https://ithacanet.ecadinfra.com'));
const testContractAddress = 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn';

CONFIGS().forEach(({ rpc, setup }) => {

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();

      done();
    });

    it('Verify that you cannot prefund a non existent smart contract', async () => {
      try {
        await Tezos.contract.at(testContractAddress);
      } catch (error: any) {
        // Contract Address cannot be prefunded because it cannot be loaded into Taquito
        expect(error.message).toContain('Http error response: (404)');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/Inference/TezosSecurityBaselineCheckingFramework
