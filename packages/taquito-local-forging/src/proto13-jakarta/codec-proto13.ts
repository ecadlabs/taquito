import { Prefix } from '@taquito/utils';
import {
  entrypointDecoder,
  prefixDecoder,
  prefixEncoder,
  zarithDecoder,
  zarithEncoder,
} from '../codec';
import { entrypointMappingReverse, ENTRYPOINT_MAX_LENGTH } from '../constants';
import { OversizedEntryPointError } from '../error';
import { extractRequiredLen, MichelsonValue } from '../michelson/codec';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { pad } from '../utils';
import { valueDecoderProto13, valueEncoderProto13 } from './michelson-proto13/codec-proto13';

export const parametersDecoderProto13 = (val: Uint8ArrayConsumer) => {
  const preamble = val.consume(1);
  if (preamble[0] === 0x00) {
    return;
  } else {
    const encodedEntrypoint = entrypointDecoder(val);
    const params = extractRequiredLen(val);
    const parameters = valueDecoderProto13(new Uint8ArrayConsumer(params));
    return {
      entrypoint: encodedEntrypoint,
      value: parameters,
    };
  }
};

export const valueParameterDecoderProto13 = (val: Uint8ArrayConsumer) => {
  const value = extractRequiredLen(val);
  return valueDecoderProto13(new Uint8ArrayConsumer(value));
};

export const entrypointEncoderProto13 = (entrypoint: string) => {
  if (entrypoint in entrypointMappingReverse) {
    return `${entrypointMappingReverse[entrypoint]}`;
  } else {
    if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
      throw new OversizedEntryPointError(entrypoint);
    }

    const value = { string: entrypoint };
    return `ff${valueEncoderProto13(value).slice(8)}`;
  }
};

export const entrypointNameEncoderProto13 = (entrypoint: string) => {
  const value = { string: entrypoint };
  return `${valueEncoderProto13(value).slice(2)}`;
};

export const entrypointNameDecoderProto13 = (val: Uint8ArrayConsumer) => {
  const entry = extractRequiredLen(val);

  return Buffer.from(entry).toString('utf8');
};

export const parametersEncoderProto13 = (val: { entrypoint: string; value: MichelsonValue }) => {
  if (!val || (val.entrypoint === 'default' && 'prim' in val.value && val.value.prim === 'Unit')) {
    return '00';
  }

  const encodedEntrypoint = entrypointEncoderProto13(val.entrypoint);
  const parameters = valueEncoderProto13(val.value);
  const length = (parameters.length / 2).toString(16).padStart(8, '0');
  return `ff${encodedEntrypoint}${length}${parameters}`;
};

export const valueParameterEncoderProto13 = (value: MichelsonValue) => {
  const valueEncoded = valueEncoderProto13(value);
  return `${pad(valueEncoded.length / 2)}${valueEncoded}`;
};

export const txRollupOriginationParamEncoderProto13 = (_value: string) => {
  return '';
};

export const txRollupOriginationParamDecoderProto13 = (_val: Uint8ArrayConsumer) => {
  return {};
};

export const txRollupIdEncoderProto13 = prefixEncoder(Prefix.TXR1);

export const txRollupIdDecoderProto13 = prefixDecoder(Prefix.TXR1);

export const txRollupBatchContentEncoderProto13 = (value: string) => {
  return `${pad(value.length / 2)}${value}`;
};

export const txRollupBatchContentDecoderProto13 = (val: Uint8ArrayConsumer) => {
  const value = extractRequiredLen(val);
  return Buffer.from(value).toString('hex');
};

export const burnLimitEncoder = (val: string) => {
  return !val ? '00' : `ff${zarithEncoder(val)}`;
};

export const burnLimitDecoder = (value: Uint8ArrayConsumer) => {
  const prefix = value.consume(1);
  if (Buffer.from(prefix).toString('hex') !== '00') {
    return zarithDecoder(value);
  }
};
