import { CONFIGS } from './config';
import { RpcClient } from '@taquito/rpc';
import { Protocols, TezosToolkit } from '@taquito/taquito';

// TC001 - non-existing KT addresses can not be prefunded

// KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn is the tzBTC contract on mainnet

const testContractAddress = 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn';

CONFIGS().forEach(({ rpc, setup, protocol }) => {
  const weeklynet = protocol === Protocols.ProtoALpha ? test : test.skip;
  const Tezos = new TezosToolkit(new RpcClient(rpc));

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();

    });

    weeklynet('Verify that you cannot prefund a non existent smart contract', async () => {
      try {
        await Tezos.contract.at(testContractAddress);
      } catch (error: any) {
        // Contract Address cannot be prefunded because it cannot be loaded into Taquito
        expect(error.message).toContain('Http error response: (404)');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
