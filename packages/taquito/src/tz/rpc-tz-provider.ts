import BigNumber from 'bignumber.js';
import { Context } from '../context';
import { OperationEmitter } from '../operations/operation-emitter';
import { Operation } from '../operations/operations';
import { RPCActivateOperation } from '../operations/types';
import { TzProvider } from './interface';
import { OpKind } from '@taquito/rpc';
import {
  validateAddress,
  validateKeyHash,
  InvalidKeyHashError,
  invalidErrorDetail,
} from '@taquito/utils';
import { InvalidAddressError, ValidationResult } from '@taquito/core';

export class RpcTzProvider extends OperationEmitter implements TzProvider {
  constructor(context: Context) {
    super(context);
  }

  async getBalance(address: string): Promise<BigNumber> {
    const addressValidation = validateAddress(address);
    if (addressValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(address, invalidErrorDetail(addressValidation));
    }
    return this.context.readProvider.getBalance(address, 'head');
  }

  async getDelegate(address: string): Promise<string | null> {
    const addressValidation = validateAddress(address);
    if (addressValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(address, invalidErrorDetail(addressValidation));
    }
    return this.context.readProvider.getDelegate(address, 'head');
  }

  async activate(pkh: string, secret: string) {
    const pkhValidation = validateKeyHash(pkh);
    if (pkhValidation !== ValidationResult.VALID) {
      throw new InvalidKeyHashError(pkh, invalidErrorDetail(pkhValidation));
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
