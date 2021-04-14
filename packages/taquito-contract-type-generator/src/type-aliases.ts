import { BigNumber } from 'bignumber.js';
import { MichelsonMap } from '@taquito/taquito';

export type unit = (true | undefined) & { __type: 'unit' };

export type address = string & { __type: 'address' };
export type bytes = string & { __type: 'bytes' };
export type contract = string & { __type: 'contract' };
export type operation = string & { __type: 'operation' };
export type key = string & { __type: 'key' };
export type key_hash = string & { __type: 'key_hash' };
export type signature = string & { __type: 'signature' };
export type ticket = string & { __type: 'ticket' };

export type timestamp = Date & { __type: 'timestamp' };

export type int = BigNumber & { __type: 'int' };
export type nat = BigNumber & { __type: 'nat' };

export type mutez = BigNumber & { __type: 'mutez' };
export type tez = BigNumber & { __type: 'tez' };

export type MMap<K, V> = Omit<MichelsonMap<K, V>, 'get'> & { get: (key: K) => V };
export type BigMap<K, V> = Omit<MichelsonMap<K, V>, 'get'> & { get: (key: K) => Promise<V> };


const createStringTypeTas = <T extends string>() => {
    return (value: string): T => value as T;
};

const createBigNumberTypeTas = <T extends BigNumber>() => {
    return (value: number | BigNumber | string): T => new BigNumber(value) as T;
};

type asMapParamOf<K, V> = K extends string ? { [key: string]: V } | Array<{ key: K, value: V }>
    : K extends number ? { [key: number]: V } | Array<{ key: K, value: V }>
    : Array<{ key: K, value: V }>;

function asMap<K, V>(value: asMapParamOf<K, V>): MMap<K, V> {
    const m = new MichelsonMap<K, V>();
    if (Array.isArray(value)) {
        const vArray = value as Array<{ key: K, value: V }>;
        vArray.forEach(x => m.set(x.key, x.value));
    } else {
        const vObject = value as { [key: string]: V };
        Object.keys(vObject).forEach(key => m.set(key as unknown as K, vObject[key]));
    }
    return m as MMap<K, V>;
}
const asBigMap = <K, V>(value: asMapParamOf<K, V>) => asMap(value) as unknown as BigMap<K, V>;

function add<T extends BigNumber>(a: T, b: T): T {
    return a.plus(b) as T;
}
function subtract<T extends BigNumber>(a: T, b: T): T {
    return a.minus(b) as T;
}

/** tas: Tezos 'as' casting for strict types */
export const tas = {
    address: createStringTypeTas<address>(),
    bytes: createStringTypeTas<bytes>(),
    contract: createStringTypeTas<contract>(),
    timestamp: (value: string | Date): timestamp => new Date(value) as timestamp,

    int: createBigNumberTypeTas<int>(),
    nat: createBigNumberTypeTas<nat>(),
    mutez: createBigNumberTypeTas<mutez>(),
    tez: createBigNumberTypeTas<tez>(),

    map: asMap,
    bigMap: asBigMap,

    // Operations
    add,
    subtract,

    // To number
    number: (value: string | BigNumber) => Number(value + ''),
};