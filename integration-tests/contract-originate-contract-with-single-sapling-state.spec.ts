import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';
import { singleSaplingStateContract } from './data/single_sapling_state_contract';
import { singleSaplingStateContractHangzhou } from './data/single_sapling_state_contract_hangzhou';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const skipIthacanet = protocol === Protocols.Psithaca2 ? test.skip : test;
  const skipHangzhounet = protocol === Protocols.PtHangz2 ? test.skip : test;

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

     skipHangzhounet('Originates a contract with a single sapling state in its storage for Ithaca', async (done: () => void) => {
       const op = await Tezos.contract.originate({
        code: singleSaplingStateContract,
         init: '{}'
       });
       await op.confirmation();
       expect(op.hash).toBeDefined();
       expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

       const contract = await op.contract()

       console.log("Single Sapling State Contract address on Ithacanet "+contract.address)

       // const storage = await contract.storage();
       // const saplingStateLedger1 = await storage.ledger1.getSaplingDiff();

       // expect(saplingStateLedger1.root).toBeDefined();
       // expect(saplingStateLedger1.nullifiers.length).toEqual(0);
       // expect(saplingStateLedger1.commitments_and_ciphertexts.length).toEqual(0);

       done();
     });

    skipIthacanet('Originates a contract with a single sapling state in its storage for Hangzhou', async (done: () => void) => {
      const op = await Tezos.contract.originate({
        code: singleSaplingStateContractHangzhou,
        init: '{}'
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract()

      console.log("Single Sapling State Contract address on Hangzhounet "+contract.address)

      // const storage = await contract.storage();
      // const saplingStateLedger1 = await storage.ledger1.getSaplingDiff();

      // expect(saplingStateLedger1.root).toBeDefined();
      // expect(saplingStateLedger1.nullifiers.length).toEqual(0);
      // expect(saplingStateLedger1.commitments_and_ciphertexts.length).toEqual(0);

      done();
    });
  });
});
