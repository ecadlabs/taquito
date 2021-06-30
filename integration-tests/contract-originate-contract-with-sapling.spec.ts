import { CONFIGS } from './config';
import { SaplingStateValue } from '../packages/taquito-michelson-encoder/src/taquito-michelson-encoder';
import { saplingContract } from './data/sapling_contracts';
import BigNumber from 'bignumber.js';
import { SaplingStateAbstraction } from 'taquito/src/contract/sapling-state-abstraction';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  describe(`Test origination of contracts with sapling using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    test('Originates a contract with sapling states in its storage', 2, async (done: () => void) => {
      const op = await Tezos.contract.originate({
        code: saplingContract,
        storage: {
          balance: 1,
          ledger1: SaplingStateValue,
          ledger2: SaplingStateValue
        }
      });
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract()
      interface StorageType {
        balance: BigNumber,
        ledger1: SaplingStateAbstraction,
        ledger2: SaplingStateAbstraction
      }

      const storage: StorageType = await contract.storage();
      const saplingStateLedger1 = await storage.ledger1.getSaplingDiff();

      expect(saplingStateLedger1.root).toBeDefined();
      expect(saplingStateLedger1.nullifiers.length).toEqual(0);
      expect(saplingStateLedger1.commitments_and_ciphertexts.length).toEqual(0);

      done();
    });
  });
});
