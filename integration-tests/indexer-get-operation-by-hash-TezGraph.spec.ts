import { TezGraphIndexer } from '../packages/taquito-indexer/src/tezGraph/tezgraph-indexer';
import BigNumber from 'bignumber.js';

describe(`Fetch operation by hash`, () => {
  beforeEach(async (done) => {
    done();
  });
  it('Should retrieve and properly format a batch operation on mainnet using TezGraph indexer', async (done) => {
    const hash = 'opEa6VG7KsXJKAHC4NYYvSUTugJgHRmbrg61PfGDrvmaXAe4coA';
    // Temporarily use staging url to retrieve the new status property
    const idx = new TezGraphIndexer('https://mainnet.staging.tezgraph.tez.ie/graphql');
    const op = await idx.getOperation(hash);

    expect(op.length).toEqual(11);
    expect(op[0]).toEqual({
      kind: 'transaction',
      hash: 'opEa6VG7KsXJKAHC4NYYvSUTugJgHRmbrg61PfGDrvmaXAe4coA',
      sender: 'tz1gTm7dAYGBNu8QUNYa34UUpiY7NBA7vUSL',
      timestamp: '2021-08-30T20:17:58.000Z',
      level: 1652096,
      status: "applied",
      block: 'BL5NvSneH9dhQ4DtxRh121FStFMFTwnfL4Po6wzJnQ42ncCXRiz',
      fee: new BigNumber(418876),
      counter: new BigNumber(18636849),
      gas_limit: new BigNumber(11620),
      storage_limit: new BigNumber(0),
      amount: new BigNumber(300000000),
      parameters: {
        entrypoint: 'tezToTokenPayment',
        value: {
          prim: 'Pair',
          args: [{ int: '3451942' }, { string: 'tz1gTm7dAYGBNu8QUNYa34UUpiY7NBA7vUSL' }]
        }
      },
      destination: 'KT1DksKXvCBJN7Mw6frGj6y6F3CbABWZVpj1',
      consumed_gas: new BigNumber(5716.866)
    });

    expect(op[1]).toEqual({
      kind: 'transaction',
      hash: 'opEa6VG7KsXJKAHC4NYYvSUTugJgHRmbrg61PfGDrvmaXAe4coA',
      sender: 'KT1DksKXvCBJN7Mw6frGj6y6F3CbABWZVpj1',
      timestamp: '2021-08-30T20:17:58.000Z',
      level: 1652096,
      status: "applied",
      block: 'BL5NvSneH9dhQ4DtxRh121FStFMFTwnfL4Po6wzJnQ42ncCXRiz',
      fee: new BigNumber(418876),
      amount: new BigNumber(0),
      parameters: {
        entrypoint: 'transfer',
        value: [
          {
            prim: 'Pair',
            args: [
              { bytes: '0138c1979e479a7fbd48dcda158d016bad9b6fe66100' },
              [
                {
                  prim: 'Pair',
                  args: [
                    { bytes: '0000e4697a7884223a7383150ffc83386280b07b7c50' },
                    { prim: 'Pair', args: [{ int: '19' }, { int: '3452288' }] }
                  ]
                }
              ]
            ]
          }
        ],
      },
      destination: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      consumed_gas: new BigNumber(5802.983)
    });

    expect(op[2]).toEqual({
      kind: 'transaction',
      hash: 'opEa6VG7KsXJKAHC4NYYvSUTugJgHRmbrg61PfGDrvmaXAe4coA',
      sender: 'tz1gTm7dAYGBNu8QUNYa34UUpiY7NBA7vUSL',
      timestamp: '2021-08-30T20:17:58.000Z',
      level: 1652096,
      status: "applied",
      block: 'BL5NvSneH9dhQ4DtxRh121FStFMFTwnfL4Po6wzJnQ42ncCXRiz',
      fee: new BigNumber(0),
      counter: new BigNumber(18636850),
      gas_limit: new BigNumber(4231),
      storage_limit: new BigNumber(0),
      amount: new BigNumber(0),
      parameters: {
        entrypoint: 'update_operators',
        value: [{ "prim": "Left", "args": [{ "prim": "Pair", "args": [{ "string": "tz1gTm7dAYGBNu8QUNYa34UUpiY7NBA7vUSL" }, { "prim": "Pair", "args": [{ "string": "KT19Dskaofi6ZTkrw3Tq4pK7fUqHqCz4pTZ3" }, { "int": "19" }] }] }] }],
      },
      destination: 'KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ',
      consumed_gas: new BigNumber(4130.857)
    });

    done();
  });
});
