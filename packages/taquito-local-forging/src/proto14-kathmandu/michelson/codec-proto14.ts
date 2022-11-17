import { Uint8ArrayConsumer } from '../../uint8array-consumer';
import { Decoder, Encoder } from '../../taquito-local-forging';
import { opMappingReverseProto14, opMappingProto14 } from '../constants-proto14';
import { pad } from '../../utils';
import { UnexpectedMichelsonValueError } from '../../error';
import {
  bytesDecoder,
  bytesEncoder,
  decodeAnnots,
  encodeAnnots,
  extractRequiredLen,
  intDecoder,
  intEncoder,
  isBytes,
  isInt,
  isPrim,
  isString,
  MichelsonValue,
  PrimValue,
  stringDecoder,
  stringEncoder,
} from '../../michelson/codec';

export const scriptEncoderProto14: Encoder<{ code: MichelsonValue; storage: MichelsonValue }> = (
  script
) => {
  const code = valueEncoderProto14(script.code);
  const storage = valueEncoderProto14(script.storage);
  return `${pad(code.length / 2, 8)}${code}${pad(storage.length / 2, 8)}${storage}`;
};

export const scriptDecoderProto14: Decoder = (value: Uint8ArrayConsumer) => {
  const code = extractRequiredLen(value);
  const storage = extractRequiredLen(value);

  return {
    code: valueDecoderProto14(new Uint8ArrayConsumer(code)),
    storage: valueDecoderProto14(new Uint8ArrayConsumer(storage)),
  };
};

export const valueEncoderProto14: Encoder<MichelsonValue> = (value: MichelsonValue) => {
  if (Array.isArray(value)) {
    const encoded = value.map((x) => valueEncoderProto14(x)).join('');
    const len = encoded.length / 2;
    return `02${pad(len)}${encoded}`;
  } else if (isPrim(value)) {
    return primEncoderProto14(value);
  } else if (isBytes(value)) {
    return bytesEncoder(value);
  } else if (isString(value)) {
    return stringEncoder(value);
  } else if (isInt(value)) {
    return intEncoder(value);
  }

  throw new UnexpectedMichelsonValueError(JSON.stringify(value));
};

export const valueDecoderProto14: Decoder = (value: Uint8ArrayConsumer) => {
  const preamble = value.consume(1);
  switch (preamble[0]) {
    case 0x0a:
      return bytesDecoder(value);
    case 0x01:
      return stringDecoder(value);
    case 0x00:
      return intDecoder(value);
    case 0x02: {
      const val = new Uint8ArrayConsumer(extractRequiredLen(value));
      const results = [];
      while (val.length() > 0) {
        results.push(valueDecoderProto14(val));
      }
      return results;
    }
    default:
      return primDecoderProto14(value, preamble);
  }
};

export const primEncoderProto14: Encoder<PrimValue> = (value) => {
  const hasAnnot = +Array.isArray(value.annots);
  const argsCount = Array.isArray(value.args) ? value.args.length : 0;

  // Specify the number of args max is 3 without annotation
  const preamble = pad(Math.min(2 * argsCount + hasAnnot + 0x03, 9), 2);

  const op = opMappingReverseProto14[value.prim];

  let encodedArgs = (value.args || []).map((arg) => valueEncoderProto14(arg)).join('');
  const encodedAnnots = Array.isArray(value.annots) ? encodeAnnots(value.annots) : '';

  if (value.prim === 'LAMBDA' && argsCount) {
    encodedArgs = pad(encodedArgs.length / 2) + encodedArgs + pad(0);
  }

  if ((value.prim === 'pair' || value.prim === 'Pair') && argsCount > 2) {
    encodedArgs =
      encodedAnnots === ''
        ? pad(encodedArgs.length / 2) + encodedArgs + pad(0)
        : pad(encodedArgs.length / 2) + encodedArgs;
  }

  if (value.prim === 'view' && value.args) {
    encodedArgs = pad(encodedArgs.length / 2) + encodedArgs + pad(0);
  }

  return `${preamble}${op}${encodedArgs}${encodedAnnots}`;
};

export const primDecoderProto14 = (value: Uint8ArrayConsumer, preamble: Uint8Array) => {
  const hasAnnot = (preamble[0] - 0x03) % 2 === 1;
  let argsCount = Math.floor((preamble[0] - 0x03) / 2);
  const op = value.consume(1)[0].toString(16).padStart(2, '0');

  const result: Partial<PrimValue> = {
    prim: opMappingProto14[op],
  };

  if (opMappingProto14[op] === 'LAMBDA') {
    value.consume(4);
  }

  if (opMappingProto14[op] === 'view') {
    if (argsCount != 0) {
      return primViewDecoderProto14(value, result);
    } else {
      return result;
    }
  }

  let combPairArgs;
  let combPairAnnots;
  if ((opMappingProto14[op] === 'pair' || opMappingProto14[op] === 'Pair') && argsCount > 2) {
    combPairArgs = decodeCombPair(value);
    argsCount = 0;
    combPairAnnots = decodeAnnots(value);
  }

  const args = new Array(argsCount).fill(0).map(() => valueDecoderProto14(value));

  if (opMappingProto14[op] === 'LAMBDA') {
    value.consume(4);
  }

  if (combPairArgs) {
    result['args'] = combPairArgs as any;
  } else if (args.length) {
    result['args'] = args as any;
  }

  if (combPairAnnots && (combPairAnnots as any)[0] !== '') {
    result['annots'] = combPairAnnots as any;
  } else if (hasAnnot) {
    result['annots'] = decodeAnnots(value) as any;
  }

  return result;
};

export const primViewDecoderProto14 = (value: Uint8ArrayConsumer, result: Partial<PrimValue>) => {
  value.consume(4);
  result['args'] = new Array(4).fill(0).map(() => valueDecoderProto14(value)) as any;
  value.consume(4);
  return result;
};

export const decodeCombPair: Decoder = (val: Uint8ArrayConsumer) => {
  const array = new Uint8ArrayConsumer(extractRequiredLen(val));
  const args = [];
  while (array.length() > 0) {
    args.push(valueDecoderProto14(array));
  }
  return args;
};
