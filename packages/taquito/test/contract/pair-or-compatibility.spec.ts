import { Context, FieldNumberingStrategy, Token } from '../../src/taquito';
import { ContractAbstraction } from '../../src/contract/contract';
import { MichelCodecPacker } from '../../src/packer/michel-codec-packer';
import { pairOrCompatibilityCases } from '../../../../test-fixtures/pair-or-compatibility';

describe('Pair/or compatibility through methodsObject (#2931)', () => {
  const address = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';
  const context = new Context('http://127.0.0.1:1');
  const packer = new MichelCodecPacker();
  let previousStrategy: FieldNumberingStrategy;
  beforeEach(() => {
    previousStrategy = Token.fieldNumberingStrategy;
  });
  afterEach(() => {
    Token.fieldNumberingStrategy = previousStrategy;
  });

  // Constructing transfer parameters and packing them does not call an RPC.
  describe.each<FieldNumberingStrategy>(['Legacy', 'ResetFieldNumbersInNestedObjects', 'Latest'])(
    '%s',
    (strategy) => {
      it.each(pairOrCompatibilityCases)(
        'preserves parameters and Octez PACK bytes: $name',
        async (fixture) => {
          Token.fieldNumberingStrategy = strategy;
          const type = structuredClone(fixture.type);
          const contract = new ContractAbstraction(
            address,
            {
              code: [
                { prim: 'parameter', args: [type] },
                { prim: 'storage', args: [{ prim: 'unit' }] },
                {
                  prim: 'code',
                  args: [
                    [
                      { prim: 'CDR' },
                      { prim: 'NIL', args: [{ prim: 'operation' }] },
                      { prim: 'PAIR' },
                    ],
                  ],
                },
              ],
              storage: { prim: 'Unit' },
            },
            context.contract,
            context.contract,
            { entrypoints: { default: type } },
            context.rpc,
            context.readProvider
          );
          const params = contract.methodsObject
            .default(structuredClone(fixture.expected[strategy].value))
            .toTransferParams();
          expect(params).toMatchObject({ to: address, amount: 0, mutez: false });
          expect(params.parameter).toEqual({ entrypoint: 'default', value: fixture.encoded });
          if (!params.parameter) {
            throw new Error('Contract method did not produce a parameter');
          }
          await expect(packer.packData({ data: params.parameter.value, type })).resolves.toEqual({
            packed: fixture.packed,
          });
        }
      );
    }
  );
});
