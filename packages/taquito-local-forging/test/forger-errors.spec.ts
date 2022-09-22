import { ballotDecoder, ballotEncoder } from '../src/codec';
import { DecodeBallotValueError, InvalidBallotValueError, InvalidHexStringError } from '../src/error';
import { bytesEncoder } from '../src/michelson/codec';
import { Uint8ArrayConsumer } from '../src/uint8array-consumer';

describe('Tests for errors thrown when forging fails', () => {

    test('Verify that ballotEncoder functions correctly and returns InvalidBallotValueError on unknown case ', () => {
        expect(ballotEncoder('yay')).toEqual('00')
        expect(ballotEncoder('nay')).toEqual('01')
        expect(ballotEncoder('pass')).toEqual('02')
        try {
            ballotEncoder('foobar')
        } catch (e: any) {
            expect(e).toBeInstanceOf(InvalidBallotValueError);
            expect(e.message).toEqual(`The ballot value 'foobar' is invalid`);
        }
    });

    test('Verify that ballotDecoder functions correctly and returns DecodeBallotValueError on unknown case ', () => {
        expect(ballotDecoder(Uint8ArrayConsumer.fromHexString('005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'))).toEqual('yay')
        expect(ballotDecoder(Uint8ArrayConsumer.fromHexString('01029caa79bfddd2bc198ff8b408e6fde1a10accb59a8148b1958f175d83b957b579'))).toEqual('nay')
        expect(ballotDecoder(Uint8ArrayConsumer.fromHexString('02038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'))).toEqual('pass')
        try {
            ballotDecoder(Uint8ArrayConsumer.fromHexString('03038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'))
        } catch (e: any) {
            expect(e).toBeInstanceOf(DecodeBallotValueError);
            expect(e.message).toEqual(`Failed to decode ballot value 3`);
            console.log(e.message)
        }
    });

    test('Verify that bytesEncoder returns InvalidHexStringError for invalid hex input', () => {
        try {
            bytesEncoder({ bytes: 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' })
        } catch (e: any) {
            expect(e).toBeInstanceOf(InvalidHexStringError);
            expect(e.message).toEqual(`The hex string 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' is invalid`)
        }
    });
});
