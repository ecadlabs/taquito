declare module 'bs58check' {
  export function decode(encodedStr: string): Buffer;
  export function encode(buf: Buffer): string;
  export function decodeUnsafe(string: string): Buffer | undefined;
}
