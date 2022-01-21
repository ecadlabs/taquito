import BigNumber from 'bignumber.js';
import { Context } from '../context';
import { OperationEmitter } from '../operations/operation-emitter';
import { Operation } from '../operations/operations';
import { RPCActivateOperation } from '../operations/types';
import { TzProvider } from './interface';
import { OpKind } from '@taquito/rpc';
import { validateAddress, ValidationResult, validateKeyHash, InvalidAddressError, InvalidKeyHashError } from '@taquito/utils';

export class RpcTzProvider extends OperationEmitter implements TzProvider {
  constructor(context: Context) {
    super(context);
  }

  async getBalance(address: string): Promise<BigNumber> {
    if (validateAddress(address) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid address: ${address}`);
    }
    return this.rpc.getBalance(address);
  }

  async getDelegate(address: string): Promise<string | null> {
    if (validateAddress(address) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid address: ${address}`);
    }
    return this.rpc.getDelegate(address);
  }

  async activate(pkh: string, secret: string) {
    if (validateKeyHash(pkh) !== ValidationResult.VALID) {
      throw new InvalidKeyHashError(`Invalid Public Key Hash: ${pkh}`);
    }
    const operation: RPCActivateOperation = {
      kind: OpKind.ACTIVATION,
      pkh,
      secret,
    };

    const prepared = await this.prepareOperation({ operation: [operation], source: pkh });
    const forgedBytes = await this.forge(prepared);
    const bytes = `${forgedBytes.opbytes}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
    return new Operation(
      await this.rpc.injectOperation(bytes),
      { ...forgedBytes, opbytes: bytes },
      [],
      this.context.clone()
    );
  }
}
