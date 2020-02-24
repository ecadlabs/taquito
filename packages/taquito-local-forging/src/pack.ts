import { CODEC, MichelsonType, opMapping, opMappingReverse } from "./constants";
import { getCodec } from "./taquito-local-forging";

export function packString(data: { string: string }, _type: { prim: MichelsonType.STRING }) {
  return getCodec(CODEC.MICHELSON).encoder(data);
}

export function packInt(data: { int: string }, _type: { prim: MichelsonType.INT }) {
  return getCodec(CODEC.MICHELSON).encoder(data);
}

export function packBytes(data: { bytes: string }, _type: { prim: MichelsonType.BYTES }) {
  return getCodec(CODEC.MICHELSON).encoder(data);
}

export function packAddress(data: { bytes?: string, string?: string }, _type: { prim: MichelsonType.ADDRESS }) {
  let address = data.bytes;
  if (data.string) {
    address = getCodec(CODEC.ADDRESS).encoder(data.string);
  }

  if (!address) {
    throw new Error();
  }

  return packBytes({ bytes: address }, { prim: MichelsonType.BYTES });
}

export function packKeyHash(data: { bytes?: string, string?: string }, _type: { prim: MichelsonType.KEY_HASH }) {
  let address = data.bytes;
  if (data.string) {
    address = getCodec(CODEC.PKH).encoder(data.string);
  }

  if (!address) {
    throw new Error();
  }

  return packBytes({ bytes: address }, { prim: MichelsonType.BYTES });
}

// TODO: Verify signature can take raw bytes
export function packSignature(data: { bytes?: string, string?: string }, _type: { prim: MichelsonType.SIGNATURE }) {
  let address = data.bytes;
  if (data.string) {
    address = getCodec(CODEC.SIGNATURE).encoder(data.string);
  }

  if (!address) {
    throw new Error();
  }

  return packBytes({ bytes: address }, { prim: MichelsonType.BYTES });
}

export function packPair({ args: [valueLeft, valueRight] }: { prim: "Pair", args: any[] }, { args: [typeLeft, typeRight] }: { prim: "pair", args: any[] }): any {
  return `${opMappingReverse['Pair']}07${packValue(valueLeft, typeLeft) + packValue(valueRight, typeRight)}`
}

export function packValue(data: any, type: any) {
  if (Array.isArray(type) || Array.isArray(data)) {
    throw new Error();
  }

  const prim = type.prim;

  switch (prim) {
    case MichelsonType.STRING:
      return packString(data, type);
    case MichelsonType.INT:
    case MichelsonType.NAT:
    case MichelsonType.MUTEZ:
      return packInt(data, type);
    case MichelsonType.BYTES:
      return packInt(data, type);
    case MichelsonType.ADDRESS:
      return packAddress(data, type);
    case MichelsonType.KEY_HASH:
      return packKeyHash(data, type);
    case MichelsonType.SIGNATURE:
      return packSignature(data, type);
    case MichelsonType.PAIR:
      return packPair(data, type)
    default:
      throw new Error();
  }
}
