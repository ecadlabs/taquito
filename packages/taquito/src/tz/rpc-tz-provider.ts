import BigNumber from 'bignumber.js';
import { Context } from '../context';
import { OperationEmitter } from '../operations/operation-emitter';
import { Operation } from '../operations/operations';
import { RPCActivateOperation } from '../operations/types';
import { TzProvider } from './interface';
import { OpKind } from '@taquito/rpc';

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
    const operation: RPCActivateOperation = {
      kind: OpKind.ACTIVATION,
      pkh,
      secret,
    };

    const prepared = await this.prepareOpAndSimulation({
      operation: [operation],
      source: pkh,
      publicKeyHash: pkh,
    });
    const forgedBytes = await this.forge(prepared.preparedOp);
    const bytes = `${forgedBytes.opbytes}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
    return new Operation(
      await this.rpc.injectOperation(bytes),
      { ...forgedBytes, opbytes: bytes },
      [],
      this.context.clone()
    );
  }
}
