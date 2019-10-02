import { Schema } from '../src/schema/storage';
import { storage, parameter } from '../data/sample12_vote_delegation';
import { ParameterSchema } from '../src/schema/parameter';

const testStorage = {
  prim: 'Pair',
  args: [
    {
      prim: 'Pair',
      args: [
        {
          string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        },
        { prim: 'None' },
      ],
    },
    {
      prim: 'Pair',
      args: [
        {
          string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        },
        { prim: 'None' },
      ],
    },
  ],
};

describe('Exchange contract test', () => {
  it('Test storage schema', () => {
    const schema = new Schema(storage!.args[0] as any);
    expect(schema.Execute(testStorage)).toEqual({
      mgr1: {
        addr: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        key: null,
      },
      mgr2: {
        addr: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        key: null,
      },
    });
  });

  it('Test storage schema', () => {
    const schema = new Schema(storage!.args[0] as any);
    expect(
      schema.Encode({
        mgr1: {
          addr: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          key: null,
        },
        mgr2: {
          addr: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          key: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        },
      })
    ).toEqual({
      args: [
        {
          args: [
            {
              string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            },
            {
              prim: 'None',
            },
          ],
          prim: 'Pair',
        },
        {
          args: [
            {
              string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            },
            {
              args: [
                {
                  string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
                },
              ],
              prim: 'Some',
            },
          ],
          prim: 'Pair',
        },
      ],
      prim: 'Pair',
    });
  });

  it('Test execute parameter', () => {
    const schema = new ParameterSchema(parameter!.args[0]);
    expect(schema.Execute({ prim: 'None' })).toEqual(null);
  });

  it('Test execute parameter', () => {
    const schema = new ParameterSchema(parameter!.args[0]);
    expect(schema.Encode(null)).toEqual({ prim: 'None' });
  });

  it('Test execute parameter', () => {
    const schema = new ParameterSchema(parameter!.args[0]);
    expect(schema.Encode('test')).toEqual({ prim: 'Some', args: [{ string: 'test' }] });
  });
});
