// Constructor and error checks only. No proof generation or network request.
export default async function ({ assert, load }) {
  const [sapling, core] = await Promise.all(['@taquito/sapling', '@taquito/core'].map(load));
  const keys = {
    saplingSigner: {
      getSaplingViewingKeyProvider: async () => {
        throw new Error('This fixture must not request a viewing key');
      },
    },
  };
  const contract = { contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC', memoSize: 8 };
  for (const outputOrder of [undefined, 'preserve', 'randomized']) {
    assert.doesNotThrow(() => new sapling.SaplingToolkit(keys, { ...contract, outputOrder }, {}));
  }
  for (const outputOrder of ['shuffle', '', null, false, 0]) {
    assert.throws(
      () => new sapling.SaplingToolkit(keys, { ...contract, outputOrder }, {}),
      (error) => {
        assert.ok(error instanceof sapling.InvalidSaplingOutputOrderError);
        assert.ok(error instanceof core.ParameterValidationError);
        assert.equal(error.name, 'InvalidSaplingOutputOrderError');
        assert.equal(error.message, 'Unknown Sapling output order');
        return true;
      }
    );
  }
}
