import { Decoder } from '../decoder';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { kindMappingProto12, kindMappingReverseProto12 } from './constants';
import { InvalidOperationKindError } from '@taquito/utils';
import { OperationDecodingError, UnsupportedOperationError } from '../error';
import { CODEC } from '../constants';

export const EndorsementSchemaProto12 = {
  slot: CODEC.INT16,
  level: CODEC.INT32,
  round: CODEC.INT32,
  block_payload_hash: CODEC.BLOCK_PAYLOAD_HASH,
};

export const operationEncoderProto12 =
  (encoders: { [key: string]: (val: object) => string }) => (operation: { kind: string }) => {
    if (!(operation.kind in encoders) || !(operation.kind in kindMappingReverseProto12)) {
      throw new InvalidOperationKindError(operation.kind);
    }

    return kindMappingReverseProto12[operation.kind] + encoders[operation.kind](operation);
  };

export const operationDecoderProto12 =
  (decoders: { [key: string]: Decoder }) => (value: Uint8ArrayConsumer) => {
    const op = value.consume(1);

    const operationName = kindMappingProto12[op[0]];
    if (operationName === undefined) {
      throw new UnsupportedOperationError(op[0].toString());
    }
    const decodedObj = decoders[operationName](value);

    if (typeof decodedObj !== 'object') {
      throw new OperationDecodingError('Decoded invalid operation');
    }

    return {
      kind: operationName,
      ...decodedObj,
    };
  };
