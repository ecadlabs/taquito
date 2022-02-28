/**
 * @packageDocumentation
 * @module @taquito/local-forging
 */

import { ForgeParams, Forger } from './interface';
import { CODEC, ProtocolsHash } from './constants';
import { decoders } from './decoder';
import { encoders } from './encoder';
import { Uint8ArrayConsumer } from './uint8array-consumer';

export { CODEC, ProtocolsHash } from './constants';
export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';
export * from './interface';
export { VERSION } from './version';

export function getCodec(codec: CODEC, _proto: ProtocolsHash) {
  return {
    encoder: encoders[codec],
    decoder: (hex: string) => {
      const consumer = Uint8ArrayConsumer.fromHexString(hex);
      return decoders[codec](consumer) as any;
    },
  };
}

export class LocalForger implements Forger {
  constructor(public readonly protocolHash = ProtocolsHash.PtHangz2) {}

  private codec = getCodec(CODEC.MANAGER, this.protocolHash);

  forge(params: ForgeParams): Promise<string> {
    return Promise.resolve(this.codec.encoder(params));
  }

  parse(hex: string): Promise<ForgeParams> {
    return Promise.resolve(this.codec.decoder(hex) as ForgeParams);
  }
}

export const localForger = new LocalForger();
