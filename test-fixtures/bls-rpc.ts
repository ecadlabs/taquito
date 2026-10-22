// Fixed public vectors verified independently with Octez 25.3. See bls-rpc.md.
export const blsFixture = {
  public_key: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
  public_key_hash: 'tz4AQcKaQU1sUzsmPTX43qnK4ddkCeeknJnf',
  proof:
    'BLsig9cW2ffM82s8cZWNDQTmecxHPHmJcTUh5DF2dVP7GV7oUmmptd4JpxBvSyE1VDeLtGyV68KaTuaEM1qiSUELMqkdwCLJFDQYGL6ZZLZDEUAfyu3Vu3ivs66jhV8ANwt3tKg6qABoqx',
  signature:
    'BLsigAJSVCVVYnQ9NEPoiwdcNhoGY9ZkWkWaZBVEoou9HRKyMTHKA4JsuXVciHatFMoYztVha6s9mNX9RwBk7mdtLjLWe9s4bTcTadNeUTaNraJwkTGwDdhS6BV6EHzrJTzsB4Jvbc9dhr',
  aggregate: {
    public_key: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
    message: '00010203',
    signature_shares: [
      'BLsigAJSVCVVYnQ9NEPoiwdcNhoGY9ZkWkWaZBVEoou9HRKyMTHKA4JsuXVciHatFMoYztVha6s9mNX9RwBk7mdtLjLWe9s4bTcTadNeUTaNraJwkTGwDdhS6BV6EHzrJTzsB4Jvbc9dhr',
    ],
  },
  threshold: {
    public_key: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
    message: '00010203',
    signature_shares: [
      {
        id: 1,
        signature:
          'BLsigBCwM5QYAmCXCBcox8yVW5Uz51p7aXBkdBoKfLFJ1T4ixQCNwrWLz3eGn3Ssjpc2GncGAwLV7ELTpfrs5v2k1WviG7EXs6jQ2kSyxtCna33vDkxhbYZNT56peFLRXztxEjhgMKgAjy',
      },
      {
        id: 2,
        signature:
          'BLsigACmRyJpSqbxTDCyXpQpoW2DSiE44eu6UAn4Cwsa7nB9FhGR1GpAWooSXBzkKY6uGQcxMybwQAjZsYoHNmLfDDC6nqL3d7YQvvaQMkbfZBT5ySkEt8aXwbuNeLVUxzr2986eU4UkiQ',
      },
    ],
  },
};
