import {
  BytesValue,
  bytesDecoder,
  decodeAnnots,
  encodeAnnots,
  extractRequiredLen,
  IntValue,
  isBytes,
  isInt,
  isPrim,
  isString,
  MichelsonValue,
  OperationDecodingError,
  PrimValue,
  scriptDecoder,
  scriptEncoder,
  stringDecoder,
  stringEncoder,
  stripLengthPrefixFromBytes,
  StringValue,
  Uint8ArrayConsumer,
  valueDecoder,
  valueEncoder,
} from '../../src/taquito-local-forging';

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

  it('exposes Michelson value codec and type guards from the public @taquito/local-forging entrypoint', () => {
    const primVal: PrimValue = {
      prim: 'Pair',
      args: [{ string: 'Tezos Signed Message: example.com 2026-10-20T00:00:00Z Hello' }, { int: '42' }],
    };
    const bytesVal: BytesValue = { bytes: 'deadbeef' };
    const stringVal: StringValue = { string: 'hello' };
    const intVal: IntValue = { int: '123' };
    const expr: MichelsonValue = [primVal, bytesVal, stringVal, intVal];

    expect(isPrim(primVal)).toBe(true);
    expect(isBytes(bytesVal)).toBe(true);
    expect(isString(stringVal)).toBe(true);
    expect(isInt(intVal)).toBe(true);

    // Kukai packed expression flow: prefix '05' + valueEncoder(expr), decoded via valueDecoder(Uint8ArrayConsumer.fromHexString(payload.slice(2)))
    const packedPayload = `05${valueEncoder(expr)}`;
    const consumer = Uint8ArrayConsumer.fromHexString(packedPayload.slice(2));
    expect(valueDecoder(consumer)).toEqual(expr);
    expect(consumer.length()).toBe(0);

    // Script codec round-trip
    const script = {
      code: [{ prim: 'parameter', args: [{ prim: 'unit' }] }],
      storage: { prim: 'Unit' },
    };
    const encodedScript = scriptEncoder(script);
    const scriptConsumer = Uint8ArrayConsumer.fromHexString(encodedScript);
    expect(scriptDecoder(scriptConsumer)).toEqual(script);
    expect(scriptConsumer.length()).toBe(0);
  });

  it('encodes and decodes Michelson strings, bytes, and annotations without global Buffer and preserves UTF-8 edge cases', () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Buffer');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).Buffer;
    try {
      expect('Buffer' in globalThis).toBe(false);

      // Empty string round-trip
      expect(stringEncoder({ string: '' })).toBe('0100000000');
      expect(valueDecoder(Uint8ArrayConsumer.fromHexString('0100000000'))).toEqual({
        string: '',
      });

      // Multi-byte UTF-8 round-trip
      const utf8Encoded = stringEncoder({ string: 'taquito 🐙 café' });
      expect(utf8Encoded).toBe('01000000127461717569746f20f09f909920636166c3a9');
      expect(stringDecoder(Uint8ArrayConsumer.fromHexString(utf8Encoded).slice(1))).toEqual({
        string: 'taquito 🐙 café',
      });

      // Lone UTF-16 high and low surrogates replace with U+FFFD (efbfbd)
      expect(stringEncoder({ string: String.fromCharCode(0xd800, 0xd801) })).toBe(
        '0100000006efbfbdefbfbd'
      );
      expect(stringEncoder({ string: '\udc00' })).toBe('0100000003efbfbd');

      // Truncated and overlong UTF-8 sequences replace with U+FFFD without corrupting subsequent calls
      expect(valueDecoder(Uint8ArrayConsumer.fromHexString('0100000002e282'))).toEqual({
        string: '\uFFFD',
      });
      expect(valueDecoder(Uint8ArrayConsumer.fromHexString('0100000002c0af'))).toEqual({
        string: '\uFFFD\uFFFD',
      });
      expect(valueDecoder(Uint8ArrayConsumer.fromHexString('01000000026f6b'))).toEqual({
        string: 'ok',
      });

      // Leading UTF-8 BOM (efbbbf) is preserved, matching Node Buffer.toString('utf8')
      expect(valueDecoder(Uint8ArrayConsumer.fromHexString('0100000004efbbbf41'))).toEqual({
        string: '\uFEFFA',
      });

      // Non-string inputs throw TypeError
      expect(() => stringEncoder({ string: 42 as unknown as string })).toThrow(TypeError);
      expect(() =>
        valueEncoder({ prim: 'Pair', annots: [42 as unknown as string] })
      ).toThrow(TypeError);

      // Bytes decoder without Buffer
      expect(bytesDecoder(Uint8ArrayConsumer.fromHexString('00000004deadbeef'))).toEqual({
        bytes: 'deadbeef',
      });

      // Annotations round-trip without Buffer, including byte pairs whose hex crosses '20' (0x02, 0x01 -> '0201')
      const annots = ['%ep', ':ty', '@var', '\uFEFFbom', '\x02\x01'];
      const encodedAnnots = encodeAnnots(annots);
      expect(decodeAnnots(Uint8ArrayConsumer.fromHexString(encodedAnnots))).toEqual(annots);
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, 'Buffer', descriptor);
      }
    }
  });
});
