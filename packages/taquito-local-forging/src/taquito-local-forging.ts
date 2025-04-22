/**
 * @packageDocumentation
 * @module @taquito/local-forging
 */

import { ForgeParams, Forger } from './interface';
import { CODEC } from './constants';
import { CODEC as CODECPROTO021 } from './constants-proto021';
import { decoders } from './decoder';
import { decodersProto021 } from './decoder-proto021';
import { encoders } from './encoder';
import { encodersProto021 } from './encoder-proto021';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { validateBlock, ValidationResult, invalidDetail } from '@taquito/utils';
import { InvalidOperationSchemaError } from './errors';
import { validateMissingProperty, validateOperationKind } from './validator';
import { ProtocolsHash, ProtoInferiorTo } from './protocols';
import { InvalidBlockHashError, InvalidOperationKindError } from '@taquito/core';

export { CODEC, opMapping, opMappingReverse } from './constants';
export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';
export * from './interface';
export { VERSION } from './version';
export { ProtocolsHash } from './protocols';

const PROTOCOL_CURRENT = ProtocolsHash.PsRiotuma;

export function getCodec(codec: CODEC | CODECPROTO021, _proto: ProtocolsHash) {
  // use encodersProto021 & decodersProto021 if it's quebec or prior
  if (_proto === ProtocolsHash.PsQuebecn || ProtoInferiorTo(_proto, ProtocolsHash.PsQuebecn)) {
    return {
      encoder: encodersProto021[codec],
      decoder: (hex: string) => {
        const consumer = Uint8ArrayConsumer.fromHexString(hex);
        return decodersProto021[codec](consumer) as any;
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
  // TODO: Remove above if else once mainnet migrated into rio protocol and uncommon the return block below
  // return {
  //   encoder: encoders[codec],
  //   decoder: (hex: string) => {
  //     const consumer = Uint8ArrayConsumer.fromHexString(hex);
  //     return decoders[codec](consumer) as any;
  //   },
  // };
}

export class LocalForger implements Forger {
  constructor(public readonly protocolHash = PROTOCOL_CURRENT) {}

  private codec = getCodec(CODEC.MANAGER, this.protocolHash);

  forge(params: ForgeParams): Promise<string> {
    const branchValidation = validateBlock(params.branch);
    if (branchValidation !== ValidationResult.VALID) {
      throw new InvalidBlockHashError(params.branch, invalidDetail(branchValidation));
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
        } else if (content.kind === 'set_deposits_limit' && diff[0] === 'limit') {
          continue;
        } else if (content.kind === 'smart_rollup_originate' && diff[0] === 'whitelist') {
          continue;
        } else if (content.kind === 'update_consensus_key' && diff[0] === 'proof') {
          continue;
        } else {
          throw new InvalidOperationSchemaError(content, `missing properties "${diff.join(', ')}"`);
        }
      } else if (diff.length > 1) {
        throw new InvalidOperationSchemaError(content, `missing properties "${diff.join(', ')}"`);
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
