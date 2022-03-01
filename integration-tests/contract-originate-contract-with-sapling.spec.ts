import { CONFIGS } from './config';
import { BigNumber } from 'bignumber.js';
import { RpcClient, RpcClientCache } from '@taquito/rpc';
import { Protocols } from '@taquito/taquito';
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';
import { SaplingStateAbstraction } from 'taquito/src/contract/sapling-state-abstraction';
import { saplingContract } from './data/sapling_contracts';
import {
  saplingContractDouble,
  saplingContractDrop,
  saplingContractSend,
  saplingContractStateAsArg,
  saplingContractPushSaplingState,
  saplingContractUseExistingState,
} from './data/sapling_test_contracts';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const ithacanet = protocol === Protocols.Psithaca2 ? test : test.skip;
  const hangzhounet = protocol === Protocols.PtHangz2 ? test : test.skip;

  const rpcClient = new RpcClientCache(new RpcClient(rpc));

  interface StorageType {
    left: SaplingStateAbstraction;
    right: SaplingStateAbstraction;
  }

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    test('Originates a contract with sapling states in its storage', async (done) => {
      const op = await Tezos.contract.originate({
        code: saplingContract,
        storage: {
          balance: 1,
          ledger1: SaplingStateValue,
          ledger2: SaplingStateValue,
        },
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      interface StorageType {
        balance: BigNumber;
        ledger1: SaplingStateAbstraction;
        ledger2: SaplingStateAbstraction;
      }

      const storage: StorageType = await contract.storage();
      const saplingStateLedger1 = await storage.ledger1.getSaplingDiff();

      expect(saplingStateLedger1.root).toBeDefined();
      expect(saplingStateLedger1.nullifiers.length).toEqual(0);
      expect(saplingStateLedger1.commitments_and_ciphertexts.length).toEqual(0);

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

    test('Originates a Sapling Drop contract', async (done) => {
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

    test('Originates a Sapling Send contract', async (done) => {
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
