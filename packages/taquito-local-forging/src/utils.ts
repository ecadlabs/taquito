const HEX_BYTES = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'));

let utf8Encoder: TextEncoder | undefined;
let utf8Decoder: TextDecoder | undefined;

export const concat = (...arr: Uint8Array[]) => {
  return arr.reduce((a: Uint8Array, b: Uint8Array) => {
    const c = new Uint8Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }, new Uint8Array());
};

export const toHexString = (bytes: Uint8Array): string => {
  const parts = new Array<string>(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    parts[i] = HEX_BYTES[bytes[i]];
  }
  return parts.join('');
};

export const encodeUtf8ToHex = (value: string): string => {
  if (typeof value !== 'string') {
    throw new TypeError('The "string" argument must be of type string.');
  }
  utf8Encoder ??= new TextEncoder();
  return toHexString(utf8Encoder.encode(value));
};

export const decodeUtf8 = (bytes: Uint8Array): string => {
  utf8Decoder ??= new TextDecoder('utf-8', { ignoreBOM: true });
  return utf8Decoder.decode(bytes);
};

export const pad = (num: number, paddingLen = 8) => {
  return num.toString(16).padStart(paddingLen, '0');
};
