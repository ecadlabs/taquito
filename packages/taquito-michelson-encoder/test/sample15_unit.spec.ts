import { Schema } from '../src/schema/storage';

const code = [{ "prim": "parameter", "args": [{ "prim": "unit" }] },
{ "prim": "storage", "args": [{ "prim": "unit" }] },
{
  "prim": "code",
  "args":
    [[{ "prim": "DUP" }, { "prim": "CDR" },
    {
      "prim": "NIL",
      "args": [{ "prim": "operation" }]
    },
    { "prim": "PAIR" },
    {
      "prim": "DIP",
      "args": [[{ "prim": "DROP" }]]
    }]]
}]

export const storage = code[1].args[0];

export const params = code[0].args[0]

describe('Unit contract test', () => {
  const contract = new Schema(storage as any);

  test('Storage encoding with null', () => {
    const result = contract.Encode(null);
    expect(result).toEqual({ "prim": "Unit" })
  })

  test('Storage encoding with undefined', () => {
    const result = contract.Encode(undefined);
    expect(result).toEqual({ "prim": "Unit" })
  })

  test('Storage encoding with object', () => {
    const result = contract.Encode({});
    expect(result).toEqual({ "prim": "Unit" })
  })

  test('Storage decoding', () => {
    const storage = contract.Execute({ prim: 'Unit' })
    expect(storage).toBeNull();
  })
});
