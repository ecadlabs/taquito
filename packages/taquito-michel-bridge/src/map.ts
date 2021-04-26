import { util } from "@taquito/michel-codec";

export class MichelsonMap<K, V> implements Map<K, V> {
    private _values = new Map<string, [K, V]>();

    constructor(iterable: Iterable<readonly [K, V]> | null) {
        if (iterable) {
            for (const [k, v] of iterable) {
                this.set(k, v);
            }
        }
    }

    private stringify(v: unknown): string {
        return util.stringify(v);
    };

    /**
     * Set a key and a value in the MichelsonMap. If the key already exists, override the current value.
     * 
     * @param key The key of the element to add to the MichelsonMap object.
     * @param value The value of the element to add to the MichelsonMap object.
     * @returns The MichelsonMap object.
     * 
     * Examples:
     * ```
     * map.set("myKey", "myValue") // Using a string as key
     * map.set({0: "test", 1: "test1"}, "myValue") // Using a pair as key
     * ```
     *
     * The same key can be represented in multiple ways, depending on the type of the key. This duplicate key situation will cause a runtime error (duplicate key) when sending the map data to the Tezos RPC node.
     * For example, consider a contract with a map whose key is of type boolean.  If you set the following values in MichelsonMap: map.set(false, "myValue") and map.set(null, "myValue").
     * You will get two unique entries in the MichelsonMap. These values will both be evaluated as falsy by the MichelsonEncoder and ultimately rejected by the Tezos RPC.
     */
    set(key: K, value: V): this {
        const strKey = this.stringify(key);
        this._values.set(strKey, [key, value]);
        return this;
    }

    /**
     * Return a specified element from a Map object.
     * 
     * @param key The key of the element to return from the MichelsonMap object.
     * @returns The element associated with the specified key, or undefined if the key can't be found in the MichelsonMap object.
     */
    get(key: K): V | undefined {
        const v = this._values.get(this.stringify(key));
        return v ? v[1] : undefined;
    }

    /**
     * Return a boolean indicating whether an element with the specified key exists or not.
     * @param key The key of the element to return from the MichelsonMap object.
     * @returns true if an element with the specified key exists in the MichelsonMap object; otherwise false.
     */
    has(key: K): boolean {
        return this._values.has(this.stringify(key));
    }

    /**
     * 
     * @param key The key of the element to remove from the MichelsonMap object.
     * @returns true if an element in the MichelsonMap object existed and has been removed, or false if the element does not exist.
     */
    delete(key: K): boolean {
        return this._values.delete(this.stringify(key));
    }

    /**
     * Executes a provided function once per each key/value pair in the Map object, in insertion order.
     * @param callbackfn Function to execute for each entry.
     * @param thisArg Value to use as this when executing callback.
     */
    forEach(callbackfn: (value: V, key: K, map: MichelsonMap<K, V>) => void, thisArg?: any): void {
        for (const [_ks, kv] of this._values) {
            callbackfn.call(thisArg, kv[1], kv[0], this);
        }
    }

    get size(): number {
        return this._values.size;
    }

    clear(): void {
        this._values.clear();
    }

    /** Returns an iterable of entries in the map. */
    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    *entries(): IterableIterator<[K, V]> {
        for (const [_ks, kv] of this._values) {
            yield kv;
        }
    }

    /**
     * Returns an iterable of keys in the map
     */
    *keys(): IterableIterator<K> {
        for (const [_ks, kv] of this._values) {
            yield kv[0];
        }
    }

    /**
     * Returns an iterable of values in the map
     */
    *values(): IterableIterator<V> {
        for (const [_ks, kv] of this._values) {
            yield kv[1];
        }
    }

    get [Symbol.toStringTag](): string {
        return "Map";
    }
}