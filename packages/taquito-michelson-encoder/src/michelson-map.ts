import { MichelsonV1Expression } from '@taquito/rpc';
import { Schema } from './schema/storage';
import stringify from 'fast-json-stable-stringify';
import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates an invalid map type being passed or used
 */
export class InvalidMapTypeError extends TaquitoError {
  constructor(public readonly mapType: any, public readonly reason: string) {
    super();
    this.message = `The map type '${JSON.stringify(mapType)}' is invalid. Reason: ${reason}.`;
    this.name = 'InvalidMapTypeError';
  }
}

// Retrieve a unique symbol associated with the key from the environment
// Used in order to identify all object that are of type MichelsonMap even if they come from different module
const michelsonMapTypeSymbol = Symbol.for('taquito-michelson-map-type-symbol');

export type MichelsonMapKey = Array<any> | object | string | boolean | number | null;

/**
 *
 * @throws {@link InvalidMapTypeError} when the argument passed to mapType is not a valid map type
 */
function validateMapType(value: MichelsonV1Expression): asserts value is {
  prim: 'map' | 'big_map';
  args: [MichelsonV1Expression, MichelsonV1Expression];
} {
  if (!('prim' in value)) {
    throw new InvalidMapTypeError(value, `Missing 'prim' field`);
  }
  if (!['map', 'big_map'].includes(value.prim)) {
    throw new InvalidMapTypeError(value, `The prim field should be 'map' or 'big_map'`);
  }
  if (!('args' in value)) {
    throw new InvalidMapTypeError(value, `Missing 'args' field`);
  }
  if (!Array.isArray(value.args)) {
    throw new InvalidMapTypeError(value, `The 'args' field should be an array`);
  }
  if (value.args.length !== 2) {
    throw new InvalidMapTypeError(value, `The 'args' field should have 2 elements`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a map type mismatch, where an attempt to set a key or value in a Map doesn't match the defined type of the Map
 */
export class MapTypecheckError extends TaquitoError {
  name = 'MapTypecheckError';

  constructor(
    public readonly value: any,
    public readonly type: any,
    objectType: 'key' | 'value',
    public readonly reason: any
  ) {
    super();
    this.message = `The ${objectType} provided: ${JSON.stringify(
      value
    )} is not compatible with the expected michelson type: ${JSON.stringify(
      type
    )}. Reason: ${JSON.stringify(reason)}.`;
    this.name = 'MapTypecheckError';
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
    validateMapType(mapType);

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
    if (!this.keySchema) {
      return;
    }
    if (!this.keySchema.Typecheck(key)) {
      throw new MapTypecheckError(key, this.keySchema, 'key', 'Type validation failed');
    }
  }

  private typecheckValue(value: T) {
    if (!this.valueSchema) {
      return;
    }
    if (!this.valueSchema.Typecheck(value)) {
      throw new MapTypecheckError(value, this.valueSchema, 'value', 'Type validation failed');
    }
  }

  /**
   * @throws {@link MapTypecheckError} when the argument passed does not match the expected schema for value
   */
  private assertTypecheckValue(value: T) {
    this.typecheckValue(value);
  }

  /**
   * @throws {@link MapTypecheckError} when the argument passed does not match the expected schema for key
   */
  private assertTypecheckKey(key: K) {
    this.typecheckKey(key);
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
