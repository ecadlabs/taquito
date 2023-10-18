import { CONFIGS } from './config';
import { SaplingStateAbstraction } from '@taquito/taquito';
import {
  saplingContractStateAsArg,
  saplingContractPushSaplingState,
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

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    test('Originates a Sapling Double contract', async () => {
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

    });

    test('Originates a Sapling Drop contract', async () => {
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
    });

    test('Originates a Sapling Send contract', async () => {
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
    });

    test('Originates a Sapling Contract State as Arg contract', async () => {
      const op = await Tezos.contract.originate({
        code: saplingContractStateAsArg,
        storage: null,
      });

      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

    });

    test('Should fail to originate a Push Sapling State contract', async () => {
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
    });

    test('Originates a Use Existing State Sapling contract', async () => {
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
    });

  });
});