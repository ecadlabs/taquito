import { MichelsonMap } from '../src/michelson-map';

describe('Michelson map', () => {
  describe('get', () => {
    it('return undefined when key is not present', () => {
      const map = new MichelsonMap();
      expect(map.get('test')).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should add a key if it does not exist', () => {
      const map = new MichelsonMap();

      map.set('test', 'test');
      expect(map.get('test')).toEqual('test');
      expect(map.size).toEqual(1);
    });

    it('should override a key if it does not exist', () => {
      const map = new MichelsonMap();

      map.set('test', 'test');
      map.set('test', 'test1');
      expect(map.get('test')).toEqual('test1');
      expect(map.size).toEqual(1);
    });
  });

  describe('set with typecheck', () => {
    it('should throw an error if value is not compliant to michelson type', () => {
      const map = new MichelsonMap({ prim: 'map', args: [{ prim: 'int' }, { prim: 'address' }] });

      expect(() => map.set('10', 'test')).toThrow(/value/);
    });

    it('should throw an error if key is not compliant to michelson type', () => {
      const map = new MichelsonMap({ prim: 'map', args: [{ prim: 'int' }, { prim: 'string' }] });

      expect(() => map.set('test', 'a valid value')).toThrow(/key/);
    });
  });

  describe('fromLiteral', () => {
    it('it return an empty map given an empty object', () => {
      const map = MichelsonMap.fromLiteral({});
      expect(map.size).toEqual(0);
    });

    it('it return a map with one key given a object with one property', () => {
      const map = MichelsonMap.fromLiteral({ test: 'value' });
      expect(map.size).toEqual(1);
      expect(map.get('test')).toEqual('value');
    });
  });

  describe('iterators', () => {
    it('return nothing for empty map', () => {
      const map = new MichelsonMap();

      expect(Array.from(map.entries())).toEqual([]);
      expect(Array.from(map.values())).toEqual([]);
      expect(Array.from(map.keys())).toEqual([]);
    });
    it('return all entries', () => {
      const map = new MichelsonMap();

      map.set('key', 'value');
      map.set('key2', 'value2');

      expect(Array.from(map.entries())).toEqual([['key', 'value'], ['key2', 'value2']]);
      expect(Array.from(map.values())).toEqual(['value', 'value2']);
      expect(Array.from(map.keys())).toEqual(['key', 'key2']);
    });
  });

  describe('has', () => {
    it('return true if key is present', () => {
      const map = new MichelsonMap();

      map.set('key', 'value');

      expect(map.has('key')).toEqual(true);
    });

    it('return false if key is not present', () => {
      const map = new MichelsonMap();

      expect(map.has('key')).toEqual(false);
    });
  });

  describe('delete', () => {
    it('deleting key should remove it', () => {
      const map = new MichelsonMap();

      map.set('key', 'value');
      expect(map.has('key')).toEqual(true);
      map.delete('key');
      expect(map.has('key')).toEqual(false);
    });

    it('deleting key should remove a specific key', () => {
      const map = new MichelsonMap();

      map.set('key', 'value');
      map.set('key1', 'value');
      expect(map.has('key')).toEqual(true);
      expect(map.has('key1')).toEqual(true);
      map.delete('key');
      expect(map.has('key')).toEqual(false);
      expect(map.has('key1')).toEqual(true);
    });

    it('delete a non-existing key should do nothing', () => {
      const map = new MichelsonMap();

      expect(map.size).toEqual(0);
      map.delete('key');
      expect(map.size).toEqual(0);
    });
  });
});
