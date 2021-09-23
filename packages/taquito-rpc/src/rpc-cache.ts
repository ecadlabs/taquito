import { defaultRPCOptions, RpcClient, RPCOptions } from "./taquito-rpc";

interface CachedDataInterface {
    [key: string]: {
        handle: Function,
        response: any
    }
    
}
const defaultTtl = 1000;

export class RpcCacheDecorator extends RpcClient {
    private _rpcClient: RpcClient;
    private _ttl: number;
    private _cache: CachedDataInterface = {};
    constructor(rpcClient: RpcClient, ttl = defaultTtl){
        super(rpcClient['url'], rpcClient['chain'], rpcClient['httpBackend']);
        this._rpcClient = rpcClient;
        this._ttl = ttl;
    }

    private serializeKey(url: string, params: any[], data?: any){
        let param: string = "";
        params.forEach(element => {
            if(typeof element === 'object'){
                param = param + JSON.stringify(element);
            } else {
                param = param + element;
            }
        });
        if(data){
            return `${url}/${param}/${JSON.stringify(data)}`
        }else {
            return `${url}/${param}`
        }
        
    }

    private has(key: string) {
        return key in this._cache;
    }

    private get(key: string) {
        return this._cache[key].response;
    }

    private put(key: string, response: any) {

        let handle = setTimeout(() => {
            return (this.remove(key));
          }, this._ttl);

          Object.assign(this._cache, {[key]: {handle, response}});
    }

    private remove(key: string) {
        delete this._cache[key];
    }

    async getBlockHash({ block }: RPCOptions = defaultRPCOptions) {
        const key = this.serializeKey(this.url, [block]);
        if(this.has(key)) {
            return this.get(key);
        } else {
            const response = await this._rpcClient.getBlockHash({block});
            this.put(key, response);
            return response;
        }

    }
}