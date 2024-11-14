const { TezosToolkit } = require('@taquito/taquito')
const { InMemorySigner } = require('@taquito/signer')
let ghostnet = 'https://rpc.ghostnet.teztnets.com'
let parisnet = 'https://rpc.pariscnet.teztnets.com'
let quebecnet = 'https://rpc.quebecnet.teztnets.com'
let qenanet = 'https://rpc.qenanet.teztnets.com'

run(qenanet)

async function run(url: string) {
  let Tezos = new TezosToolkit(url)
  Tezos.setSignerProvider(new InMemorySigner('spsk21y52Cp943kGnqPBSjXMC2xf1hz8QDGGih7AJdFqhxPcm1ihRN')) // tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD

  let delegates = await Tezos.rpc.getAllDelegates()
  console.log(delegates)
  for(let i = 0; i < delegates.length; i++) {
    let delegate = delegates[i]
    let res = await fetch(url + `/chains/main/blocks/head/context/delegates/${delegate}/active_staking_parameters`)
    let active_staking_parameters = await res.json()
    if (active_staking_parameters.limit_of_staking_over_baking_millionth > 0){
      console.log(delegate)
      console.log(active_staking_parameters)
    }
  }
}
