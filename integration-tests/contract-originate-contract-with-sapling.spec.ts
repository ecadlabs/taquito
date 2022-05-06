import { CONFIGS } from './config';
import { Protocols } from '@taquito/taquito';
import { SaplingStateAbstraction } from 'taquito/src/contract/sapling-state-abstraction';
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

CONFIGS().forEach(({ lib, rpc, protocol, setup }) => {
  const Tezos = lib;
  const jakartanetAndMondaynet = protocol === Protocols.ProtoALpha || protocol === Protocols.PtJakart2 ? test: test.skip;
  const ithacanet = protocol === Protocols.Psithaca2 ? test : test.skip;

  interface StorageType {
    left: SaplingStateAbstraction;
    right: SaplingStateAbstraction;
  }

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    ithacanet('Originates a Sapling Double contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractDouble,
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

    jakartanetAndMondaynet('Originates a Sapling Double contract on Mondaynet', async (done) => {
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

    ithacanet('Originates a Sapling Drop contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractDrop,
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

    jakartanetAndMondaynet('Originates a Sapling Drop contract on Mondaynet', async (done) => {
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

    ithacanet('Originates a Sapling Send contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractSend,
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

    jakartanetAndMondaynet('Originates a Sapling Send contract on Mondaynet', async (done) => {
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

    ithacanet('Originates a Use Existing State Sapling contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractUseExistingState,
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

    jakartanetAndMondaynet('Originates a Use Existing State Sapling contract on Mondaynet', async (done) => {
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
