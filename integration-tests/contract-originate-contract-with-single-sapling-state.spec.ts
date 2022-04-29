import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';
import { singleSaplingStateContract } from './data/single_sapling_state_contract';
import { singleSaplingStateContractJProtocol } from './data/single_sapling_state_contract_jakarta_michelson';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const ithacanet = protocol === Protocols.Psithaca2 ? test: test.skip;
  const jakartanetAndMondaynet = protocol === Protocols.ProtoALpha || protocol === Protocols.PtJakart2 ? test: test.skip;

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    ithacanet('Originates a contract with a single sapling state in its storage for Ithaca', async (done) => {
       const op = await Tezos.contract.originate({
        code: singleSaplingStateContract,
         init: '{}'
       });
       await op.confirmation();
       expect(op.hash).toBeDefined();
       expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
       done();
     });

    jakartanetAndMondaynet('Originates a contract with a single sapling state in its storage for JProtocol', async (done) => {
      const op = await Tezos.contract.originate({
       code: singleSaplingStateContractJProtocol,
        init: '{}'
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      done();
    });
  });
});
