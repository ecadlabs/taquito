/**
 * @packageDocumentation
 * @module @taquito/local-forging
 */

import { ForgeParams, Forger } from './interface';
import { CODEC } from './constants';
import { decoders } from './decoder';
import { encoders } from './encoder';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { validateBlock, ValidationResult, InvalidOperationKindError } from '@taquito/utils';
import { InvalidBlockHashError, InvalidOperationSchemaError } from './error';
import { validateMissingProperty, validateOperationKind } from './validator';
import { ProtocolsHash, ProtoInferiorTo } from './protocols';
import { decodersProto14 } from './proto14-kathmandu/decoder-proto14';
import { encodersProto14 } from './proto14-kathmandu/encoder-proto14';

export { CODEC, opMapping, opMappingReverse } from './constants';
export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';
export * from './interface';
export { VERSION } from './version';
export { ProtocolsHash } from './protocols';

const PROTOCOL_CURRENT = ProtocolsHash.PtLimaPtL;

export function getCodec(codec: CODEC, _proto: ProtocolsHash) {
  // use proto14 encoders & decoders if it's kathmandu or prior
  if (_proto === ProtocolsHash.PtKathman || ProtoInferiorTo(_proto, PROTOCOL_CURRENT)) {
    return {
      encoder: encodersProto14[codec],
      decoder: (hex: string) => {
        const consumer = Uint8ArrayConsumer.fromHexString(hex);
        return decodersProto14[codec](consumer) as any;
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
  constructor(public readonly protocolHash = PROTOCOL_CURRENT) {}

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
        } else if (
          content.kind === ('tx_rollup_submit_batch' as unknown) &&
          diff[0] === 'burn_limit'
        ) {
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
    const forged = this.codec.encoder(params).toLowerCase();
    return Promise.resolve(forged);
  }

  parse(hex: string): Promise<ForgeParams> {
    return Promise.resolve(this.codec.decoder(hex) as ForgeParams);
  }
}

export const localForger = new LocalForger();
