import { createToken } from '../../src/tokens/createToken';
import { OrToken } from '../../src/tokens/or';

export const token = createToken(
  {
    prim: 'or',
    args: [
      { prim: 'int', annots: ['intTest'] },
      { prim: 'string', annots: ['stringTest'] },
    ],
    annots: [],
  },
  0
) as OrToken;
export const tokenNoAnnots = createToken(
  { prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }], annots: [] },
  0
) as OrToken;
export const tokenComplex = createToken(
  {
    prim: 'or',
    args: [
      {
        prim: 'or',
        args: [
          {
            prim: 'pair',
            args: [
              { prim: 'nat' },
              {
                prim: 'pair',
                args: [{ prim: 'nat' }, { prim: 'timestamp' }],
              },
            ],
            annots: ['%option0'],
          },
          {
            prim: 'pair',
            args: [
              { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'mutez' }] },
              {
                prim: 'pair',
                args: [{ prim: 'nat' }, { prim: 'timestamp' }],
              },
            ],
            annots: ['%option1'],
          },
        ],
      },
      {
        prim: 'or',
        args: [
          {
            prim: 'pair',
            args: [{ prim: 'nat' }, { prim: 'timestamp' }],
            annots: ['%option2'],
          },
          {
            prim: 'or',
            args: [
              {
                prim: 'pair',
                args: [
                  { prim: 'nat' },
                  {
                    prim: 'pair',
                    args: [{ prim: 'mutez' }, { prim: 'timestamp' }],
                  },
                ],
                annots: ['%option3'],
              },
              { prim: 'nat', annots: ['%option4'] },
            ],
          },
        ],
      },
    ],
  },
  0
) as OrToken;
export const tokenComplexNoAnnots = createToken(
  {
    prim: 'or',
    args: [
      {
        prim: 'or',
        args: [
          {
            prim: 'pair',
            args: [
              { prim: 'nat' },
              {
                prim: 'pair',
                args: [{ prim: 'nat' }, { prim: 'timestamp' }],
              },
            ],
          },
          {
            prim: 'pair',
            args: [
              { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'mutez' }] },
              {
                prim: 'pair',
                args: [{ prim: 'nat' }, { prim: 'timestamp' }],
              },
            ],
          },
        ],
      },
      {
        prim: 'or',
        args: [
          { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'timestamp' }] },
          {
            prim: 'or',
            args: [
              {
                prim: 'pair',
                args: [
                  { prim: 'nat' },
                  {
                    prim: 'pair',
                    args: [{ prim: 'mutez' }, { prim: 'timestamp' }],
                  },
                ],
              },
              { prim: 'nat' },
            ],
          },
        ],
      },
    ],
  },
  0
) as OrToken;
export const tokenNestedOr = createToken(
  {
    prim: 'or',
    args: [
      {
        prim: 'or',
        args: [
          {
            prim: 'or',
            args: [
              { prim: 'address', annots: ['%myAddress'] },
              { prim: 'bytes', annots: ['%myBytes'] },
            ],
          },
          {
            prim: 'or',
            args: [
              { prim: 'int', annots: ['%myInt'] },
              { prim: 'nat', annots: ['%myNat'] },
            ],
          },
        ],
      },
      {
        prim: 'or',
        args: [
          {
            prim: 'or',
            args: [
              {
                prim: 'pair',
                args: [{ prim: 'nat' }, { prim: 'int' }],
                annots: ['%myPair'],
              },
              { prim: 'string', annots: ['%myString'] },
            ],
          },
          { prim: 'mutez', annots: ['%myTez'] },
        ],
      },
    ],
  },
  0
) as OrToken;
export const token2LevelOrMixedAnnots = createToken(
  {
    prim: 'or',
    args: [
      {
        prim: 'or',
        args: [{ prim: 'int' }, { prim: 'nat', annots: ['%A'] }],
      },
      {
        prim: 'bool',
      },
    ],
  },
  0
) as OrToken;
export const token3LevelOrMixedAnnots = createToken(
  {
    prim: 'or',
    args: [
      {
        prim: 'bytes',
      },
      {
        prim: 'or',
        annots: ['A'],
        args: [
          {
            prim: 'or',
            args: [{ prim: 'int' }, { prim: 'nat' }],
          },
          { prim: 'bool' },
        ],
      },
    ],
  },
  0
) as OrToken;
export const tokenNestedOrWithoutAnnot = createToken(
  {
    prim: 'or',
    args: [
      {
        prim: 'or',
        args: [
          { prim: 'or', args: [{ prim: 'address' }, { prim: 'bytes' }] },
          { prim: 'or', args: [{ prim: 'int' }, { prim: 'nat' }] },
        ],
      },
      {
        prim: 'or',
        args: [
          {
            prim: 'or',
            args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'int' }] }, { prim: 'string' }],
          },
          { prim: 'mutez' },
        ],
      },
    ],
  },
  0
) as OrToken;
export const tokenOrWithOption = createToken(
  {
    prim: 'or',
    args: [
      { prim: 'int' },
      {
        prim: 'or',
        args: [
          { prim: 'nat' },
          {
            prim: 'or',
            args: [
              { prim: 'mutez' },
              {
                prim: 'option',
                args: [
                  {
                    prim: 'or',
                    args: [{ prim: 'int' }, { prim: 'string' }],
                    annots: [],
                  },
                ],
                annots: [],
              },
            ],
            annots: [],
          },
        ],
        annots: [],
      },
    ],
    annots: [],
  },
  0
) as OrToken;
