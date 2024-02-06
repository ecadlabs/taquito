// https://gitlab.com/tezos/tezos/-/blob/master/src/proto_018_Proxford/lib_protocol/test/regression/contracts/rec_id_unit.tz
export const lambdaRecCode = [
  { prim: 'parameter', args: [ { prim: 'unit' } ] },
  { prim: 'storage', args: [ { prim: 'unit' } ] },
  {
    prim: 'code',
    args: [
      [
        { prim: 'CAR' },
        { prim: 'LAMBDA_REC', args: [
          { prim: 'unit' },
          { prim: 'unit' },
          [ { prim: 'DIP', args: [ [ { prim: 'DROP' } ] ] } ],
        ] },
        { prim: 'SWAP' },
        { prim: 'EXEC' },
        { prim: 'NIL', args: [ { prim: 'operation' } ] },
        { prim: 'PAIR' },
      ],
    ],
  },
];
