import { entrypointDecoder } from '../codec';
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
