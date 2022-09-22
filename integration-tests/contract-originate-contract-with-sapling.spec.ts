import { CONFIGS } from './config';
<<<<<<< HEAD
<<<<<<< HEAD
import { Protocols } from '@taquito/taquito';
import { SaplingStateAbstraction } from 'taquito/src/contract/sapling-state-abstraction';
=======
import { SaplingStateAbstraction } from '@taquito/taquito';
>>>>>>> master
=======
import { Protocols } from '@taquito/taquito';
import { SaplingStateAbstraction } from 'taquito/src/contract/sapling-state-abstraction';
>>>>>>> ed79c150dade9bdc55e907e7f374ca3cf349f71e
import {
  saplingContractDouble,
  saplingContractDrop,
  saplingContractSend,
  saplingContractStateAsArg,
  saplingContractPushSaplingState,
  saplingContractUseExistingState,
  saplingContractDoubleJProto,
  saplingContractDropJProto,
  saplingContractSendJProto,
  saplingContractUseExistingStateJProto,
} from './data/sapling_test_contracts';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  interface StorageType {
    left: SaplingStateAbstraction;
    right: SaplingStateAbstraction;
  }

  describe(`Test contract origination with sapling through contract api using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

      test('Originates a Sapling Double contract on Mondaynet', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractDoubleJProto,
        init: `(Pair {} {})`,
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      Tezos.contract.at(contract.address).then((contract) => {
        const objects = Object.keys(contract.methodsObject);
        expect(objects).toContain('default');
      });

      const storage: StorageType = await contract.storage();
      const saplingStateLedger1 = await storage.left.getSaplingDiff();

      expect(saplingStateLedger1.root).toBeDefined();
      expect(saplingStateLedger1.nullifiers.length).toEqual(0);
      expect(saplingStateLedger1.commitments_and_ciphertexts.length).toEqual(0);

      done();
    }); 

    test('Originates a Sapling Drop contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractDropJProto,
        init: { prim: 'Unit' },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      Tezos.contract.at(contract.address).then((contract) => {
        const objects = Object.keys(contract.methodsObject);
        expect(objects).toContain('default');
      });
      done();
    });

    test('Originates a Sapling Send contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractSendJProto,
        init: { prim: 'Unit' },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      Tezos.contract.at(contract.address).then((contract) => {
        const objects = Object.keys(contract.methodsObject);
        expect(objects).toContain('default');
      });
      done();
    });

    test('Originates a Sapling Contract State as Arg contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractStateAsArg,
        storage: null,
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      done();
    });

    test('Should fail to originate a Push Sapling State contract', async (done) => {
      try {
        await Tezos.contract.originate({
          code: saplingContractPushSaplingState,
          init: { prim: 'Unit' },
        });
      } catch (ex: any) {
        expect(ex.message).toMatch(
          'michelson_v1.unexpected_lazy_storage'
        );
      }
      done();
    });

    test('Originates a Use Existing State Sapling contract on Mondaynet', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractUseExistingStateJProto,
        init: `{}`,
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      Tezos.contract.at(contract.address).then((contract) => {
        const objects = Object.keys(contract.methodsObject);
        expect(objects).toContain('default');
      });

      const storage: any = await contract.storage();
      const saplingDiff = await storage.getSaplingDiff();

      expect(saplingDiff.root).toBeDefined();
      expect(saplingDiff.nullifiers.length).toEqual(0);
      expect(saplingDiff.commitments_and_ciphertexts.length).toEqual(0);
      done();
    });
  });
});
