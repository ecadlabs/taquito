import { MichelsonV1Expression } from '@taquito/rpc';
import { Schema } from './schema/storage';
import stringify from 'fast-json-stable-stringify';

// Retrieve a unique symbol associated with the key from the environment
// Used in order to identify all object that are of type MichelsonMap even if they come from different module
const michelsonMapTypeSymbol = Symbol.for('taquito-michelson-map-type-symbol');

export type MichelsonMapKey = Array<any> | object | string | boolean | number;

const isMapType = (
  value: MichelsonV1Expression
): value is { prim: 'map' | 'big_map'; args: [MichelsonV1Expression, MichelsonV1Expression] } => {
  return 'args' in value && Array.isArray(value.args) && value.args.length === 2;
};

export class MapTypecheckError extends Error {
  name = 'MapTypecheckError';

  constructor(public readonly value: any, public readonly type: any, errorType: 'key' | 'value') {
    super(`${errorType} not compliant with underlying michelson type`);
  }
}

/**
 * @description Michelson Map is an abstraction over the michelson native map. It supports complex Pair as key
 */
export class MichelsonMap<K extends MichelsonMapKey, T> {
  private valueMap = new Map<string, T>();
  private keyMap = new Map<string, K>();

  public [michelsonMapTypeSymbol] = true;

  // Used to check if an object is a michelson map.
  // Using instanceof was not working for project that had multiple instance of taquito dependencies
  // as the class constructor is different
  static isMichelsonMap(obj: any): obj is MichelsonMap<any, any> {
    return obj && obj[michelsonMapTypeSymbol] === true;
  }

  private keySchema?: Schema;
  private valueSchema?: Schema;

  /**
   * @param mapType If specified key and value will be type-checked before being added to the map
   *
   * @example new MichelsonMap({ prim: "map", args: [{prim: "string"}, {prim: "int"}]})
   */
  constructor(mapType?: MichelsonV1Expression) {
    if (mapType) {
      this.setType(mapType);
    }
  }

  setType(mapType: MichelsonV1Expression) {
    if (!isMapType(mapType)) {
      throw new Error('mapType is not a valid michelson map type');
    }

    this.keySchema = new Schema(mapType.args[0]);
    this.valueSchema = new Schema(mapType.args[1]);
  }

  removeType() {
    this.keySchema = undefined;
    this.valueSchema = undefined;
  }

  static fromLiteral(obj: { [key: string]: any }, mapType?: MichelsonV1Expression) {
    const map = new MichelsonMap(mapType);
    Object.keys(obj).forEach((key) => {
      map.set(key, obj[key]);
    });
    return map;
  }

  private typecheckKey(key: K) {
    if (this.keySchema) {
      return this.keySchema.Typecheck(key);
    }

    return true;
  }

  private typecheckValue(value: T) {
    if (this.valueSchema) {
      return this.valueSchema.Typecheck(value);
    }

    return true;
  }

  private assertTypecheckValue(value: T) {
    if (!this.typecheckValue(value)) {
      throw new MapTypecheckError(value, this.valueSchema, 'value');
    }
  }

  private assertTypecheckKey(key: K) {
    if (!this.typecheckKey(key)) {
      throw new MapTypecheckError(key, this.keySchema, 'key');
    }
  }

  private serializeDeterministically(key: K): string {
    return stringify(key);
  }

  *keys(): Generator<K> {
    for (const [key] of this.entries()) {
      yield key;
    }
  }

  *values(): Generator<T> {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }

  *entries(): Generator<[K, T]> {
    for (const key of this.valueMap.keys()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      yield [this.keyMap.get(key)!, this.valueMap.get(key)!];
    }
  }

  get(key: K): T | undefined {
    this.assertTypecheckKey(key);

    const strKey = this.serializeDeterministically(key);
    return this.valueMap.get(strKey);
  }

  /**
   *
   * @description Set a key and a value in the MichelsonMap. If the key already exists, override the current value.
   *
   * @example map.set("myKey", "myValue") // Using a string as key
   *
   * @example map.set({0: "test", 1: "test1"}, "myValue") // Using a pair as key
   *
   * @warn The same key can be represented in multiple ways, depending on the type of the key. This duplicate key situation will cause a runtime error (duplicate key) when sending the map data to the Tezos RPC node.
   *
   * For example, consider a contract with a map whose key is of type boolean.  If you set the following values in MichelsonMap: map.set(false, "myValue") and map.set(null, "myValue").
   *
   * You will get two unique entries in the MichelsonMap. These values will both be evaluated as falsy by the MichelsonEncoder and ultimately rejected by the Tezos RPC.
   */
  set(key: K, value: T) {
    this.assertTypecheckKey(key);
    this.assertTypecheckValue(value);

    const strKey = this.serializeDeterministically(key);
    this.keyMap.set(strKey, key);
    this.valueMap.set(strKey, value);
  }

  delete(key: K) {
    this.assertTypecheckKey(key);

    this.keyMap.delete(this.serializeDeterministically(key));
    this.valueMap.delete(this.serializeDeterministically(key));
  }

  has(key: K) {
    this.assertTypecheckKey(key);

    const strKey = this.serializeDeterministically(key);
    return this.keyMap.has(strKey) && this.valueMap.has(strKey);
  }

  clear(): void {
    this.keyMap.clear();
    this.valueMap.clear();
  }

  get size() {
    return this.keyMap.size;
  }

  forEach(cb: (value: T, key: K, map: MichelsonMap<K, T>) => void) {
    for (const [key, value] of this.entries()) {
      cb(value, key, this);
    }
  }
}
