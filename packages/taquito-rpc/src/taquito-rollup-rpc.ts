import { RollupRpcClientInterface } from './rollup-rpc-client-interface';
import { HttpBackend } from '@taquito/http-utils';
import { defaultChain } from './rpc-client-interface';


export class RollupRpcClient implements RollupRpcClientInterface {
  constructor(
    protected url: string,
    protected chain: string = defaultChain,
    protected httpBackend: HttpBackend = new HttpBackend()
  ) {}

  dummy(): string {
    return ""
  }
}
