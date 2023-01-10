import { BigNumber } from 'bignumber.js';
import { Decoder } from '../decoder';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { Encoder } from '../taquito-local-forging';
import { opMappingReverse, opMapping } from '../constants';
import { pad } from '../utils';
import { InvalidHexStringError, UnexpectedMichelsonValueError } from '../error';

export type PrimValue = { prim: string; args?: MichelsonValue[]; annots?: string[] };
export type BytesValue = { bytes: string };
export type StringValue = { string: string };
export type IntValue = { int: string };
export type MichelsonValue =
  | PrimValue
  | BytesValue
  | StringValue
  | IntValue
  | (PrimValue | BytesValue | StringValue | IntValue)[];

export const isPrim = (value: MichelsonValue): value is PrimValue => {
  return 'prim' in value;
};

export const isBytes = (value: MichelsonValue): value is BytesValue => {
  return 'bytes' in value && typeof value.bytes === 'string';
};

export const isString = (value: MichelsonValue): value is StringValue => {
  return 'string' in value && typeof value.string === 'string';
};

export const isInt = (value: MichelsonValue): value is IntValue => {
  return 'int' in value && typeof value.int === 'string';
};

export const scriptEncoder: Encoder<{ code: MichelsonValue; storage: MichelsonValue }> = (
  script
) => {
  const code = valueEncoder(script.code);
  const storage = valueEncoder(script.storage);
  return `${pad(code.length / 2, 8)}${code}${pad(storage.length / 2, 8)}${storage}`;
};

export const scriptDecoder: Decoder = (value: Uint8ArrayConsumer) => {
  const code = extractRequiredLen(value);
  const storage = extractRequiredLen(value);

  return {
    code: valueDecoder(new Uint8ArrayConsumer(code)),
    storage: valueDecoder(new Uint8ArrayConsumer(storage)),
  };
};

export const valueEncoder: Encoder<MichelsonValue> = (value: MichelsonValue) => {
  if (Array.isArray(value)) {
    const encoded = value.map((x) => valueEncoder(x)).join('');
    const len = encoded.length / 2;
    return `02${pad(len)}${encoded}`;
  } else if (isPrim(value)) {
    return primEncoder(value);
  } else if (isBytes(value)) {
    return bytesEncoder(value);
  } else if (isString(value)) {
    return stringEncoder(value);
  } else if (isInt(value)) {
    return intEncoder(value);
  }

  throw new UnexpectedMichelsonValueError(JSON.stringify(value));
};

export const valueDecoder: Decoder = (value: Uint8ArrayConsumer) => {
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
        results.push(valueDecoder(val));
      }
      return results;
    }
    default:
      return primDecoder(value, preamble);
  }
};

export const extractRequiredLen = (value: Uint8ArrayConsumer, bytesLength = 4) => {
  const len = value.consume(bytesLength);
  const valueLen = parseInt(Buffer.from(len).toString('hex'), 16);
  return value.consume(valueLen);
};

export const bytesEncoder: Encoder<BytesValue> = (value) => {
  if (!/^([A-Fa-f0-9]{2})*$/.test(value.bytes)) {
    throw new InvalidHexStringError(value.bytes);
  }

  const len = value.bytes.length / 2;
  return `0a${pad(len)}${value.bytes}`;
};

export const bytesDecoder: Decoder = (value: Uint8ArrayConsumer) => {
  const bytes = extractRequiredLen(value);
  return {
    bytes: Buffer.from(bytes).toString('hex'),
  };
};

export const stringEncoder: Encoder<StringValue> = (value) => {
  const str = Buffer.from(value.string, 'utf8').toString('hex');
  const hexLength = str.length / 2;
  return `01${pad(hexLength)}${str}`;
};

export const stringDecoder: Decoder = (value: Uint8ArrayConsumer) => {
  const str = extractRequiredLen(value);
  return {
    string: Buffer.from(str).toString('utf8'),
  };
};

export const intEncoder: Encoder<IntValue> = ({ int }) => {
  const num = new BigNumber(int, 10);
  const positiveMark = num.toString(2)[0] === '-' ? '1' : '0';
  const binary = num.toString(2).replace(/-/g, '');

  const pad =
    binary.length <= 6
      ? 6
      : (binary.length - 6) % 7
      ? binary.length + 7 - ((binary.length - 6) % 7)
      : binary.length;

  const splitted = binary.padStart(pad, '0').match(/\d{6,7}/g);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const reversed = splitted!.reverse();

  reversed[0] = positiveMark + reversed[0];

  const numHex = reversed.map((x: string, i: number) =>
    // Add one to the last chunk
    parseInt((i === reversed.length - 1 ? '0' : '1') + x, 2)
      .toString(16)
      .padStart(2, '0')
  );

  return `00${numHex.join('')}`;
};

export const intDecoder = (value: Uint8ArrayConsumer): IntValue => {
  let c = value.consume(1)[0];
  const hexNumber: number[] = [];
  const isNotLastChunkMask = 1 << 7;
  while (c & isNotLastChunkMask) {
    hexNumber.push(c);
    c = value.consume(1)[0];
  }

  hexNumber.push(c);
  const isNegative = !!((1 << 6) & hexNumber[0]);

  hexNumber[0] = hexNumber[0] & 0b1111111;

  const numBin = hexNumber
    .map((x, i) =>
      x
        .toString(2)
        .slice(i === 0 ? -6 : -7)
        .padStart(i === 0 ? 6 : 7, '0')
    )
    .reverse();
  let num = new BigNumber(numBin.join(''), 2);
  if (isNegative) {
    num = num.times(-1);
  }

  return {
    int: num.toFixed(),
  };
};

export const primEncoder: Encoder<PrimValue> = (value) => {
  const hasAnnot = +Array.isArray(value.annots);
  const argsCount = Array.isArray(value.args) ? value.args.length : 0;

  // Specify the number of args max is 3 without annotation
  const preamble = pad(Math.min(2 * argsCount + hasAnnot + 0x03, 9), 2);

  const op = opMappingReverse[value.prim];

  let encodedArgs = (value.args || []).map((arg) => valueEncoder(arg)).join('');
  const encodedAnnots = Array.isArray(value.annots) ? encodeAnnots(value.annots) : '';

  if ((value.prim === 'LAMBDA' || value.prim === 'LAMBDA_REC') && argsCount) {
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

export const primDecoder = (value: Uint8ArrayConsumer, preamble: Uint8Array) => {
  const hasAnnot = (preamble[0] - 0x03) % 2 === 1;
  let argsCount = Math.floor((preamble[0] - 0x03) / 2);
  const op = value.consume(1)[0].toString(16).padStart(2, '0');

  const result: Partial<PrimValue> = {
    prim: opMapping[op],
  };

  if (opMapping[op] === 'LAMBDA' || opMapping[op] === 'LAMBDA_REC') {
    value.consume(4);
  }

  if (opMapping[op] === 'view') {
    if (argsCount != 0) {
      return primViewDecoder(value, result);
    } else {
      return result;
    }
  }

  let combPairArgs;
  let combPairAnnots;
  if ((opMapping[op] === 'pair' || opMapping[op] === 'Pair') && argsCount > 2) {
    combPairArgs = decodeCombPair(value);
    argsCount = 0;
    combPairAnnots = decodeAnnots(value);
  }

  const args = new Array(argsCount).fill(0).map(() => valueDecoder(value));

  if (opMapping[op] === 'LAMBDA' || opMapping[op] === 'LAMBDA_REC') {
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

export const primViewDecoder = (value: Uint8ArrayConsumer, result: Partial<PrimValue>) => {
  value.consume(4);
  result['args'] = new Array(4).fill(0).map(() => valueDecoder(value)) as any;
  value.consume(4);
  return result;
};

export const decodeCombPair: Decoder = (val: Uint8ArrayConsumer) => {
  const array = new Uint8ArrayConsumer(extractRequiredLen(val));
  const args = [];
  while (array.length() > 0) {
    args.push(valueDecoder(array));
  }
  return args;
};

export const encodeAnnots: Encoder<string[]> = (value: string[]) => {
  const mergedAnnot = value
    .map((x) => {
      return Buffer.from(x, 'utf8').toString('hex');
    })
    .join('20');

  const len = mergedAnnot.length / 2;
  return `${pad(len)}${mergedAnnot}`;
};

export const decodeAnnots: Decoder = (val: Uint8ArrayConsumer): string[] => {
  const len = val.consume(4);
  const annotLen = parseInt(Buffer.from(len).toString('hex'), 16);
  const restOfAnnot = val.consume(annotLen);

  const restOfAnnotHex = Buffer.from(restOfAnnot).toString('hex');
  return restOfAnnotHex.split('20').map((x) => Buffer.from(x, 'hex').toString('utf8'));
};
