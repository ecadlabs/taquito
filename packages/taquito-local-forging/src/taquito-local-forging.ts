/**
 * @packageDocumentation
 * @module @taquito/local-forging
 */

import { ForgeParams, Forger } from './interface';
import { CODEC } from './constants';
import { decoders } from './decoder';
import { encoders } from './encoder';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { validateBlock, ValidationResult, invalidDetail } from '@taquito/utils';
import { InvalidOperationSchemaError } from './errors';
import { validateMissingProperty, validateOperationKind } from './validator';
import { ProtocolsHash } from './protocols';
import { InvalidBlockHashError, InvalidOperationKindError } from '@taquito/core';

export { CODEC, opMapping, opMappingReverse } from './constants';
export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';
export * from './interface';
export { VERSION } from './version';
export { ProtocolsHash } from './protocols';

const PROTOCOL_CURRENT = ProtocolsHash.PtQenaB1P;

export function getCodec(codec: CODEC, _proto: ProtocolsHash) {
  return {
    encoder: encoders[codec],
    decoder: (hex: string) => {
      const consumer = Uint8ArrayConsumer.fromHexString(hex);
      return decoders[codec](consumer) as any;
    },
  };
}
//
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
