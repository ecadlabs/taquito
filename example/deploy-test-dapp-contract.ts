import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer'
import { code, storage } from './data/test-dapp-contract';

const ghostnet = 'https://ghostnet.ecadinfra.com'
const nairobinet = 'https://nairobinet.ecadinfra.com/'

originate(nairobinet)

async function originate(url: string) {
  const Tezos = new TezosToolkit(url)
  // alice address tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
  Tezos.setSignerProvider(new InMemorySigner('edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq'))


  let contract = await Tezos.contract.originate({
    code: code,
    init: storage
  })
  await contract.confirmation()
  console.log(`rpc ${url}`)
  console.log('contract address: ', contract.contractAddress)
  console.log('operation results: ', contract.operationResults)
}