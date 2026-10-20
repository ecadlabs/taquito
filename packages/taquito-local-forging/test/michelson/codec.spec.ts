import {
  extractRequiredLen,
  stripLengthPrefixFromBytes,
  valueDecoder,
  valueEncoder,
} from '../../src/michelson/codec';
import { OperationDecodingError, Uint8ArrayConsumer } from '../../src/taquito-local-forging';

describe('unint8arrayconsumer', () => {
  it('should not stall ', () => {
    const value = Uint8ArrayConsumer.fromHexString(
      '000000d6000000670000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74000000670000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
    );
    const consumer = new Uint8ArrayConsumer(extractRequiredLen(value));
    const extracted = stripLengthPrefixFromBytes(consumer, 4);
    const arr = extracted.map((val) => Buffer.from(val).toString('hex'));
    expect(arr).toEqual([
      '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
      '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
    ]);
    expect(consumer.length()).toBe(0);
  });

  it('stripLengthPrefixFromBytes works when consumer already has a non-zero offset', () => {
    // 2-byte prefix (ffff) followed by two 4-byte-length-prefixed items: [aa, bbcc]
    const consumer = Uint8ArrayConsumer.fromHexString('ffff00000001aa00000002bbcc');
    expect(consumer.consume(2)).toEqual(new Uint8Array([0xff, 0xff]));
    const extracted = stripLengthPrefixFromBytes(consumer, 4);
    expect(extracted).toEqual([new Uint8Array([0xaa]), new Uint8Array([0xbb, 0xcc])]);
    expect(consumer.length()).toBe(0);
  });

  it('stripLengthPrefixFromBytes handles empty inputs, empty items, custom prefix width, and truncated items', () => {
    expect(stripLengthPrefixFromBytes(Uint8ArrayConsumer.fromHexString(''))).toEqual([]);

    const emptyItems = Uint8ArrayConsumer.fromHexString('0000000000000000');
    expect(stripLengthPrefixFromBytes(emptyItems)).toEqual([
      new Uint8Array([]),
      new Uint8Array([]),
    ]);
    expect(emptyItems.length()).toBe(0);

    const oneByteLen = Uint8ArrayConsumer.fromHexString('01aa02bbcc');
    expect(stripLengthPrefixFromBytes(oneByteLen, 1)).toEqual([
      new Uint8Array([0xaa]),
      new Uint8Array([0xbb, 0xcc]),
    ]);
    expect(oneByteLen.length()).toBe(0);

    // Truncated second header
    expect(() =>
      stripLengthPrefixFromBytes(Uint8ArrayConsumer.fromHexString('00000001aa0001'))
    ).toThrow(OperationDecodingError);

    // Truncated second payload
    expect(() =>
      stripLengthPrefixFromBytes(Uint8ArrayConsumer.fromHexString('00000001aa00000003bb'))
    ).toThrow(OperationDecodingError);
  });

  it('round-trips 0-arg LAMBDA and LAMBDA_REC primitives without stealing sibling bytes', () => {
    for (const prim of ['LAMBDA', 'LAMBDA_REC'] as const) {
      const standalone = { prim };
      const encodedStandalone = valueEncoder(standalone);
      const standaloneConsumer = Uint8ArrayConsumer.fromHexString(encodedStandalone);
      expect(valueDecoder(standaloneConsumer)).toEqual(standalone);
      expect(standaloneConsumer.length()).toBe(0);

      const withSibling = [{ prim }, { int: '42' }];
      const encodedSeq = valueEncoder(withSibling);
      const seqConsumer = Uint8ArrayConsumer.fromHexString(encodedSeq);
      expect(valueDecoder(seqConsumer)).toEqual(withSibling);
      expect(seqConsumer.length()).toBe(0);
    }
  });
});
