import { CONFIGS } from "./config";
import { MichelsonMap } from "@taquito/taquito";
import { contractWithTxr1Address } from "./data/contract-txr1-address";
import { Protocols } from "@taquito/taquito";


CONFIGS().forEach(({ lib, setup }) => {
  const Tezos = lib;

  beforeEach(async (done) => {
    await setup();
    done();
  })
  describe('test', () => {
    type Storage = { addressSet: string[], addressMap: MichelsonMap<string, number>; }

    it('should pass with tz addresses', async (done) => {

      const initialStorage: Storage = {
        addressSet: [
          'txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL',
          'tz1LHWNoM2TgPXixyohzP9adhNCmz2Vja6Wz',
          'txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i',
          'tz2SikbT8j5B2Yu1nwygWLU2yNyLdgMyFQnG',
          'txr1YpFMKsYwTJ4YBmYqy2kw4pxCUgeQkZmwo',
          'tz3N4qSiF46pwfbuCUQ7j7vKqDCYHjcRxkC7',
        ],
        addressMap: MichelsonMap.fromLiteral({
          'txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL': 10,
          'txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i': 21,
          'tz1LHWNoM2TgPXixyohzP9adhNCmz2Vja6Wz': 100,
          'tz2SikbT8j5B2Yu1nwygWLU2yNyLdgMyFQnG': 23,
          'tz3N4qSiF46pwfbuCUQ7j7vKqDCYHjcRxkC7': 17,
        }) as MichelsonMap<string, number>
      }
      const op = await Tezos.contract.originate({
        balance: '1',
        code: contractWithTxr1Address,
        storage: initialStorage
      })
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      const storage = await contract.storage<Storage>();
      expect([...storage.addressSet].sort()).toEqual([...initialStorage.addressSet].sort());
      expect(storage.addressMap.get('txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL')?.toString()).toEqual('10')
      expect(storage.addressMap.get('tz2SikbT8j5B2Yu1nwygWLU2yNyLdgMyFQnG')?.toString()).toEqual('23')
      expect(storage.addressMap.get('txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i')?.toString()).toEqual('21');

      const newAddressSet = [
        'txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL',
        'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
        'txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i',
        'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y',
        'txr1YpFMKsYwTJ4YBmYqy2kw4pxCUgeQkZmwo',
        'KT1A87ZZL8mBKcWGr34BVsERPCJjfX82iBto',
      ]
      const setOp = await contract.methods['setAddressSet'](newAddressSet).send();
      await setOp.confirmation();
      const newSetStorage = await contract.storage<Storage>();
      expect([...newSetStorage.addressSet].sort()).toEqual([...newAddressSet].sort());

      const newAddressMap = MichelsonMap.fromLiteral({
        'txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL': 1,
        'txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i': 3,
        'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D': 5,
        'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y': 4,
        'KT1A87ZZL8mBKcWGr34BVsERPCJjfX82iBto': 2,
      }) as MichelsonMap<string, number>
      const mapOp = await contract.methods['setAddressMap'](newAddressMap).send();
      await mapOp.confirmation();
      const newMapStorage = await contract.storage<Storage>();
      expect(newMapStorage.addressMap.get('txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i')?.toString()).toEqual('3');
      expect(newMapStorage.addressMap.get('KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y')?.toString()).toEqual('4');
      expect(newMapStorage.addressMap.get('txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL')?.toString()).toEqual('1');
      expect(newMapStorage.addressMap.get('txr1bZx7qro4xNsxLhmpXfmzQojHkg8XqrUvL')).toBeUndefined();
      done();
    })
    it('should pass with KT1', async (done) => {

      const initialStorage: Storage = {
        addressSet: [
          'txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL',
          'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
          'txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i',
          'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y',
          'txr1YpFMKsYwTJ4YBmYqy2kw4pxCUgeQkZmwo',
          'KT1A87ZZL8mBKcWGr34BVsERPCJjfX82iBto',
        ],
        addressMap: MichelsonMap.fromLiteral({
          'txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL': 1,
          'txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i': 3,
          'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D': 5,
          'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y': 4,
          'KT1A87ZZL8mBKcWGr34BVsERPCJjfX82iBto': 2,
        }) as MichelsonMap<string, number>
      }
      const op = await Tezos.contract.originate({
        balance: '1',
        code: contractWithTxr1Address,
        storage: initialStorage
      })
      await op.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const contract = await op.contract();
      const storage = await contract.storage<Storage>();
      expect([...storage.addressSet].sort()).toEqual([...initialStorage.addressSet].sort());
      expect(storage.addressMap.get('KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D')?.toString()).toEqual('5');
      expect(storage.addressMap.get('txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL')?.toString()).toEqual('1');
      expect(storage.addressMap.get('KT1A87ZZL8mBKcWGr34BVsERPCJjfX82iBto')?.toString()).toEqual('2');
      const newAddressSet = [
        'txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL',
        'tz1LHWNoM2TgPXixyohzP9adhNCmz2Vja6Wz',
        'txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i',
        'tz2SikbT8j5B2Yu1nwygWLU2yNyLdgMyFQnG',
        'txr1YpFMKsYwTJ4YBmYqy2kw4pxCUgeQkZmwo',
        'tz3N4qSiF46pwfbuCUQ7j7vKqDCYHjcRxkC7',
      ]
      const setOp = await contract.methods['setAddressSet'](newAddressSet).send();
      await setOp.confirmation();
      const newSetStorage = await (await contract.storage<Storage>()).addressSet;
      expect([...newSetStorage].sort()).toEqual([...newAddressSet].sort());

      const newAddressMap = MichelsonMap.fromLiteral({
        'txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL': 10,
        'txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i': 21,
        'tz1LHWNoM2TgPXixyohzP9adhNCmz2Vja6Wz': 100,
        'tz2SikbT8j5B2Yu1nwygWLU2yNyLdgMyFQnG': 23,
        'tz3N4qSiF46pwfbuCUQ7j7vKqDCYHjcRxkC7': 17,
      }) as MichelsonMap<string, number>
      const mapOp = await contract.methods['setAddressMap'](newAddressMap).send();
      await mapOp.confirmation();
      const newMapStorage = await (await contract.storage<Storage>()).addressMap
      expect(newMapStorage.get('txr1jZaQfi9zdwzJteYkRBSN9D7RDvMh1QNkL')?.toString()).toEqual('10');
      expect(newMapStorage.get('tz2SikbT8j5B2Yu1nwygWLU2yNyLdgMyFQnG')?.toString()).toEqual('23');
      expect(newMapStorage.get('tz1LHWNoM2TgPXixyohzP9adhNCmz2Vja6Wz')?.toString()).toEqual('100');
      expect(newMapStorage.get('txr1X9N7MQfJENXxAFGpgxv17z1A9ntGMdQ6i')?.toString()).toEqual('21');
      expect(newMapStorage.get('txr1YpFMKsYwTJ4YBmYqy2kw4pxCUgeQkZmwo')).toBeUndefined();
      done();
    })
  })
})
