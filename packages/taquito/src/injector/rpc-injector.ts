import { Injector } from './interface';
import { Context } from '../context';
import { formatErrorMessage } from './helper';
import { HttpResponseError } from '@taquito/http-utils';

export class RpcInjector implements Injector {
  constructor(private context: Context) {}
  async inject(signedOperationBytes: string): Promise<string> {
    let hash: string;
    try {
      hash = await this.context.rpc.injectOperation(signedOperationBytes);
    } catch (error) {
      const stringToStrip =
        '. You may want to use --replace to provide adequate fee and replace it';
      if (error instanceof HttpResponseError && error.message.includes(stringToStrip)) {
        throw formatErrorMessage(error, stringToStrip);
      } else {
        throw error;
      }
    }
    return hash;
  }
}
