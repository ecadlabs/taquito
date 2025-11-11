/**
 *
 * @param leaves nodes in the tree that we would like to make pairs from
 * @returns a paired/chunked array: [a, b, c, d] => [[a, b], [c, d]]
 */
export declare function pairNodes<T>(leaves: T[]): (T | undefined)[][];
/**
 * @description helper function to assist in Lazy initializing an object
 */
export declare class Lazy<T> {
    private readonly init;
    private isInitialized;
    private value?;
    constructor(init: () => Promise<T>);
    get(): Promise<T>;
}
/**
 *
 * @param hex hexadecimal string we would like to swap
 * @returns a hexadecimal string with swapped endians
 */
export declare const changeEndianness: (hex: string) => string;
