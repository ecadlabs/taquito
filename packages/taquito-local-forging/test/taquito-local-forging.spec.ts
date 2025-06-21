import {
  CODEC,
  decoders,
  getCodec,
  LocalForger,
  ProtocolsHash,
  Uint8ArrayConsumer,
} from '../src/taquito-local-forging';
import { commonCases, seoulCases } from '../../../integration-tests/data/allTestsCases';
import { InvalidOperationSchemaError, UnsupportedOperationError } from '../src/errors';
import {
  InvalidBlockHashError,
  InvalidOperationKindError,
  ProhibitedActionError,
} from '@taquito/core';
import { schemaDecoder, SeedNonceRevelationSchema } from '../src/schema/operation';
import { ProtoInferiorTo } from '../src/protocols';

describe('Forge and parse operations default protocol', () => {
  const localForger = new LocalForger();
  commonCases.forEach(({ name, operation, expected }) => {
    it(`Common test: ${name}`, async () => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
    });
    seoulCases.forEach(({ name, operation, expected }) => {
      it(`Common test: ${name}`, async () => {
        if (
          name.includes('edsig(tz1)') ||
          name.includes('spsig(tz2)') ||
          name.includes('p2sig(tz3)')
        ) {
          expect(async () => {
            await localForger.forge(operation);
          }).rejects.toThrow(ProhibitedActionError);
        } else {
          const result = await localForger.forge(operation);
          expect(await localForger.parse(result)).toEqual(expected || operation);
        }
      });
    });
  });
  describe('Forge should validate parameters against the schema', () => {
    const hexToParse = `0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28`;

    const localForger = new LocalForger();

    it('Should throw an error when operation kind is invalid', async () => {
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
          message: expect.stringContaining(`Invalid operation kind "invalid"`),
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

    it('Should throw error when parameters are missing', async () => {
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
          name: expect.stringContaining('InvalidOperationSchemaError'),
          message: expect.stringContaining('missing properties "source, proof"'),
          operation: expect.objectContaining({ kind: 'reveal' }),
        })
      );
    });

    it('Should throw error when branch parameter has invalid block hash', async () => {
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
          message: expect.stringContaining(`Invalid block hash "Invalid_Block_Hash"`),
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

    it('Should not throw error when transaction operation does not have a "parameters" property', async () => {
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

    it('Should throw an error when parsing a forged byte with an invalid operation kind', async () => {
      const invalidForged =
        'a99b946c97ada0f42c1bdeae0383db7893351232a832d00d0cd716eb6f66e5614c0035e993d8c7aaa42b5e3ccd86a33390ececc73abd904e010a0ae807000035e993d8c7aaa42b5e3ccd86a33390ececc73abd00';
      expect(() => {
        localForger.parse(invalidForged);
      }).toThrow(UnsupportedOperationError);
      expect(() => {
        localForger.parse(invalidForged);
      }).toThrow(
        expect.objectContaining({
          name: expect.stringContaining('UnsupportedOperationError'),
          message: expect.stringContaining(`Unsupported operation "76"`),
          op: expect.stringContaining('76'),
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

    it(`Verify getCodec for CODEC.SECRET`, async () => {
      const codec = CODEC.SECRET;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const consumer = myGetCodec.decoder(hexToParse);
      expect(consumer).toBeDefined();
      expect(consumer).toEqual('0572cbea904d67468808c8eb50a9450c9721db30');
    });

    it(`Verify getCodec for CODEC.RAW`, async () => {
      const codec = CODEC.RAW;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const consumer = myGetCodec.decoder(hexToParse);
      expect(consumer).toBeDefined();
      expect(consumer).toEqual('0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62a');
    });

    it(`Verify getCodec for CODEC.OP_DELEGATION`, async () => {
      const codec = CODEC.OP_DELEGATION;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const consumer = myGetCodec.decoder(hexToParse);
      expect(consumer).toEqual({
        counter: '161756491',
        fee: '114',
        gas_limit: '103',
        storage_limit: '70',
      });
    });

    it(`Verify Arrow Function for CODEC.OP_SEED_NONCE_REVELATION`, async () => {
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
    });

    it(`Verify Arrow Functions for CODEC.SECRET is toHexString(val.consume(20))`, async () => {
      const codec = CODEC.SECRET;
      const myGetCodec = getCodec(codec, ProtocolsHash.PtKathman);
      const encodeCodec = myGetCodec.encoder(hexToParse);
      expect(encodeCodec).toEqual(
        '0572cbea904d67468808c8eb50a9450c9721db309128012543902d0ac358a62ae28f75bb8f1c7c42c39a8c5529bf0f4e166a9d8cabc673a322fda673779d8e3822ba3ecb8670e461f73bb9021d5fd76a4c56d9d4cd16bd1bba86881979749d28'
      );
      const decodeCodec = myGetCodec.decoder(hexToParse);
      expect(decodeCodec).toEqual('0572cbea904d67468808c8eb50a9450c9721db30');
    });

    it(`Verify Arrow Function for CODEC.RAW is toHexString(val.consume(32)),`, async () => {
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
    });

    it(`Verify Arrow Function for CODEC.OP_ACTIVATE_ACCOUNT`, async () => {
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
    });

    it(`Test getCodec to verify codec Manager sent to decoders is defined`, async () => {
      const myGetCodec = getCodec(CODEC.MANAGER, ProtocolsHash.PtKathman).decoder(
        '7c842c15c8b0c8fd228e6cb5302a50201f41642dd36b699003fb3c857920bc9d'
      );
      expect(myGetCodec).toEqual({
        branch: 'BLf7wKNryZRXibjzM4TjNBSMgNN4qJVhxRRuxo3uu3SegsFqkUd',
        contents: [],
      });
    });

    describe('Verify the ProtoInferiorTo function in protocols.ts', () => {
      const a = ProtocolsHash.Pt24m4xi;
      const b = ProtocolsHash.PtKathman;

      it('Verify protocol Babylon is inferior to protocol Kathmandu', () => {
        const trueProtoInferiorTo = ProtoInferiorTo(a, b);
        expect(trueProtoInferiorTo).toEqual(true);
      });

      it('Verify protocol Kathmandu is not inferior to protocol Babylon', () => {
        const falseProtoInferiorTo = ProtoInferiorTo(b, a);
        expect(falseProtoInferiorTo).toEqual(false);
      });
    });

    describe('Verify forged bytes of Smart Rollup operations', () => {
      it('forged bytes smart_rollup_originate should match', async () => {
        const forged = await localForger.forge({
          branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
          contents: [
            {
              kind: 'smart_rollup_originate',
              source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
              fee: '1496',
              counter: '3969',
              gas_limit: '2849',
              storage_limit: '6572',
              pvm_kind: 'wasm_2_0_0',
              kernel:
                '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a',
              parameters_ty: {
                prim: 'bytes',
              },
            },
          ],
        } as any);

        expect(forged).toContain(
          '0000035323212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a'
        );
        expect(forged).toContain('000000020369');
      });

      it('forged bytes smart_rollup_add_messages should match', async () => {
        const forged = await localForger.forge({
          branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
          contents: [
            {
              kind: 'smart_rollup_add_messages',
              source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
              fee: '1496',
              counter: '3969',
              gas_limit: '2849',
              storage_limit: '6572',
              message: [
                '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
              ],
            },
          ],
        } as any);

        expect(forged).toContain(
          '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
        );
        expect(forged).toContain(
          '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
        );
        expect(forged).toContain(
          'a3709dd3656c6d80bdfa9c3233d65bee9959207dae273e6fef48b7d6a2944d14c900eb1e5b162505a8b471dad53e6b95a287dc354eabd80b811fa116ac330000006b000000670000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
        );
      });

      it('forged bytes smart_rollup_execute_outbox_message should match', async () => {
        const forged = await localForger.forge({
          branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
          contents: [
            {
              kind: 'smart_rollup_execute_outbox_message',
              source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
              fee: '1496',
              counter: '3969',
              gas_limit: '2849',
              storage_limit: '6572',
              rollup: 'sr1J4MBaQqTGNwUqfcUusy3xUmH6HbMK7kYy',
              cemented_commitment: 'src13aUmJ5fEVJJM1qH1n9spuppXVAWc8wmHpTaC81pz5rrZN5e628',
              output_proof:
                '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
            },
          ],
        } as any);
        expect(forged).toBeDefined();
        expect(forged).toContain(
          '030002268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d95268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950005820764757261626c65d07eb5216be3fcfd8317136e559c80d1a5eeb8f7b684c2101e92efb2b1b9c5324603746167c00800000004536f6d650003c004a99c0224241978be1e088cf42eaca4bc53a6266842bcbf0ecad4400abeb2e5820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc0040000087a0133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f7865730028001700090006820432313337820468656164c00100066c656e677468c0010004323133380003810468656164c001008208636f6e74656e7473810130c03a000000360000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74066c656e677468c00101c0c619e3af574a846a44f61eb98ae7a0007d1e76039f6729e3e113c2f993dad600c0b7b6d5ebea80e0e4b148815c768de7570b7a5ad617a2bf3a3f989df81be9a224c055b19953c4aa26132da57ef8205c8ab61b518fb6e4c87c5853298042d17c98bbc08bac9f033f9d823c04b4de152892edc0767d0634c51c5d311f46a127f730f6950134810d6d6573736167655f6c696d6974c002a401047761736dd04822a3ddd2900dcb30a958d10818ea3d90407a79f88eab967063bac2452e99c7268259c7843df9a14e2cd5b4d187d3d603a535c64f0cc3ce3c9a3bdd5ecb3d950000085a000000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
        );
      });
    });
  });
});
