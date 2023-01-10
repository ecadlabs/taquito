import {
  b58cdecode,
  b58cencode,
  buf2hex,
  Prefix,
  prefix as prefixMap,
  prefixLength,
  InvalidKeyHashError,
  InvalidPublicKeyError,
  InvalidAddressError,
  InvalidContractAddressError,
} from '@taquito/utils';
import { OversizedEntryPointError, InvalidBallotValueError, DecodeBallotValueError } from './error';
import BigNumber from 'bignumber.js';
import { entrypointMapping, entrypointMappingReverse, ENTRYPOINT_MAX_LENGTH } from './constants';
import { extractRequiredLen, valueDecoder, valueEncoder, MichelsonValue } from './michelson/codec';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { pad } from './utils';

export const prefixEncoder = (prefix: Prefix) => (str: string) => {
  return buf2hex(Buffer.from(b58cdecode(str, prefixMap[prefix])));
};

export const prefixDecoder = (pre: Prefix) => (str: Uint8ArrayConsumer) => {
  const val = str.consume(prefixLength[pre]);
  return b58cencode(val, prefixMap[pre]);
};

export const tz1Decoder = prefixDecoder(Prefix.TZ1);
export const branchDecoder = prefixDecoder(Prefix.B);
export const pkhDecoder = (val: Uint8ArrayConsumer) => {
  const prefix = val.consume(1);

  if (prefix[0] === 0x00) {
    return prefixDecoder(Prefix.TZ1)(val);
  } else if (prefix[0] === 0x01) {
    return prefixDecoder(Prefix.TZ2)(val);
  } else if (prefix[0] === 0x02) {
    return prefixDecoder(Prefix.TZ3)(val);
  }
};

export const branchEncoder = prefixEncoder(Prefix.B);
export const tz1Encoder = prefixEncoder(Prefix.TZ1);

export const boolEncoder = (bool: unknown): string => (bool ? 'ff' : '00');

export const proposalEncoder = (proposal: string): string => {
  return prefixEncoder(Prefix.P)(proposal);
};

export const proposalDecoder = (proposal: Uint8ArrayConsumer): string => {
  return prefixDecoder(Prefix.P)(proposal);
};

export const proposalsDecoder = (proposal: Uint8ArrayConsumer): string[] => {
  const proposals = [];
  proposal.consume(4);
  while (proposal.length() > 0) {
    proposals.push(proposalDecoder(proposal));
  }
  return proposals;
};

export const proposalsEncoder = (proposals: string[]): string => {
  return pad(32 * proposals.length) + proposals.map((x) => proposalEncoder(x)).join('');
};

export const ballotEncoder = (ballot: string): string => {
  switch (ballot) {
    case 'yay':
      return '00';
    case 'nay':
      return '01';
    case 'pass':
      return '02';
    default:
      throw new InvalidBallotValueError(ballot);
  }
};

export const ballotDecoder = (ballot: Uint8ArrayConsumer): string => {
  const value = ballot.consume(1);
  switch (value[0]) {
    case 0x00:
      return 'yay';
    case 0x01:
      return 'nay';
    case 0x02:
      return 'pass';
    default:
      throw new DecodeBallotValueError(value[0].toString());
  }
};

export const delegateEncoder = (val: string) => {
  if (val) {
    return boolEncoder(true) + pkhEncoder(val);
  } else {
    return boolEncoder(false);
  }
};

export const int32Encoder = (val: number | string): string => {
  const num = parseInt(String(val), 10);
  const byte = [];
  for (let i = 0; i < 4; i++) {
    const shiftBy = (4 - (i + 1)) * 8;
    byte.push((num & (0xff << shiftBy)) >> shiftBy);
  }
  return Buffer.from(byte).toString('hex');
};

export const int32Decoder = (val: Uint8ArrayConsumer) => {
  const num = val.consume(4);
  let finalNum = 0;
  for (let i = 0; i < num.length; i++) {
    finalNum = finalNum | (num[i] << ((num.length - (i + 1)) * 8));
  }

  return finalNum;
};

export const int16Encoder = (val: number | string): string => {
  const num = parseInt(String(val), 10);
  const byte = [];
  for (let i = 0; i < 2; i++) {
    const shiftBy = (2 - (i + 1)) * 8;
    byte.push((num & (0xff << shiftBy)) >> shiftBy);
  }
  return Buffer.from(byte).toString('hex');
};

export const int16Decoder = (val: Uint8ArrayConsumer) => {
  const num = val.consume(2);
  let finalNum = 0;
  for (let i = 0; i < num.length; i++) {
    finalNum = finalNum | (num[i] << ((num.length - (i + 1)) * 8));
  }

  return finalNum;
};

export const boolDecoder = (val: Uint8ArrayConsumer): boolean => {
  const bool = val.consume(1);
  return bool[0] === 0xff;
};

export const delegateDecoder = (val: Uint8ArrayConsumer) => {
  const hasDelegate = boolDecoder(val);
  if (hasDelegate) {
    return pkhDecoder(val);
  }
};

export const pkhEncoder = (val: string) => {
  const pubkeyPrefix = val.substr(0, 3);
  switch (pubkeyPrefix) {
    case Prefix.TZ1:
      return '00' + prefixEncoder(Prefix.TZ1)(val);
    case Prefix.TZ2:
      return '01' + prefixEncoder(Prefix.TZ2)(val);
    case Prefix.TZ3:
      return '02' + prefixEncoder(Prefix.TZ3)(val);
    default:
      throw new InvalidKeyHashError(val);
  }
};

export const publicKeyEncoder = (val: string) => {
  const pubkeyPrefix = val.substr(0, 4);
  switch (pubkeyPrefix) {
    case Prefix.EDPK:
      return '00' + prefixEncoder(Prefix.EDPK)(val);
    case Prefix.SPPK:
      return '01' + prefixEncoder(Prefix.SPPK)(val);
    case Prefix.P2PK:
      return '02' + prefixEncoder(Prefix.P2PK)(val);
    default:
      throw new InvalidPublicKeyError(val);
  }
};

export const addressEncoder = (val: string): string => {
  const pubkeyPrefix = val.substr(0, 3);
  switch (pubkeyPrefix) {
    case Prefix.TZ1:
    case Prefix.TZ2:
    case Prefix.TZ3:
      return '00' + pkhEncoder(val);
    case Prefix.KT1:
      return '01' + prefixEncoder(Prefix.KT1)(val) + '00';
    default:
      throw new InvalidAddressError(val);
  }
};

export const smartContractAddressEncoder = (val: string): string => {
  const prefix = val.substring(0, 3);

  if (prefix === Prefix.KT1) {
    return '01' + prefixEncoder(Prefix.KT1)(val) + '00';
  }
  throw new InvalidContractAddressError(val);
};

export const publicKeyDecoder = (val: Uint8ArrayConsumer) => {
  const preamble = val.consume(1);
  switch (preamble[0]) {
    case 0x00:
      return prefixDecoder(Prefix.EDPK)(val);
    case 0x01:
      return prefixDecoder(Prefix.SPPK)(val);
    case 0x02:
      return prefixDecoder(Prefix.P2PK)(val);
    default:
      throw new InvalidPublicKeyError(val.toString());
  }
};

export const addressDecoder = (val: Uint8ArrayConsumer) => {
  const preamble = val.consume(1);
  switch (preamble[0]) {
    case 0x00:
      return pkhDecoder(val);
    case 0x01: {
      const address = prefixDecoder(Prefix.KT1)(val);
      val.consume(1);
      return address;
    }
    default:
      throw new InvalidAddressError(val.toString());
  }
};

export const smartContractAddressDecoder = (val: Uint8ArrayConsumer) => {
  const preamble = val.consume(1);
  if (preamble[0] === 0x01) {
    const scAddress = prefixDecoder(Prefix.KT1)(val);
    val.consume(1);
    return scAddress;
  }
  throw new InvalidContractAddressError(val.toString());
};

export const zarithEncoder = (n: string): string => {
  const fn: Array<string> = [];
  let nn = new BigNumber(n, 10);
  if (nn.isNaN()) {
    throw new TypeError(`Invalid zarith number ${n}`);
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (nn.lt(128)) {
      if (nn.lt(16)) fn.push('0');
      fn.push(nn.toString(16));
      break;
    } else {
      let b = nn.mod(128);
      nn = nn.minus(b);
      nn = nn.dividedBy(128);
      b = b.plus(128);
      fn.push(b.toString(16));
    }
  }
  return fn.join('');
};

export const zarithDecoder = (n: Uint8ArrayConsumer): string => {
  let mostSignificantByte = 0;
  while (mostSignificantByte < n.length() && (n.get(mostSignificantByte) & 128) !== 0) {
    mostSignificantByte += 1;
  }

  let num = new BigNumber(0);
  for (let i = mostSignificantByte; i >= 0; i -= 1) {
    const tmp = n.get(i) & 0x7f;
    num = num.multipliedBy(128);
    num = num.plus(tmp);
  }

  n.consume(mostSignificantByte + 1);
  return new BigNumber(num).toString();
};

export const entrypointDecoder = (value: Uint8ArrayConsumer) => {
  const preamble = pad(value.consume(1)[0], 2);

  if (preamble in entrypointMapping) {
    return entrypointMapping[preamble];
  } else {
    const entry = extractRequiredLen(value, 1);

    const entrypoint = Buffer.from(entry).toString('utf8');

    if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
      throw new OversizedEntryPointError(entrypoint);
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
export const entrypointEncoder = (entrypoint: string) => {
  if (entrypoint in entrypointMappingReverse) {
    return `${entrypointMappingReverse[entrypoint]}`;
  } else {
    if (entrypoint.length > ENTRYPOINT_MAX_LENGTH) {
      throw new OversizedEntryPointError(entrypoint);
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

export const valueParameterEncoder = (value: MichelsonValue) => {
  const valueEncoded = valueEncoder(value);
  return `${pad(valueEncoded.length / 2)}${valueEncoded}`;
};

export const valueParameterDecoder = (val: Uint8ArrayConsumer) => {
  const value = extractRequiredLen(val);
  return valueDecoder(new Uint8ArrayConsumer(value));
};

export const blockPayloadHashEncoder = prefixEncoder(Prefix.VH);
export const blockPayloadHashDecoder = prefixDecoder(Prefix.VH);

export const entrypointNameEncoder = (entrypoint: string) => {
  const value = { string: entrypoint };
  return `${valueEncoder(value).slice(2)}`;
};

export const entrypointNameDecoder = (val: Uint8ArrayConsumer) => {
  const entry = extractRequiredLen(val);

  return Buffer.from(entry).toString('utf8');
};

export const txRollupOriginationParamEncoder = (_value: string) => {
  return '';
};

export const txRollupOriginationParamDecoder = (_val: Uint8ArrayConsumer) => {
  return {};
};

export const txRollupIdEncoder = prefixEncoder(Prefix.TXR1);

export const txRollupIdDecoder = prefixDecoder(Prefix.TXR1);

export const txRollupBatchContentEncoder = (value: string) => {
  return `${pad(value.length / 2)}${value}`;
};

export const txRollupBatchContentDecoder = (val: Uint8ArrayConsumer) => {
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
