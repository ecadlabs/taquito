import { MichelsonV1Expression } from '@taquito/rpc';
import { Schema } from './schema/storage';

export type MichelsonMapKey = Array<any> | Object | string | boolean | number;

const isMapType = (
  value: MichelsonV1Expression
): value is { prim: 'map' | 'big_map'; args: [MichelsonV1Expression, MichelsonV1Expression] } => {
  return 'args' in value && Array.isArray(value.args) && value.args.length === 2;
};

export class MapTypecheckError implements Error {
  name: string = 'MapTypecheckError';
  message: string;

  constructor(public readonly value: any, public readonly type: any, errorType: 'key' | 'value') {
    this.message = `${errorType} not compliant with underlying michelson type`;
  }
}

/**
 * @description Michelson Map is an abstraction over the michelson native map. It support complex Pair as key
 */
export class MichelsonMap<K extends MichelsonMapKey, T extends any> {
  private valueMap = new Map<string, T>();
  private keyMap = new Map<string, K>();

  private keySchema?: Schema;
  private valueSchema?: Schema;

  /**
   * @param mapType If specified key and value will be type checked before being added to the map
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
    Object.keys(obj).forEach(key => {
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

  private serialize(key: K): string {
    if (Array.isArray(key)) {
      return key.reduce((prev, current) => {
        return prev + current;
      }, '');
    } else if (typeof key === 'object') {
      return Object.keys(key)
        .sort()
        .reduce((prev, current) => {
          return prev + `@${current}#${(key as any)[current]}`;
        }, '');
    } else {
      return key.toString();
    }
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
      yield [this.keyMap.get(key)!, this.valueMap.get(key)!];
    }
  }

  get(key: K): T | undefined {
    this.assertTypecheckKey(key);

    const strKey = this.serialize(key);
    return this.valueMap.get(strKey);
  }

  /**
   *
   * @description Set a key and a value value in the MichelsonMap. If the key already exists override the existing value.
   *
   * @example map.set({0: "test", 1: "test1"}, "myValue")
   *
   * @warn Depending on the key type the same key can be represented in multiple different way which could cause runtime error
   * For instance a boolean key type can be express in these different ways map.set(false, "myValue") or map.set(null, "myValue")
   */
  set(key: K, value: T) {
    this.assertTypecheckKey(key);
    this.assertTypecheckValue(value);

    const strKey = this.serialize(key);
    this.keyMap.set(strKey, key);
    this.valueMap.set(strKey, value);
  }

  delete(key: K) {
    this.assertTypecheckKey(key);

    this.keyMap.delete(this.serialize(key));
    this.valueMap.delete(this.serialize(key));
  }

  has(key: K) {
    this.assertTypecheckKey(key);

    const strKey = this.serialize(key);
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
