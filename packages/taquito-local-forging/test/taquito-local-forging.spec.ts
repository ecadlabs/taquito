import {
  CODEC,
  decoders,
  getCodec,
  LocalForger,
  ProtocolsHash,
  Uint8ArrayConsumer,
} from '../src/taquito-local-forging';
import {
  ticketCode3Proto14,
  ticketStorage3Proto14,
} from '../../../integration-tests/data/code_with_ticket_proto14';
import { commonCases, limaCases } from '../../../integration-tests/data/allTestsCases';
import {
  InvalidOperationSchemaError,
  UnsupportedOperationError,
} from '../src/error';
import { InvalidBlockHashError } from "@taquito/core"

import { InvalidOperationKindError } from '@taquito/core';
import { schemaDecoder, SeedNonceRevelationSchema } from '../src/schema/operation';
import { ProtoInferiorTo } from '../src/protocols';

describe('Forge and parse operations default protocol', () => {
  const localForger = new LocalForger();
  commonCases.forEach(({ name, operation, expected }) => {
    test(`Common test: ${name}`, async (done) => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
      done();
    });
  });

  describe('Forge and parse operations lima protocol', () => {
    const localForger = new LocalForger(ProtocolsHash.PtLimaPtL);
    limaCases.forEach(({ name, operation, expected }) => {
      test(`Lima test: ${name}`, async (done) => {
        const result = await localForger.forge(operation);
        expect(await localForger.parse(result)).toEqual(expected || operation);
        done();
      });
    });
  });

  describe('Forge should validate parameters against the schema', () => {
    const hexToParse = `0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28`;

    const localForger = new LocalForger();

    test('Should throw an error when operation kind is invalid', async () => {
      const operation: any = {
        branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
        contents: [
          {
            kind: 'invalid',
            counter: '1',
            source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            public_key: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
            fee: '10000',
            gas_limit: '10',
            storage_limit: '10',
          },
        ],
      };
      expect(() => {
        localForger.forge(operation);
      }).toThrow(InvalidOperationKindError);
      expect(() => {
        localForger.forge(operation);
      }).toThrow(
        expect.objectContaining({
          message: expect.stringContaining("The operation kind 'invalid' is unsupported"),
        })
      );
      expect(() => {
        localForger.forge(operation);
      }).toThrow(
        expect.objectContaining({
          name: expect.stringContaining('InvalidOperationKindError'),
        })
      );
    });

    test('Should throw error when parameters are missing', async () => {
      const operation: any = {
        branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
        contents: [
          {
            kind: 'reveal',
            counter: '1',
            public_key: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
            fee: '10000',
            gas_limit: '10',
            storage_limit: '10',
          },
        ],
      };
      expect(() => {
        localForger.forge(operation);
      }).toThrow(InvalidOperationSchemaError);
      expect(() => {
        localForger.forge(operation);
      }).toThrow(
        expect.objectContaining({
          message: expect.stringContaining('Missing properties: source'),
        })
      );
      expect(() => {
        localForger.forge(operation);
      }).toThrow(
        expect.objectContaining({
          name: expect.stringContaining('InvalidOperationSchemaError'),
        })
      );
    });

    test('Should throw error when branch parameter has invalid block hash', async () => {
      const operation: any = {
        branch: 'Invalid_Block_Hash',
        contents: [
          {
            kind: 'reveal',
            counter: '1',
            source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            public_key: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
            fee: '10000',
            gas_limit: '10',
            storage_limit: '10',
          },
        ],
      };
      expect(() => {
        localForger.forge(operation);
      }).toThrow(InvalidBlockHashError);
      expect(() => {
        localForger.forge(operation);
      }).toThrow(
        expect.objectContaining({
          message: expect.stringContaining('The block hash Invalid_Block_Hash is invalid'),
        })
      );
      expect(() => {
        localForger.forge(operation);
      }).toThrow(
        expect.objectContaining({
          name: expect.stringContaining('InvalidBlockHashError'),
        })
      );
    });

    test('Should not throw error when origination and delegation does not have a "delegate" property', async () => {
      const operation: any = {
        branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
        contents: [
          {
            kind: 'delegation',
            counter: '1',
            source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            fee: '10000',
            gas_limit: '10',
            storage_limit: '10',
          },
          {
            kind: 'origination',
            counter: '1',
            source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            fee: '10000',
            gas_limit: '10',
            storage_limit: '10',
            balance: '0',
            script: {
              code: ticketCode3Proto14,
              storage: ticketStorage3Proto14,
            },
          },
        ],
      };
      expect(localForger.forge(operation)).toBeDefined();
    });

    test('Should not throw error when transaction operation does not have a "parameters" property', async () => {
      const operation: any = {
        branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
        contents: [
          {
            kind: 'transaction',
            counter: '1',
            source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            fee: '10000',
            gas_limit: '10',
            storage_limit: '10',
            destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            amount: '1000',
          },
        ],
      };
      expect(localForger.forge(operation)).toBeDefined();
    });

    test('Should throw an error when parsing a forged byte with an invalid operation kind', async () => {
      const invalidForged =
        'a99b946c97ada0f42c1bdeae0383db7893351232a832d00d0cd716eb6f66e5614c0035e993d8c7aaa42b5e3ccd86a33390ececc73abd904e010a0ae807000035e993d8c7aaa42b5e3ccd86a33390ececc73abd00';
      expect(() => {
        localForger.parse(invalidForged);
      }).toThrow(UnsupportedOperationError);
      expect(() => {
        localForger.parse(invalidForged);
      }).toThrow(
        expect.objectContaining({
          message: expect.stringContaining("The operation '76' is unsupported"),
        })
      );
      expect(() => {
        localForger.parse(invalidForged);
      }).toThrow(
        expect.objectContaining({
          name: expect.stringContaining('UnsupportedOperationError'),
        })
      );
    });

    test(`Verify getCodec for CODEC.SECRET`, async (done) => {
      const codec = CODEC.SECRET;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const consumer = myGetCodec.decoder(hexToParse);
      expect(consumer).toBeDefined();
      expect(consumer).toEqual('0572cbea904d67468808c8eb50a9450c9721db30');
      done();
    });

    test(`Verify getCodec for CODEC.RAW`, async (done) => {
      const codec = CODEC.RAW;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const consumer = myGetCodec.decoder(hexToParse);
      expect(consumer).toBeDefined();
      expect(consumer).toEqual('0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62a');
      done();
    });

    test(`Verify getCodec for CODEC.OP_DELEGATION`, async (done) => {
      const codec = CODEC.OP_DELEGATION;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const consumer = myGetCodec.decoder(hexToParse);
      expect(consumer).toEqual({
        counter: '161756491',
        fee: '114',
        gas_limit: '103',
        storage_limit: '70',
      });
      done();
    });

    test(`Verify Arrow Function for CODEC.OP_SEED_NONCE_REVELATION`, async (done) => {
      const codec = CODEC.OP_SEED_NONCE_REVELATION;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const gotCodec = myGetCodec.decoder(hexToParse);
      expect(gotCodec).toStrictEqual({
        level: 91409386,
        nonce: '904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb',
      });

      const consumer = Uint8ArrayConsumer.fromHexString(hexToParse);
      expect(decoders[codec](consumer)).toStrictEqual(gotCodec);
      expect(schemaDecoder(decoders)(SeedNonceRevelationSchema)(consumer)).toBeDefined();
      done();
    });

    test(`Verify Arrow Functions for CODEC.SECRET is toHexString(val.consume(20))`, async (done) => {
      const codec = CODEC.SECRET;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const encodeCodec = myGetCodec.encoder(hexToParse);
      expect(encodeCodec).toEqual(
        '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28'
      );
      const decodeCodec = myGetCodec.decoder(hexToParse);
      expect(decodeCodec).toEqual('0572cbea904d67468808c8eb50a9450c9721db30');
      done();
    });

    test(`Verify Arrow Function for CODEC.RAW is toHexString(val.consume(32)),`, async (done) => {
      const codec = CODEC.RAW;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const encodeCodec = myGetCodec.encoder(hexToParse);
      expect(encodeCodec).toEqual(
        '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28'
      );
      const decodeCodec = myGetCodec.decoder(hexToParse);
      expect(decodeCodec).toEqual(
        '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62a'
      );
      done();
    });

    test(`Verify Arrow Function for CODEC.OP_ACTIVATE_ACCOUNT`, async (done) => {
      const codec = CODEC.OP_ACTIVATE_ACCOUNT;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const gotCodec = myGetCodec.decoder(hexToParse);
      expect(gotCodec).toEqual({
        pkh: 'tz1L8qbHKzqFmLiZqxaJdMEWrCwmmrSw2wj4',
        secret: '9128012543902d0ac358a62ae28f75bb8f1c7c42',
      });

      const consumer = Uint8ArrayConsumer.fromHexString(hexToParse);
      expect(decoders[codec](consumer)).toStrictEqual({
        pkh: 'tz1L8qbHKzqFmLiZqxaJdMEWrCwmmrSw2wj4',
        secret: '9128012543902d0ac358a62ae28f75bb8f1c7c42',
      });
      done();
    });

    test(`test getCodec to verify codec Manager sent to decoders is defined`, async (done) => {
      const myGetCodec = getCodec(CODEC.MANAGER, ProtocolsHash.PtKathman).decoder(
        '7c842c15c8b0c8fd228e6cb5302a50201f41642dd36b699003fb3c857920bc9d'
      );
      expect(myGetCodec).toEqual({
        branch: 'BLf7wKNryZRXibjzM4TjNBSMgNN4qJVhxRRuxo3uu3SegsFqkUd',
        contents: [],
      });
      done();
    });

    describe('Verify the ProtoInferiorTo function in protocols.ts', () => {
      const a = ProtocolsHash.Pt24m4xi;
      const b = ProtocolsHash.PtKathman;

      test('Verify protocol Babylon is inferior to protocol Kathmandu', () => {
        const trueProtoInferiorTo = ProtoInferiorTo(a, b);
        expect(trueProtoInferiorTo).toEqual(true);
      });

      test('Verify protocol Kathmandu is not inferior to protocol Babylon', () => {
        const falseProtoInferiorTo = ProtoInferiorTo(b, a);
        expect(falseProtoInferiorTo).toEqual(false);
      });
    });
  });
});
