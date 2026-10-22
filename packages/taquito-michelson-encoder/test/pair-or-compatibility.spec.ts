import {
  FieldNumberingStrategy,
  ParameterSchema,
  Schema,
  Token,
} from '../src/taquito-michelson-encoder';
import { pairOrCompatibilityCases } from '../../../test-fixtures/pair-or-compatibility';

describe('Public pair/or mappings (#2931)', () => {
  let previousStrategy: FieldNumberingStrategy;
  beforeEach(() => {
    previousStrategy = Token.fieldNumberingStrategy;
  });
  afterEach(() => {
    Token.fieldNumberingStrategy = previousStrategy;
  });

  // The strategy is process-wide, so these cases must not run concurrently.
  describe.each<FieldNumberingStrategy>(['Legacy', 'ResetFieldNumbersInNestedObjects', 'Latest'])(
    '%s',
    (strategy) => {
      describe.each(pairOrCompatibilityCases)('$name', (fixture) => {
        it('preserves public storage decoding, schema and encoding', () => {
          Token.fieldNumberingStrategy = strategy;
          const schema = new Schema(structuredClone(fixture.type));
          const expected = fixture.expected[strategy];
          expect(schema.Execute(structuredClone(fixture.micheline))).toEqual(expected.value);
          expect(schema.generateSchema()).toEqual(expected.schema);
          expect(schema.Encode(structuredClone(expected.value))).toEqual(fixture.encoded);
        });

        it('preserves public parameter decoding, schema and encoding', () => {
          Token.fieldNumberingStrategy = strategy;
          const schema = new ParameterSchema(structuredClone(fixture.type));
          const expected = fixture.expected[strategy];
          expect(schema.Execute(structuredClone(fixture.micheline))).toEqual(expected.value);
          expect(schema.generateSchema()).toEqual(expected.schema);
          expect(schema.EncodeObject(structuredClone(expected.value))).toEqual(fixture.encoded);
        });
      });
    }
  );
});
