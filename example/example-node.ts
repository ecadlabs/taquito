import { Tezos } from '../src/tezos-dapp-toolkit'

async function example() {
  try {
    Tezos.setProvider('https://alphanet-node.tzscan.io')
    console.log('Getting storage...')
    await Tezos.contract.getStorage('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN').then(console.log)
    console.log('Getting balance...')
    await Tezos.tz.getBalance('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN').then(console.log)

    console.log('Getting big map key...')
    await Tezos.contract
      .getBigMapKey('KT1SawqvsVdAbDzqc4KwPpaS1S1veuFgF9AN', 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn')
      .then(console.log)
  } catch (ex) {
    console.error(ex)
  }
}

// tslint:disable-next-line: no-floating-promises
example()
