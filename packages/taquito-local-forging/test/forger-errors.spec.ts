import { ballotDecoder, ballotEncoder, entrypointDecoder } from '../src/codec';
import {
  DecodeBallotValueError,
  InvalidBallotValueError,
  InvalidHexStringError,
  OversizedEntryPointError,
} from '../src/error';
import { bytesEncoder } from '../src/michelson/codec';
import { Uint8ArrayConsumer } from '../src/uint8array-consumer';

describe('Tests for errors thrown when forging fails', () => {
  test('Verify that ballotEncoder functions correctly and returns InvalidBallotValueError on unknown case ', () => {
    expect(ballotEncoder('yay')).toEqual('00');
    expect(ballotEncoder('nay')).toEqual('01');
    expect(ballotEncoder('pass')).toEqual('02');
    expect(() => {
      ballotEncoder('foobar');
    }).toThrow(InvalidBallotValueError);
    expect(() => {
      ballotEncoder('foobar');
    }).toThrow(
      expect.objectContaining({
        message: expect.stringContaining("The ballot value 'foobar' is invalid"),
      })
    );
  });

  test('Verify that ballotDecoder functions correctly and returns DecodeBallotValueError on unknown case ', () => {
    expect(
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toEqual('yay');
    expect(
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '01029caa79bfddd2bc198ff8b408e6fde1a10accb59a8148b1958f175d83b957b579'
        )
      )
    ).toEqual('nay');
    expect(
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '02038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
        )
      )
    ).toEqual('pass');
    expect(() => {
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '03038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
        )
      );
    }).toThrow(DecodeBallotValueError);
    expect(() => {
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '03038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
        )
      );
    }).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('Failed to decode ballot value 3'),
      })
    );
    expect(() => {
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '03038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
        )
      );
    }).toThrow(
      expect.objectContaining({
        name: expect.stringContaining('DecodeBallotValueError'),
      })
    );
  });

  test('Verify that bytesEncoder returns InvalidHexStringError for invalid hex input', () => {
    expect(() => {
      bytesEncoder({ bytes: 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' });
    }).toThrow(InvalidHexStringError);
    expect(() => {
      bytesEncoder({ bytes: 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' });
    }).toThrow(
      expect.objectContaining({
        message: expect.stringContaining(
          "The hex string 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' is invalid"
        ),
      })
    );
    expect(() => {
      bytesEncoder({ bytes: 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' });
    }).toThrow(
      expect.objectContaining({
        name: expect.stringContaining('InvalidHexStringError'),
      })
    );
  });

  test('Verify that entrypointDecoder returns OversizedEntryPointError for entrypoint longer than max length', () => {
    const hexString =
      '055c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae95c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9';
    expect(() => {
      entrypointDecoder(Uint8ArrayConsumer.fromHexString(hexString));
    }).toThrow(OversizedEntryPointError);
    expect(() => {
      entrypointDecoder(Uint8ArrayConsumer.fromHexString(hexString));
    }).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('Oversized entrypoint'),
      })
    );
    expect(() => {
      entrypointDecoder(Uint8ArrayConsumer.fromHexString(hexString));
    }).toThrow(
      expect.objectContaining({
        name: expect.stringContaining('OversizedEntryPointError'),
      })
    );
  });
});
