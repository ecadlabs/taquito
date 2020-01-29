import { ForgeParams, Forger } from '@taquito/taquito';
import { encoders } from './encoder';
import { decoders } from './decoder';
import { Uint8ArrayConsumer } from './uint8array-consumer';

export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';

export class LocalForger implements Forger {
  forge(params: ForgeParams): Promise<string> {
    return Promise.resolve(encoders['manager'](params));
  }

  parse(hex: string): ForgeParams {
    return decoders['manager'](Uint8ArrayConsumer.fromHexString(hex)) as ForgeParams;
  }
}

export const localForger = new LocalForger();
