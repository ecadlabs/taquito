import { Estimate } from '@taquito/taquito';
import { CONFIGS } from './config';
CONFIGS().forEach(({ lib, rpc, setup} ) => {
  const Tezos = lib;

  describe(`Test estimation of contractCalls using ${rpc}`, () => {
    let op;
    let contractAddress: string | undefined;
    
    beforeEach(async (done) => {
      await setup(true);

      const code = `parameter nat; storage nat; code { CAR ; NIL operation ; PAIR }`;
      op = await Tezos.contract.originate({
        code,
        storage: 10
      });

      await op.confirmation();
      contractAddress = op.contractAddress;

      done();
    });

    it(`should be able to estimate a contract call`, async (done) => {
      const contract = await Tezos.contract.at(contractAddress!);
      const opEntrypoint = contract.methods.default(5);
      const estimate = await Tezos.estimate.contractCall(opEntrypoint);

      expect(estimate).toBeDefined();
      expect(estimate).toBeInstanceOf(Estimate);

      done();
    });
  });
});