import { Forger, ForgeParams, ForgeResponse } from '@taquito/local-forging';
import { Context } from '../context';

export class RpcForger implements Forger {
  constructor(private context: Context) {}

  forge({ branch, contents }: ForgeParams): Promise<ForgeResponse> {
    return this.context.rpc.forgeOperations({ branch, contents });
  }
}
