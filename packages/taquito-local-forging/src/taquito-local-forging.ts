/**
 * @packageDocumentation
 * @module @taquito/local-forging
 */

import { ForgeParams, Forger } from './interface';
import { CODEC, ProtocolsHash } from './constants';
import { decoders } from './decoder';
import { encoders } from './encoder';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { decodersProto12 } from './proto12-ithaca/decoder';
import { encodersProto12 } from './proto12-ithaca/encoder';
import { validateBlock, ValidationResult, InvalidOperationKindError } from '@taquito/utils';
import { InvalidBlockHashError, InvalidOperationSchemaError } from './error';
import { validateMissingProperty, validateOperationKind } from './validator';

export { CODEC, ProtocolsHash } from './constants';
export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';
export * from './interface';
export { VERSION } from './version';

export function getCodec(codec: CODEC, proto: ProtocolsHash) {
  if (proto === ProtocolsHash.Psithaca2) {
    return {
      encoder: encodersProto12[codec],
      decoder: (hex: string) => {
        const consumer = Uint8ArrayConsumer.fromHexString(hex);
        return decodersProto12[codec](consumer) as any;
      },
    };
  } else {
    return {
      encoder: encoders[codec],
      decoder: (hex: string) => {
        const consumer = Uint8ArrayConsumer.fromHexString(hex);
        return decoders[codec](consumer) as any;
      },
    };
  }
}

export class LocalForger implements Forger {
  constructor(public readonly protocolHash = ProtocolsHash.Psithaca2) {}

  private codec = getCodec(CODEC.MANAGER, this.protocolHash);

  forge(params: ForgeParams): Promise<string> {
    if (validateBlock(params.branch) !== ValidationResult.VALID) {
      throw new InvalidBlockHashError(`The block hash ${params.branch} is invalid`);
    }

    for (const content of params.contents) {
      if (!validateOperationKind(content.kind)) {
        throw new InvalidOperationKindError(content.kind);
      }

      const diff = validateMissingProperty(content);
      if (diff.length === 1) {
        if (content.kind === 'delegation' && diff[0] === 'delegate') {
          continue;
        } else if (content.kind === 'origination' && diff[0] === 'delegate') {
          continue;
        } else if (content.kind === 'transaction' && diff[0] === 'parameters') {
          continue;
        } else {
          throw new InvalidOperationSchemaError(
            `Missing properties: ${diff.join(', ').toString()}`
          );
        }
      } else if (diff.length > 1) {
        throw new InvalidOperationSchemaError(`Missing properties: ${diff.join(', ').toString()}`);
      }
    }

    return Promise.resolve(this.codec.encoder(params));
  }

  parse(hex: string): Promise<ForgeParams> {
    return Promise.resolve(this.codec.decoder(hex) as ForgeParams);
  }
}

export const localForger = new LocalForger();
