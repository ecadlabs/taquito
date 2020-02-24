import { addressDecoder, pkhDecoder, signatureDecoder } from "./codec";
import { bytesDecoder, intDecoder, stringDecoder } from "./michelson/codec";
import { Uint8ArrayConsumer } from "./uint8array-consumer";
import { MichelsonType } from "./constants";

export function unpackString(data: Uint8ArrayConsumer) {
  data.consume(1)
  return stringDecoder(data);
}

export function unpackInt(data: Uint8ArrayConsumer) {
  data.consume(1)
  return intDecoder(data);
}

export function unpackBytes(data: Uint8ArrayConsumer) {
  data.consume(1)
  return bytesDecoder(data);
}

export function unpackAddress(data: Uint8ArrayConsumer) {
  data.consume(1)
  const { bytes } = bytesDecoder(data) as any;
  const addressData = Uint8ArrayConsumer.fromHexString(bytes);
  return { "string": addressDecoder(addressData) }
}

export function unpackKeyhash(data: Uint8ArrayConsumer) {
  data.consume(1)
  const { bytes } = bytesDecoder(data) as any;
  const addressData = Uint8ArrayConsumer.fromHexString(bytes);
  return { "string": pkhDecoder(addressData) }
}

export function unpackSignature(data: Uint8ArrayConsumer) {
  data.consume(1)
  const { bytes } = bytesDecoder(data) as any;
  const addressData = Uint8ArrayConsumer.fromHexString(bytes);
  return { "string": signatureDecoder(addressData) }
}

export function unpackPair(data: Uint8ArrayConsumer, type: any) {
  data.consume(2)
  const left: any = unpackValue(data, type.args[0])
  const right: any = unpackValue(data, type.args[1])
  return { prim: "Pair", args: [left, right] }
}

export function unpackValue(data: Uint8ArrayConsumer, type: any) {
  if (Array.isArray(type) || Array.isArray(data)) {
    throw new Error();
  }

  const prim = type.prim;

  switch (prim) {
    case MichelsonType.STRING:
      return unpackString(data);
    case MichelsonType.INT:
    case MichelsonType.NAT:
    case MichelsonType.MUTEZ:
      return unpackInt(data);
    case MichelsonType.BYTES:
      return unpackBytes(data);
    case MichelsonType.ADDRESS:
      return unpackAddress(data);
    case MichelsonType.KEY_HASH:
      return unpackKeyhash(data);
    case MichelsonType.SIGNATURE:
      return unpackSignature(data);
    case MichelsonType.PAIR:
      return unpackPair(data, type);
    default:
      throw new Error();
  }
}
