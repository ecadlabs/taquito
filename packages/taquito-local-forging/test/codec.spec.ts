import { entrypointEncoder, entrypointDecoder } from '../src/codec';
import { Uint8ArrayConsumer } from '../src/uint8array-consumer';

describe('Entrypoint', () => {
  test('Entrypoint encoder', () => {
    expect(entrypointEncoder('_this_entrypoint_is_borderline_')).toEqual(
      'ff1f5f746869735f656e747279706f696e745f69735f626f726465726c696e655f'
    );
  });

  test('Entrypoint encoder should throw if entrypoint is oversized', () => {
    expect(() => entrypointEncoder('this_entrypoint_is_way_too_long_for_the_spec')).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('this_entrypoint_is_way_too_long_for_the_spec'),
      })
    );
  });

  test('Entrypoint decoder', () => {
    expect(
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          'ff1f5f746869735f656e747279706f696e745f69735f626f726465726c696e655f'
        )
      )
    ).toEqual('_this_entrypoint_is_borderline_');
  });

  test('Entrypoint decoder should throw if entrypoint is oversized', () => {
    expect(() =>
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          'ff205f746869735f656e747279706f696e745f69735f626f726465726c696e655f5f'
        )
      )
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('_this_entrypoint_is_borderline__'),
      })
    );
  });
});
