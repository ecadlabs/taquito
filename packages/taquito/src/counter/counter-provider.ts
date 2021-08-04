import { Context } from "../context";
import { CounterProviderInterface } from "./interface";

export class CounterProvider implements CounterProviderInterface {
    private _counters: { [key: string]: number } = {};

    constructor(private context: Context) { }

   /**
    *
    * @description Return the last used counter as provided by the RPC for a specific account
    *
    * @param publicKeyHash publick key hash of the account we want to retrieve the counter
    */
    async getRpcCounter(publicKeyHash: string){
        const { counter } = await this.context.rpc.getContract(publicKeyHash);
        return parseInt(counter || '0', 10);
    }

   /**
    *
    * @description Return and object where `rpcCounter` is the last used counter as provided by the RPC for a specific account
    * and `lastUsedCounter` is the last counter that has been used to send an operation.
    * `lastUsedCounter` will be different from `rpcCounter` if sending many operation in a block
    *
    * @param publicKeyHash publick key hash of the account we want to retrieve the counter
    */
    async getCounters(publicKeyHash: string) {
        const rpcCounter = await this.getRpcCounter(publicKeyHash);

        if (!this._counters[publicKeyHash] || this._counters[publicKeyHash] < rpcCounter) {
            this._counters[publicKeyHash] = rpcCounter;
        }
        return {
            rpcCounter,
            lastUsedCounter: this._counters[publicKeyHash]
        };
    }

   /**
    *
    * @description Provide the counter ready to be used to send an operation with a specific account
    *
    * @param publicKeyHash publick key hash of the account we want to retrieve the counter
    */
    async getNextCounter(publicKeyHash: string){
        const rpcCounter = await this.getRpcCounter(publicKeyHash);

        if (!this._counters[publicKeyHash] || this._counters[publicKeyHash] < rpcCounter) {
            this._counters[publicKeyHash] = rpcCounter;
        }
        return ++this._counters[publicKeyHash];
    }
}