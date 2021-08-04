export interface CounterProviderInterface {
   /**
    *
    * @description Return and object where `rpcCounter` is the last used counter as provided by the RPC for a specific account
    * and `lastUsedCounter` is the last counter that has been used to send an operation.
    * `lastUsedCounter` will be different from `rpcCounter` if sending many operation in a block
    *
    * @param publicKeyHash publick key hash of the account we want to retrieve the counter
    */
    getCounters(publicKeyHash: string): Promise<{
        rpcCounter: number,
        lastUsedCounter: number
    }>;

   /**
    *
    * @description Provide the counter ready to be used to send an operation with a specific account
    *
    * @param publicKeyHash publick key hash of the account we want to retrieve the counter
    */
    getNextCounter(publicKeyHash: string): Promise<number>;

   /**
    *
    * @description Return the last used counter as provided by the RPC for a specific account
    *
    * @param publicKeyHash publick key hash of the account we want to retrieve the counter
    */
    getRpcCounter(publicKeyHash: string): Promise<number>;
}