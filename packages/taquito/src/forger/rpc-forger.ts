import { Forger, ForgeParams, ForgeResponse } from './interface';
import { Context } from '../context';

export class RpcForger implements Forger {
  constructor(private context: Context) {}

  forge({ branch, contents }: ForgeParams): Promise<ForgeResponse> {
    return this.context.rpc.forgeOperations({ branch, contents });
  }
}
