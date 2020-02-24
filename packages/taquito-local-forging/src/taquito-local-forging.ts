import { ForgeParams, Forger } from '@taquito/taquito';
import { CODEC } from './constants';
import { decoders } from './decoder';
import { encoders } from './encoder';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { PackDataParams, PackDataResponse } from '@taquito/rpc';

import { packValue } from './pack';
import { unpackValue } from './unpack';

export { CODEC } from './constants';
export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';

export function getCodec(codec: CODEC) {
  return {
    encoder: encoders[codec],
    decoder: (hex: string) => {
      const consumer = Uint8ArrayConsumer.fromHexString(hex);
      return decoders[codec](consumer) as any;
    },
  };
}

export class LocalForger implements Forger {
  private codec = getCodec(CODEC.MANAGER);

  forge(params: ForgeParams): Promise<string> {
    return Promise.resolve(this.codec.encoder(params));
  }

  parse(hex: string): Promise<any> {
    return Promise.resolve(this.codec.decoder(hex));
  }

  pack({ data, type }: PackDataParams): Promise<PackDataResponse> {
    return Promise.resolve({ packed: `05${packValue(data, type)}` })
  }

  unpack({ packed, type }: { packed: string, type: any }): Promise<any> {
    const data = Uint8ArrayConsumer.fromHexString(packed);
    data.consume(1)
    return Promise.resolve(unpackValue(data, type))
  }
}

export const localForger = new LocalForger();
