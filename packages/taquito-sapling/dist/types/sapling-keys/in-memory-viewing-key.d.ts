/**
 * @description Holds the viewing key
 */
export declare class InMemoryViewingKey {
    #private;
    constructor(fullViewingKey: string);
    /**
     * @description Allows to instantiate the InMemoryViewingKey from an encrypted/unencrypted spending key
     *
     * @param spendingKey Base58Check-encoded spending key
     * @param password Optional password to decrypt the spending key
     * @example
     * ```
     * await InMemoryViewingKey.fromSpendingKey('sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L')
     * ```
     *
     */
    static fromSpendingKey(spendingKey: string, password?: string): Promise<InMemoryViewingKey>;
    /**
     * @description Retrieve the full viewing key
     * @returns Buffer representing the full viewing key
     *
     */
    getFullViewingKey(): Buffer;
    /**
     * @description Retrieve the outgoing viewing key
     * @returns Buffer representing the outgoing viewing key
     *
     */
    getOutgoingViewingKey(): Promise<Buffer>;
    /**
     * @description Retrieve the incoming viewing key
     * @returns Buffer representing the incoming viewing key
     *
     */
    getIncomingViewingKey(): Promise<Buffer>;
    /**
     * @description Retrieve a payment address
     * @param addressIndex used to determine which diversifier should be used to derive the address, default is 0
     * @returns Base58Check-encoded address and its index
     *
     */
    getAddress(addressIndex?: number): Promise<{
        address: string;
        addressIndex: number;
    }>;
}
