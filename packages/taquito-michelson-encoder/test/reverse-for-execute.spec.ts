import { Schema } from '@taquito/michelson-encoder';

describe('Exact reverse for Schema.Execute', () => {
  describe('Schema.Encode should have a flag to convert strings to binary', () => {
    const samples: { name: string; data_type: any; data: any }[] = [
      {
        name: 'Simple Address',
        data_type: { prim: 'address' },
        data: { bytes: '000072b91ef330c52e0862b890bc31feea232bcca757' },
      },
    ];

    samples.forEach((sample) =>
      it(`Should properly work for ${sample.name}`, () => {
        const schema = new Schema(sample.data_type);
        const decoded = schema.Execute(sample.data);
        const recoded = schema.Encode(decoded);
        expect(JSON.stringify(recoded)).toEqual(JSON.stringify(sample.data));
      })
    );
  });
});
