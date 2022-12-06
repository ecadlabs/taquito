import { OversizedEntryPointError } from '../error';
import { ENTRYPOINT_MAX_LENGTH } from '../constants';
import { valueDecoderProto14, valueEncoderProto14 } from './michelson/codec-proto14';
import { extractRequiredLen, MichelsonValue } from '../michelson/codec';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { pad } from '../utils';
import { entrypointMappingProto14, entrypointMappingReverseProto14 } from './constants-proto14';

export const parametersDecoderProto14 = (val: Uint8ArrayConsumer) => {
  const preamble = val.consume(1);
  if (preamble[0] === 0x00) {
    return;
  } else {
    const encodedEntrypoint = entrypointDecoderProto14(val);
    const params = extractRequiredLen(val);
    const parameters = valueDecoderProto14(new Uint8ArrayConsumer(params));
    return {
      entrypoint: encodedEntrypoint,
      value: parameters,
    };
  }
};
export const entrypointEncoderProto14 = (entrypoint: string) => {
  if (entrypoint in entrypointMappingReverseProto14) {
    return `${entrypointMappingReverseProto14[entrypoint]}`;
  } else {
    if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
      throw new OversizedEntryPointError(entrypoint);
    }

    const value = { string: entrypoint };
    return `ff${valueEncoderProto14(value).slice(8)}`;
  }
};

export const entrypointDecoderProto14 = (value: Uint8ArrayConsumer) => {
  const preamble = pad(value.consume(1)[0], 2);

  if (preamble in entrypointMappingProto14) {
    return entrypointMappingProto14[preamble];
  } else {
    const entry = extractRequiredLen(value, 1);

    const entrypoint = Buffer.from(entry).toString('utf8');

    if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
      throw new OversizedEntryPointError(entrypoint);
    }
    return entrypoint;
  }
};

export const parametersEncoderProto14 = (val: { entrypoint: string; value: MichelsonValue }) => {
  if (!val || (val.entrypoint === 'default' && 'prim' in val.value && val.value.prim === 'Unit')) {
    return '00';
  }

  const encodedEntrypoint = entrypointEncoderProto14(val.entrypoint);
  const parameters = valueEncoderProto14(val.value);
  const length = (parameters.length / 2).toString(16).padStart(8, '0');
  return `ff${encodedEntrypoint}${length}${parameters}`;
};

export const valueParameterEncoderProto14 = (value: MichelsonValue) => {
  const valueEncoded = valueEncoderProto14(value);
  return `${pad(valueEncoded.length / 2)}${valueEncoded}`;
};

export const valueParameterDecoderProto14 = (val: Uint8ArrayConsumer) => {
  const value = extractRequiredLen(val);
  return valueDecoderProto14(new Uint8ArrayConsumer(value));
};

export const entrypointNameEncoderProto14 = (entrypoint: string) => {
  const value = { string: entrypoint };
  return `${valueEncoderProto14(value).slice(2)}`;
};
