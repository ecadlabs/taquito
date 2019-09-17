import { TzProvider } from './interface';
import { RpcClient } from '@tezos-ts/rpc';
import BigNumber from 'bignumber.js';
import { Context } from '../context';
import { ActivateOperation } from '../operations/types';
import { Operation } from '../operations/operations';
import { OperationEmitter } from '../operations/operation-emitter';

export class RpcTzProvider extends OperationEmitter implements TzProvider {
  constructor(context: Context) {
    super(context);
  }

  async getBalance(address: string): Promise<BigNumber> {
    return this.rpc.getBalance(address);
  }

  async getDelegate(address: string): Promise<string | null> {
    return this.rpc.getDelegate(address);
  }

  async activate(pkh: string, secret: string) {
    const operation: ActivateOperation = {
      kind: 'activate_account',
      pkh,
      secret,
    };

    const forgedBytes = await this.prepareOperation({ operation: [operation], source: pkh });
    const bytes = `${forgedBytes.opbytes}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
    return new Operation(
      await this.rpc.injectOperation(bytes),
      { ...forgedBytes, opbytes: bytes },
      [],
      this.context.clone()
    );
  }
}
