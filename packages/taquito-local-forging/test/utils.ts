export const fromHexString = (hexString: string) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  new Uint8Array(hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
