import { TezosToolkit, } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';

const ghostnet = 'https://rpc.ghostnet.teztnets.com';
const shadownet = 'https://rpc.shadownet.teztnets.com';
// const weeklynet = 'https://rpc.weeklynet-2025-10-01.teztnets.com'

async function main(rpc: string) {
  const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
  const tezos = new TezosToolkit(rpc);
  tezos.setSignerProvider(signer);
  const contract = await tezos.contract.at('KT1H1tWshuo5XWE5swcE7ek8hhANN7J6iY3u')
  console.log(contract.parameterSchema.ExtractSignatures())
  try {

  } catch (ex) {
    console.log(ex)
  }
}

// main(shadownet)

import { MichelsonData, MichelsonType, packData, packDataBytes, unpackDataBytes } from '@taquito/michel-codec';

const data: MichelsonData = {
  // prim: "Pair",
  // args: [
  //   {
  //     string: "tz1TjWbykgZcf6ix6PZHB1PFhNZd6gfjm88Q"
  //   },
  //   {
      bytes: "01dad80196000058ca62a4cbce8b3de3af1734274910812ace10b6c0"
  //   }
  // ]
};

  const typ: MichelsonType = {
    // prim: 'pair',
    // args: [
    //   {
    //     prim: 'address'
    //   },
      // {
        prim: 'bytes'
      // }
    // ]
  };

const packed = unpackDataBytes(data, typ);
console.log(packed)
// 050a0000001901be41ee922ddd2cf33201e49d32da0afec571dce300666f6f

// alternatively
// const packedBytes = packDataBytes(data, typ);
// { bytes: "050a0000001901be41ee922ddd2cf33201e49d32da0afec571dce300666f6f" }


// async function getDelegates(rpc: string) {
//   const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
//   const tezos = new TezosToolkit(rpc);
//   tezos.setSignerProvider(signer);

//   try {
//     return await tezos.rpc.getAllDelegates({ active: true, with_minimal_stake: true })
//   } catch (ex) {
//     console.log(ex)
//   }
// }

// let networks = [ghostnet, shadownet]
// let bakerPromises = networks.map(async (network) => {
//   return (await getDelegates(network))
// })
// Promise.all(bakerPromises).then(
//   bakersNested => {
//     console.log(bakersNested)
//     let bakers = bakersNested.flat(2) as string[]
//     let res = bakers.reduce((acc, baker) => {
//       acc[baker] = (acc[baker] ?? 0) + 1;
//       return acc;
//     }, {} as Record<string, number>);

//     console.log(res)
//   }
// )
