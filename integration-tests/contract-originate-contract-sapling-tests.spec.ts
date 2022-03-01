import { RpcClient, RpcClientCache } from '@taquito/rpc';
import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';
import { saplingContractDouble } from './data/sapling_test_contracts';
import { saplingContractDrop } from './data/sapling_test_contracts';
import { saplingContractSend } from './data/sapling_test_contracts';
import { saplingContractStateAsArg } from './data/sapling_test_contracts';
import { saplingContractPushSaplingState } from './data/sapling_test_contracts';
import { saplingContractUseExistingState } from './data/sapling_test_contracts';
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';
import { SaplingStateAbstraction } from '../packages/taquito/src/contract/sapling-state-abstraction';
import { char2Bytes } from '@taquito/utils';
import { isNull } from './jest-stare/js/holder';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const ithacanet = protocol === Protocols.Psithaca2 ? test : test.skip;
  const hangzhounet = protocol === Protocols.PtHangz2 ? test : test.skip;

  const rpcClient = new RpcClientCache(new RpcClient(rpc));

  interface StorageType {
    left: SaplingStateAbstraction;
    right: SaplingStateAbstraction;
  }

  describe(`Test origination of various contracts and their storages with sapling using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    test('Originates a Sapling Double contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractDouble,
        init: `(Pair {} {})`,
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      const saplingDiffById = await rpcClient.getSaplingDiffById('168');
      expect(saplingDiffById).toBeDefined();

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

    // In this test we try a contract which creates an empty sapling state on the
    //  fly. It then applies a list of transactions, checks they are correct and
    //  drops the result. We make several shields in the same list (since the state
    //  is drop).
    test('Originates a Sapling Drop contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractDrop,
        init: { prim: 'Unit' },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      const saplingDiffById = await rpcClient.getSaplingDiffById('168');
      expect(saplingDiffById).toBeDefined();

      Tezos.contract.at(contract.address).then((contract) => {
        const objects = Object.keys(contract.methodsObject);
        expect(objects).toContain('default');
      });

      done();
    });

    test('Originates a Sapling Send contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractSend,
        init: { prim: 'Unit' },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      const saplingDiffById = await rpcClient.getSaplingDiffById('168');
      expect(saplingDiffById).toBeDefined();

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
      const contract = await op.contract();

      const saplingDiffById = await rpcClient.getSaplingDiffById('168');
      expect(saplingDiffById).toBeDefined();
      done();
    });

    hangzhounet('Should fail to originate a Push Sapling State contract', async (done) => {
      try {
        const op = await Tezos.contract.originate({
          code: saplingContractPushSaplingState,
          init: { prim: 'Unit' },
        });
      } catch (ex: any) {
        expect(ex.message).toMatch(
          '(permanent) proto.011-PtHangz2.michelson_v1.unexpected_lazy_storage'
        );
      }
      done();
    });

    ithacanet('Should fail to originate a Push Sapling State contract', async (done) => {
      try {
        const op = await Tezos.contract.originate({
          code: saplingContractPushSaplingState,
          init: { prim: 'Unit' },
        });
      } catch (ex: any) {
        expect(ex.message).toMatch(
          '(permanent) proto.012-Psithaca.michelson_v1.unexpected_lazy_storage'
        );
      }
      done();
    });

    test('Originates a Use Existing State Sapling contract', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContractUseExistingState,
        init: `{}`,
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await op.contract();

      const saplingDiffById = await rpcClient.getSaplingDiffById('168');
      expect(saplingDiffById).toBeDefined();

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
