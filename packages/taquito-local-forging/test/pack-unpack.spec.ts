import { TezosToolkit } from '@taquito/taquito';
import { localForger } from '../src/taquito-local-forging';

const integrationTest = process.env.RUN_INTEGRATION || true ? test : test.skip;

interface TestCase {
  name: string;
  michelsonValue: any;
  michelsonType: any;
  expectedValue?: {};
}

const cases: TestCase[] = [
  // {
  //   name: 'Simple string',
  //   michelsonType: { prim: "string" },
  //   michelsonValue: { string: "test" }
  // },
  // {
  //   name: 'Simple int',
  //   michelsonType: { prim: "int" },
  //   michelsonValue: { int: "3" }
  // },
  // {
  //   name: "Simple bytes",
  //   michelsonType: { prim: "bytes" },
  //   michelsonValue: { "bytes": "10" }
  // },
  // // Address must be packed as bytes
  // {
  //   name: "Simple address (bytes)",
  //   michelsonType: { prim: "address" },
  //   michelsonValue: { "bytes": "00001e879a105f4e493c84322bb80051aa0585811e83" },
  //   expectedValue: { "string": "tz1NRTQeqcuwybgrZfJavBY3of83u8uLpFBj" }
  // },
  // {
  //   name: "Simple address (string)",
  //   michelsonType: { prim: "address" },
  //   michelsonValue: { "string": "tz1NRTQeqcuwybgrZfJavBY3of83u8uLpFBj" }
  // },
  // Key hash must be packed as bytes
  // {
  //   name: "Simple key hash (bytes)",
  //   michelsonType: { prim: "key_hash" },
  //   michelsonValue: { "bytes": "001e879a105f4e493c84322bb80051aa0585811e83" },
  //   expectedValue: { "string": "tz1NRTQeqcuwybgrZfJavBY3of83u8uLpFBj" }
  // },
  // {
  //   name: "Simple key hash (string)",
  //   michelsonType: { prim: "key_hash" },
  //   michelsonValue: { "string": "tz1NRTQeqcuwybgrZfJavBY3of83u8uLpFBj" },
  // },
  // Signature must be packed as string
  // {
  //   name: "Simple signature",
  //   michelsonType: { prim: "signature" },
  //   michelsonValue: { "string": "sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd" }
  // },
  // {
  //   name: "Simple nat",
  //   michelsonType: { prim: "nat" },
  //   michelsonValue: { "int": "1" }
  // },
  // {
  //   name: "Simple mutez",
  //   michelsonType: { prim: "mutez" },
  //   michelsonValue: { "int": "1" }
  // },

  // {
  //   name: "Simple lambda",
  //   michelsonType: { "prim": "lambda", "args": [{ "prim": "unit" }, { "prim": "list", "args": [{ "prim": "operation" }] }] },
  //   michelsonValue: [
  //     { prim: 'DROP' },
  //     { prim: 'NIL', args: [{ prim: 'operation' }] },
  //     {
  //       prim: 'PUSH',
  //       args: [{ prim: 'key_hash' }, { string: 'tz1UbbpwwefHU7N7EiHr6hiyFA2sDJi5vXkq' }],
  //     },
  //     { prim: 'SOME' },
  //     { prim: 'SET_DELEGATE' },
  //     { prim: 'CONS' },
  //   ]
  // },
  {
    name: "Pair of string",
    michelsonType: {
      prim: "pair", args: [{ prim: "string" }, { prim: "string" }],
    },
    michelsonValue: {
      prim: "Pair", args: [{ string: "test" }, { string: "test" }],
    }
  },
  {
    name: "Pair of string and int",
    michelsonType: {
      prim: "pair", args: [{ prim: "string" }, { prim: "int" }],
    },
    michelsonValue: {
      prim: "Pair", args: [{ string: "test" }, { int: "10" }],
    }
  },
  {
    name: "Simple nested Pair",
    michelsonType: {
      prim: "pair", args: [{ prim: "string" }, {
        prim: "pair", args: [{ prim: "string" }, { prim: "int" }],
      }],
    },
    michelsonValue: {
      prim: "Pair", args: [{ string: "test" }, {
        prim: "Pair", args: [{ string: "test" }, { int: "10" }],
      }],
    }
  }
];

cases.forEach(({ name, michelsonType, michelsonValue, expectedValue }) => {
  // test(`Test: ${name}`, async done => {
  //   const result = await localForger.forge(operation);
  //   expect(await localForger.parse(result)).toEqual(expected || operation);
  //   done();
  // });

  // 'https://api.tez.ie/rpc/babylonnet',
  ['https://api.tez.ie/rpc/carthagenet'].forEach(rpc => {

    integrationTest(`Integration test: ${name} (${rpc})`, async done => {
      const Tezos = new TezosToolkit();
      Tezos.setProvider({ rpc });
      const result = await localForger.pack({ data: michelsonValue, type: michelsonType })

      const { packed } = await Tezos.rpc.packData({ data: michelsonValue, type: michelsonType });
      console.log(packed)
      const unpack = await localForger.unpack({ packed, type: michelsonType })
      console.log(unpack)
      expect(`${result.packed}`).toEqual(`${packed}`);
      expect(unpack).toEqual(expectedValue || michelsonValue)
      done();
    });
  });
});
