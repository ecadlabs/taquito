import BigNumber from 'bignumber.js';
import { Context } from '../context';
import { Operation } from '../operations/operations';
import { TzProvider } from './interface';
import {
  validateAddress,
  ValidationResult,
  validateKeyHash,
  InvalidKeyHashError,
  invalidDetail,
} from '@taquito/utils';
import { InvalidAddressError } from '@taquito/core';
import { Provider } from '../provider';
import { PrepareProvider } from '../prepare';

export class RpcTzProvider extends Provider implements TzProvider {
  constructor(context: Context) {
    super(context);
  }

  private prepare = new PrepareProvider(this.context);

  async getBalance(address: string): Promise<BigNumber> {
    const addressValidation = validateAddress(address);
    if (addressValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(address, invalidDetail(addressValidation));
    }
    return this.context.readProvider.getBalance(address, 'head');
  }

  async getSpendable(address: string): Promise<BigNumber> {
    const addressValidation = validateAddress(address);
    if (addressValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(address, invalidDetail(addressValidation));
    }
    return this.context.readProvider.getSpendable(address, 'head');
  }

  async getDelegate(address: string): Promise<string | null> {
    const addressValidation = validateAddress(address);
    if (addressValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(address, invalidDetail(addressValidation));
    }
    return this.context.readProvider.getDelegate(address, 'head');
  }

  async activate(pkh: string, secret: string) {
    const pkhValidation = validateKeyHash(pkh);
    if (pkhValidation !== ValidationResult.VALID) {
      throw new InvalidKeyHashError(pkh, invalidDetail(pkhValidation));
    }

    const prepared = await this.prepare.activate({ pkh, secret });

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
