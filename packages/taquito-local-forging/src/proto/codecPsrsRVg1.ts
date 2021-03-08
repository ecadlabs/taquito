import { Uint8ArrayConsumer } from '@taquito/local-forging';
import { extractRequiredLen, MichelsonValue, valueDecoder, valueEncoder } from '../michelson/codec';
import { pad } from '../utils';
import { entrypointMappingReverse, ENTRYPOINT_MAX_LENGTH, entrypointMapping } from './constantsPsrsRVg1';
export {
	prefixEncoder,
	prefixDecoder,
	tz1Decoder,
	branchDecoder,
	pkhDecoder,
	branchEncoder,
	tz1Encoder,
	boolEncoder,
	proposalEncoder,
	proposalDecoder,
	proposalsDecoder,
	proposalsEncoder,
	ballotEncoder,
	ballotDecoder,
	delegateEncoder,
	int32Encoder,
	int32Decoder,
	boolDecoder,
	delegateDecoder,
	pkhEncoder,
	publicKeyEncoder,
	addressEncoder,
	publicKeyDecoder,
	addressDecoder,
	zarithEncoder,
	zarithDecoder,
} from '../codec';

export const entrypointEncoder = (entrypoint: string) => {
    if (entrypoint in entrypointMappingReverse) {
      return `${entrypointMappingReverse[entrypoint]}`;
    } else {
      if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
        throw new Error(
          `Oversized entrypoint: ${entrypoint}. The maximum length of entrypoint is ${ENTRYPOINT_MAX_LENGTH}`
        );
      }
  
      const value = { string: entrypoint };
      return `ff${valueEncoder(value).slice(8)}`;
    }
  };
  
  export const parametersEncoder = (val: { entrypoint: string; value: MichelsonValue }) => {
    if (!val || (val.entrypoint === 'default' && 'prim' in val.value && val.value.prim === 'Unit')) {
      return '00';
    }
  
    const encodedEntrypoint = entrypointEncoder(val.entrypoint);
    const parameters = valueEncoder(val.value);
    const length = (parameters.length / 2).toString(16).padStart(8, '0');
    return `ff${encodedEntrypoint}${length}${parameters}`;
  };

  export const entrypointDecoder = (value: Uint8ArrayConsumer) => {
	const preamble = pad(value.consume(1)[0], 2);
  
	if (preamble in entrypointMapping) {
	  return entrypointMapping[preamble];
	} else {
	  const entry = extractRequiredLen(value, 1);
  
	  const entrypoint = Buffer.from(entry).toString('utf8');
  
	  if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
		throw new Error(
		  `Oversized entrypoint: ${entrypoint}. The maximum length of entrypoint is ${ENTRYPOINT_MAX_LENGTH}`
		);
	  }
	  return entrypoint;
	}
  };
  
  export const parametersDecoder = (val: Uint8ArrayConsumer) => {
	const preamble = val.consume(1);
	if (preamble[0] === 0x00) {
	  return;
	} else {
	  const encodedEntrypoint = entrypointDecoder(val);
	  const params = extractRequiredLen(val);
	  const parameters = valueDecoder(new Uint8ArrayConsumer(params));
	  return {
		entrypoint: encodedEntrypoint,
		value: parameters,
	  };
	}
  };