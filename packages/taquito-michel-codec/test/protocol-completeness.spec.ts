import {
  assertDataValid,
  assertMichelsonType,
  assertTypesEqual,
  MichelsonType,
  MichelsonTypeSaplingTransactionDeprecated,
  MichelsonTypeTxRollupL2Address,
  packDataBytes,
  unpackDataBytes,
} from '../src/taquito-michel-codec';

describe('Michelson protocol completeness', () => {
  describe('Rollup addresses (txr1, sr1, epx1) and entrypoint validation in address', () => {
    const addressType: MichelsonType = { prim: 'address' };

    const rollupVectors = [
      {
        label: 'txr1 (TxRollup, tag 0x02)',
        readable: 'txr1YNMEtkj5Vkqsbdmt7xaxBTMRZjzS96UAi',
        invalidChecksum: 'txr1YNMEtkj5Vkqsbdmt7xaxBTMRZjzS96UAj',
        bytes: '0276a57f87ee7624b92ab1453c75ba5d29ed8fe0bf00',
        packed: '050a000000160276a57f87ee7624b92ab1453c75ba5d29ed8fe0bf00',
      },
      {
        label: 'sr1 (SmartRollup, tag 0x03)',
        readable: 'sr1BAwv191dVYeZg44ZxVy8dFwfRQKW6bSqc',
        invalidChecksum: 'sr1BAwv191dVYeZg44ZxVy8dFwfRQKW6bSqd',
        bytes: '033848c1c83367f57188313b5201a7085abc78acc400',
        packed: '050a00000016033848c1c83367f57188313b5201a7085abc78acc400',
      },
      {
        label: 'epx1 (ZkRollup, tag 0x04)',
        readable: 'epx18RJJqrYuJQqhB636BWvukU3XBNQGbtm8C',
        invalidChecksum: 'epx18RJJqrYuJQqhB636BWvukU3XBNQGbtm8D',
        bytes: '0419421380a07fc02eefdff72c985a4fc00cb07eb200',
        packed: '050a000000160419421380a07fc02eefdff72c985a4fc00cb07eb200',
      },
    ];

    it.each(rollupVectors)(
      'packs, unpacks, and validates $label',
      ({ readable, invalidChecksum, bytes, packed }) => {
        expect(packDataBytes({ string: readable }, addressType)).toEqual({ bytes: packed });
        expect(unpackDataBytes({ bytes: packed }, addressType)).toEqual({ string: readable });
        expect(() => assertDataValid({ string: readable }, addressType)).not.toThrow();
        expect(() => assertDataValid({ bytes }, addressType)).not.toThrow();

        // Invalid checksum
        expect(() => assertDataValid({ string: invalidChecksum }, addressType)).toThrow();
        expect(() => packDataBytes({ string: invalidChecksum }, addressType)).toThrow();

        // Non-zero trailing padding byte is consumed and ignored on read (matching Octez Padded reader)
        const nonZeroPaddingBytes = `${bytes.slice(0, 42)}01`;
        expect(() => assertDataValid({ bytes: nonZeroPaddingBytes }, addressType)).not.toThrow();
        expect(
          unpackDataBytes({ bytes: `050a00000016${nonZeroPaddingBytes}` }, addressType)
        ).toEqual({ string: readable });

        // Truncated optimized bytes (< 22 bytes)
        const truncated = bytes.slice(0, -2);
        expect(() => assertDataValid({ bytes: truncated }, addressType)).toThrow();
        expect(() =>
          unpackDataBytes({ bytes: `050a00000015${truncated}` }, addressType)
        ).toThrow();
      }
    );

    it('packs, unpacks, and validates rollup addresses with entrypoints and empty % suffix', () => {
      const srWithEp = 'sr1BAwv191dVYeZg44ZxVy8dFwfRQKW6bSqc%foo';
      const srPackedWithEp = '050a00000019033848c1c83367f57188313b5201a7085abc78acc400666f6f';
      expect(packDataBytes({ string: srWithEp }, addressType)).toEqual({ bytes: srPackedWithEp });
      expect(unpackDataBytes({ bytes: srPackedWithEp }, addressType)).toEqual({ string: srWithEp });
      expect(() => assertDataValid({ string: srWithEp }, addressType)).not.toThrow();

      const srEmptyEp = 'sr1BAwv191dVYeZg44ZxVy8dFwfRQKW6bSqc%';
      const srPackedNoEp = '050a00000016033848c1c83367f57188313b5201a7085abc78acc400';
      expect(packDataBytes({ string: srEmptyEp }, addressType)).toEqual({ bytes: srPackedNoEp });
      expect(unpackDataBytes({ bytes: srPackedNoEp }, addressType)).toEqual({
        string: 'sr1BAwv191dVYeZg44ZxVy8dFwfRQKW6bSqc',
      });

      const epxWithEp = 'epx18RJJqrYuJQqhB636BWvukU3XBNQGbtm8C%deposit';
      const epxPackedWithEp =
        '050a0000001d0419421380a07fc02eefdff72c985a4fc00cb07eb2006465706f736974';
      expect(packDataBytes({ string: epxWithEp }, addressType)).toEqual({
        bytes: epxPackedWithEp,
      });
      expect(unpackDataBytes({ bytes: epxPackedWithEp }, addressType)).toEqual({
        string: epxWithEp,
      });
      expect(() => assertDataValid({ string: epxWithEp }, addressType)).not.toThrow();
    });

    it('enforces the Octez 31-byte maximum entrypoint length in address validation and packing', () => {
      const base = 'KT1J4E79F1qL6kGBSQ3yXBdXmuq5j4FNThK2';
      const baseBytes = '0167ea84b1082efb9619d6ce04e033633906636e1d00';
      const ep31 = 'a'.repeat(31);
      const ep32 = 'a'.repeat(32);
      const ep31Hex = '61'.repeat(31);
      const ep32Hex = '61'.repeat(32);

      expect(() => assertDataValid({ string: `${base}%${ep31}` }, addressType)).not.toThrow();
      expect(() => assertDataValid({ bytes: `${baseBytes}${ep31Hex}` }, addressType)).not.toThrow();
      const packed31 = packDataBytes({ string: `${base}%${ep31}` }, addressType);
      expect(unpackDataBytes(packed31, addressType)).toEqual({ string: `${base}%${ep31}` });

      expect(() => assertDataValid({ string: `${base}%${ep32}` }, addressType)).toThrow();
      expect(() => assertDataValid({ bytes: `${baseBytes}${ep32Hex}` }, addressType)).toThrow();
      expect(() => packDataBytes({ string: `${base}%${ep32}` }, addressType)).toThrow();
      expect(() =>
        unpackDataBytes({ bytes: `050a00000036${baseBytes}${ep32Hex}` }, addressType)
      ).toThrow();
    });

    it('rejects explicit default entrypoint in binary address and unknown destination tag (0x05)', () => {
      const explicitDefaultBytes =
        '0167ea84b1082efb9619d6ce04e033633906636e1d0064656661756c74';
      expect(() => assertDataValid({ bytes: explicitDefaultBytes }, addressType)).toThrow();
      expect(() =>
        unpackDataBytes({ bytes: `050a0000001d${explicitDefaultBytes}` }, addressType)
      ).toThrow();

      const unknownTagBytes = '0567ea84b1082efb9619d6ce04e033633906636e1d00';
      expect(() => assertDataValid({ bytes: unknownTagBytes }, addressType)).toThrow();
      expect(() =>
        unpackDataBytes({ bytes: `050a00000016${unknownTagBytes}` }, addressType)
      ).toThrow();
    });
  });

  describe('contract<T> packing, unpacking, and data validation', () => {
    const contractUnitType: MichelsonType = {
      prim: 'contract',
      args: [{ prim: 'unit' }],
    };

    const contractVectors = [
      {
        readable: 'KT1J4E79F1qL6kGBSQ3yXBdXmuq5j4FNThK2%main',
        bytes: '0167ea84b1082efb9619d6ce04e033633906636e1d006d61696e',
        packed: '050a0000001a0167ea84b1082efb9619d6ce04e033633906636e1d006d61696e',
      },
      {
        readable: 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8',
        bytes: '0003af2dc3c40667abc0e89c0ef40171d22aed08d5eb',
        packed: '050a000000160003af2dc3c40667abc0e89c0ef40171d22aed08d5eb',
      },
      {
        readable: 'sr1BAwv191dVYeZg44ZxVy8dFwfRQKW6bSqc%foo',
        bytes: '033848c1c83367f57188313b5201a7085abc78acc400666f6f',
        packed: '050a00000019033848c1c83367f57188313b5201a7085abc78acc400666f6f',
      },
      {
        readable: 'epx18RJJqrYuJQqhB636BWvukU3XBNQGbtm8C%deposit',
        bytes: '0419421380a07fc02eefdff72c985a4fc00cb07eb2006465706f736974',
        packed: '050a0000001d0419421380a07fc02eefdff72c985a4fc00cb07eb2006465706f736974',
      },
    ];

    it.each(contractVectors)(
      'packs, unpacks, and validates contract data for $readable',
      ({ readable, bytes, packed }) => {
        expect(packDataBytes({ string: readable }, contractUnitType)).toEqual({ bytes: packed });
        expect(packDataBytes({ bytes }, contractUnitType)).toEqual({ bytes: packed });
        expect(unpackDataBytes({ bytes: packed }, contractUnitType)).toEqual({ string: readable });
        expect(() => assertDataValid({ string: readable }, contractUnitType)).not.toThrow();
        expect(() => assertDataValid({ bytes }, contractUnitType)).not.toThrow();
      }
    );

    it('rejects invalid contract data including implicit accounts with non-default entrypoint or non-unit/ticket parameter type', () => {
      const contractIntType: MichelsonType = {
        prim: 'contract',
        args: [{ prim: 'int' }],
      };
      const contractTicketType: MichelsonType = {
        prim: 'contract',
        args: [{ prim: 'ticket', args: [{ prim: 'string' }] }],
      };
      const tz1 = 'tz1VmUWL8DxseZnPTdhHQkkuk6nK55NVdKCG';

      expect(() => assertDataValid({ string: tz1 }, contractUnitType)).not.toThrow();
      expect(() => assertDataValid({ string: `${tz1}%default` }, contractUnitType)).not.toThrow();
      expect(() => assertDataValid({ string: `${tz1}%` }, contractUnitType)).not.toThrow();
      expect(() => assertDataValid({ string: tz1 }, contractTicketType)).not.toThrow();
      expect(() => assertDataValid({ string: `${tz1}%foo` }, contractUnitType)).toThrow();
      expect(() => assertDataValid({ string: tz1 }, contractIntType)).toThrow();

      expect(() => assertDataValid({ string: 'not_an_address' }, contractUnitType)).toThrow();
      expect(() =>
        assertDataValid(
          { string: `KT1J4E79F1qL6kGBSQ3yXBdXmuq5j4FNThK2%${'a'.repeat(32)}` },
          contractUnitType
        )
      ).toThrow();
      expect(() => assertDataValid({ bytes: '010203' }, contractUnitType)).toThrow();
      expect(() => assertDataValid({ int: '42' }, contractUnitType)).toThrow();
    });
  });

  describe('MichelsonType<T> union and validator completeness (tx_rollup_l2_address & sapling_transaction_deprecated)', () => {
    it('includes tx_rollup_l2_address in MichelsonType<T> and validates/packs tz4 L2 addresses', () => {
      const l2Type: MichelsonType<'tx_rollup_l2_address'> = {
        prim: 'tx_rollup_l2_address',
      };
      const explicitL2Type: MichelsonTypeTxRollupL2Address = l2Type;
      expect(assertMichelsonType(explicitL2Type)).toBe(true);

      const tz4 = 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8';
      const raw20Bytes = 'af2dc3c40667abc0e89c0ef40171d22aed08d5eb';
      const packed = `050a00000014${raw20Bytes}`;

      expect(() => assertDataValid({ string: tz4 }, l2Type)).not.toThrow();
      expect(() => assertDataValid({ bytes: raw20Bytes }, l2Type)).not.toThrow();
      expect(packDataBytes({ string: tz4 }, l2Type)).toEqual({ bytes: packed });
      expect(unpackDataBytes({ bytes: packed }, l2Type)).toEqual({ string: tz4 });

      expect(() =>
        assertDataValid({ string: 'tz1VmUWL8DxseZnPTdhHQkkuk6nK55NVdKCG' }, l2Type)
      ).toThrow();
      expect(() => assertDataValid({ bytes: `03${raw20Bytes}` }, l2Type)).toThrow();
      expect(() => assertDataValid({ bytes: raw20Bytes.slice(0, -2) }, l2Type)).toThrow();
    });

    it('includes sapling_transaction_deprecated in MichelsonType<T> and validates memo size argument', () => {
      const saplingDepType: MichelsonType<'sapling_transaction_deprecated'> = {
        prim: 'sapling_transaction_deprecated',
        args: [{ int: '8' }],
      };
      const explicitType: MichelsonTypeSaplingTransactionDeprecated = saplingDepType;
      expect(assertMichelsonType(explicitType)).toBe(true);

      expect(() =>
        assertMichelsonType({ prim: 'sapling_transaction_deprecated' })
      ).toThrow();
      expect(() =>
        assertMichelsonType({
          prim: 'sapling_transaction_deprecated',
          args: [{ string: '8' }],
        })
      ).toThrow();

      expect(() =>
        assertTypesEqual(saplingDepType, {
          prim: 'sapling_transaction_deprecated',
          args: [{ int: '8' }],
        })
      ).not.toThrow();
      expect(() =>
        assertTypesEqual(saplingDepType, {
          prim: 'sapling_transaction_deprecated',
          args: [{ int: '16' }],
        })
      ).toThrow();
    });
  });

  describe('assertDataValid for sapling_transaction, sapling_transaction_deprecated, chest, chest_key, and chain_id', () => {
    const bytesOnlyTypes: MichelsonType[] = [
      { prim: 'sapling_transaction', args: [{ int: '8' }] },
      { prim: 'sapling_transaction_deprecated', args: [{ int: '8' }] },
      { prim: 'chest' },
      { prim: 'chest_key' },
    ];

    it.each(bytesOnlyTypes)('validates hex bytes literals for $prim', (type) => {
      expect(() => assertDataValid({ bytes: '' }, type)).not.toThrow();
      expect(() => assertDataValid({ bytes: '00ff1234abcd' }, type)).not.toThrow();
      expect(() => assertDataValid({ string: '00ff' }, type)).toThrow();
      expect(() => assertDataValid({ int: '0' }, type)).toThrow();
      expect(() => assertDataValid({ bytes: '00f' }, type)).toThrow();
      expect(() => assertDataValid({ bytes: 'zzzz' }, type)).toThrow();
    });

    it('validates chain_id Net... base58 and 4-byte hex literals', () => {
      const chainIdType: MichelsonType = { prim: 'chain_id' };
      expect(() => assertDataValid({ string: 'NetXdQprcVkpaWU' }, chainIdType)).not.toThrow();
      expect(() => assertDataValid({ bytes: '7a06a770' }, chainIdType)).not.toThrow();

      expect(() =>
        assertDataValid({ string: 'tz1VmUWL8DxseZnPTdhHQkkuk6nK55NVdKCG' }, chainIdType)
      ).toThrow();
      expect(() => assertDataValid({ string: 'NetXdQprcVkpaWV' }, chainIdType)).toThrow();
      expect(() => assertDataValid({ bytes: '' }, chainIdType)).toThrow();
      expect(() => assertDataValid({ bytes: '7a06a7' }, chainIdType)).toThrow();
      expect(() => assertDataValid({ bytes: '7a06a77000' }, chainIdType)).toThrow();
    });

    it('enforces the signed 64-bit upper bound (9223372036854775807) on mutez', () => {
      const mutezType: MichelsonType = { prim: 'mutez' };
      expect(() => assertDataValid({ int: '0' }, mutezType)).not.toThrow();
      expect(() => assertDataValid({ int: '9223372036854775807' }, mutezType)).not.toThrow();
      expect(() => assertDataValid({ int: '9223372036854775808' }, mutezType)).toThrow();
    });
  });
});
