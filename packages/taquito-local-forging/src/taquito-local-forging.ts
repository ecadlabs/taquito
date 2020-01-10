import { ForgeParams, Forger } from '@taquito/taquito';
import { encoders } from './encoder';

export * from './decoder';
export * from './encoder';

export class LocalForger implements Forger {
  forge(params: ForgeParams): Promise<string> {
    return Promise.resolve(encoders['manager'](params));
  }
}

export const localForger = new LocalForger();
