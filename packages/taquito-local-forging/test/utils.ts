export const fromHexString = (hexString: string) =>
  new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
