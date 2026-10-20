import { Context } from '../../src/context';
import { ContractAbstraction } from '../../src/contract/contract';
import { MichelCodecPacker } from '../../src/packer/michel-codec-packer';
import { optionLambdaCompatibilityCases } from '../data/option-lambda-compatibility';

describe('Option lambda compatibility through methodsObject (#3444)', () => {
  const address = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton';
  // Building transfer parameters and packing locally require no RPC calls.
  const context = new Context('http://127.0.0.1:1');
  const packer = new MichelCodecPacker();

  describe.each(optionLambdaCompatibilityCases)('$name', ({ type, input, expected, packed }) => {
    const contract = new ContractAbstraction(
      address,
      {
        code: [
          { prim: 'parameter', args: [type] },
          { prim: 'storage', args: [{ prim: 'int' }] },
          {
            prim: 'code',
            args: [
              [{ prim: 'CDR' }, { prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }],
            ],
          },
        ],
        storage: { int: '0' },
      },
      context.contract,
      context.contract,
      { entrypoints: { default: type } },
      context.rpc,
      context.readProvider
    );

    it('preserves the baseline transfer destination, entrypoint and Micheline', () => {
      const params = contract.methodsObject.default(structuredClone(input)).toTransferParams();

      expect(params).toMatchObject({
        to: address,
        amount: 0,
        mutez: false,
      });
      expect(params.parameter).toEqual({ entrypoint: 'default', value: expected });
    });

    it('preserves the Octez-verified packed bytes of the baseline parameter', async () => {
      const { parameter } = contract.methodsObject
        .default(structuredClone(input))
        .toTransferParams();
      if (!parameter) {
        throw new Error('Contract method did not produce a parameter');
      }

      // Pack the actual transfer parameter, not the expected fixture.
      await expect(packer.packData({ data: parameter.value, type })).resolves.toEqual({ packed });
    });
  });
});
