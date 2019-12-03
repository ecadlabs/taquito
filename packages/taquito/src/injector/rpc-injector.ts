import { Injector } from './interface';
import { Context } from '../context';

export class RpcInjector implements Injector {
  constructor(private context: Context) {}
  inject(signedOperationBytes: string): Promise<string> {
    return this.context.rpc.injectOperation(signedOperationBytes);
  }
}
