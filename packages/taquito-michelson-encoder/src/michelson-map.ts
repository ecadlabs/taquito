import { MichelsonV1Expression } from "@taquito/rpc";

type MichelsonMapKey = Array<any> | Object | string | boolean | number;

export class MichelsonMap<K extends MichelsonMapKey, T> {
  private valueMap = new Map<string, T>();
  private keyMap = new Map<string, K>();

  static fromLiteral(obj: { [key: string]: any }) {
    const map = new MichelsonMap();
    Object.keys(obj).forEach((key) => {
      map.set(key, obj[key])
    })
    return map;
  }

  private stringify(key: K) {
    if (Array.isArray(key)) {
      key.reduce((prev, current) => {
        return prev + current;
      }, '')
    } else if (typeof key === 'object') {
      return Object.keys((key)).sort().reduce((prev, current) => {
        return prev + `${current}#${(key as any)[current]}`;
      }, '')
    } else {
      return key.toString()
    }
  }

  typecheck(_type: MichelsonV1Expression) {
    return true;
  }

  *keys(): Generator<K> {
    for (const [, value] of this.keyMap.entries()) {
      yield value;
    }
  }

  *entries(): Generator<[K, T]> {
    for (const key of this.valueMap.keys()) {
      yield [this.keyMap.get(key)!, this.valueMap.get(key)!];
    }
  }

  get(key: K): T | undefined {
    const strKey = this.stringify(key);
    return this.valueMap.get(strKey!);
  }

  set(key: K, value: T) {
    const strKey = this.stringify(key);
    this.keyMap.set(strKey!, key);
    this.valueMap.set(strKey!, value);
  }
}
