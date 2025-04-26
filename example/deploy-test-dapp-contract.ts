import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer'
import { code, storage } from './data/test-dapp-contract';

// update the targeted rpc url before running
const rpcUrl = 'https://rpc.rionet.teztnets.com'
originate(rpcUrl)

async function originate(url: string) {
  const Tezos = new TezosToolkit(url)
  // if it's a new protocol might need to fund address tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD
  Tezos.setSignerProvider(new InMemorySigner('spsk21y52Cp943kGnqPBSjXMC2xf1hz8QDGGih7AJdFqhxPcm1ihRN'))


  let contract = await Tezos.contract.originate({
    code: code,
    init: storage
  })
  await contract.confirmation()
  console.log(`rpc ${url}`)
  console.log('contract address: ', contract.contractAddress)
  console.log('operation results: ', contract.operationResults)
}