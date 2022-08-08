import { CONFIGS } from './config';
import { singleSaplingStateContractJProtocol } from './data/single_sapling_state_contract_jakarta_michelson';

CONFIGS().forEach(({ lib, rpc, setup}) => {
  const Tezos = lib;
<<<<<<< HEAD
=======
  const kathmandunet = protocol === Protocols.PtKathma ? test: test.skip;
  const jakartanetAndMondaynet = protocol === Protocols.ProtoALpha || protocol === Protocols.PtJakart2 ? test: test.skip;
>>>>>>> 020b74181 (initial rendition of intengration tests change to kathmandunet)

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

<<<<<<< HEAD
    test('Originates a contract with a single sapling state in its storage', async (done) => {
=======
    kathmandunet('Originates a contract with a single sapling state in its storage for kathmandu', async (done) => {
>>>>>>> 020b74181 (initial rendition of intengration tests change to kathmandunet)
       const op = await Tezos.contract.originate({
        code: singleSaplingStateContractJProtocol,
         init: '{}'
       });
       await op.confirmation();
       expect(op.hash).toBeDefined();
       expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
       const contract = await op.contract();
<<<<<<< HEAD
=======
       console.log(contract.address)
>>>>>>> 020b74181 (initial rendition of intengration tests change to kathmandunet)
       done();
     });
  });
});
