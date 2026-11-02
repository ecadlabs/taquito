/** Shuffle in place using the SDK's existing secure random-byte provider. */
export function shuffleOutputs<T>(outputs: T[], randomBytes: (length: number) => Uint8Array): void {
  for (let i = outputs.length - 1; i > 0; i--) {
    const bound = i + 1;
    const limit = Math.floor(0x100000000 / bound) * bound;
    let sample: number;
    do {
      const bytes = randomBytes(4);
      if (bytes.length !== 4) throw new Error('Expected four random bytes');
      sample = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0, true);
    } while (sample >= limit);
    const j = sample % bound;
    [outputs[i], outputs[j]] = [outputs[j]!, outputs[i]!];
  }
}
