/**
 * @packageDocumentation
 * @module @taquito/local-forging
 */

import { ForgeParams, Forger, Protocols } from '@taquito/taquito';
import { CODEC } from './constants';
import { decoders } from './decoder';
import { encoders } from './encoder';
import { encodersPsrsRVg1 } from './proto/encoderPsrsRVg1';
import { decodersPsrsRVg1 } from './proto/decoderPsrsRVg1'
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { latestProtocol } from '@taquito/taquito';

export { CODEC } from './constants';
export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';

export function getCodec(codec: CODEC, protocol:string) {
  const enc = (protocol === Protocols.PsrsRVg1)? encodersPsrsRVg1: encoders
  const dec = (protocol === Protocols.PsrsRVg1)? decodersPsrsRVg1: decoders
  return {
    encoder: enc[codec],
    decoder: (hex: string) => {
      const consumer = Uint8ArrayConsumer.fromHexString(hex);
      return dec[codec](consumer) as any;
    },
  };
}

export class LocalForger implements Forger {
  private codec: any;
  private protocol: string;

  constructor(private currentProtocol: string = latestProtocol) {
    this.protocol = currentProtocol;
    this.codec = getCodec(CODEC.MANAGER, this.protocol);
  }

  forge(params: ForgeParams): Promise<string> {
    return Promise.resolve(this.codec.encoder(params));
  }

  parse(hex: string): Promise<ForgeParams> {
    return Promise.resolve(this.codec.decoder(hex) as ForgeParams);
  }

  getProtocol(): string {
    return this.protocol;
  }
}

export const localForger = new LocalForger();
