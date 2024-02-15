---
title: web3js vs Taquito
id: web3js_taquito
author: Claude Barde
---

Web3js and Taquito have a common goal: connecting dapps to the Ethereum and Tezos blockchain (respectively) and thus implement similar approaches. However, these approaches are also different due to the nature of Ethereum and the Tezos blockchains.

A comparison of the methods implemented by Web3js and Taquito can put in perspective their similarities and differences.

## Installation

**Web3js**:
`npm install web3`

**Taquito**:
`npm install @taquito/taquito`

Web3js comes as a single package containing all the necessary tools to connect to the Ethereum blockchain, while Taquito is made of various packages that you can install and import whenever you need them.

## Connection

**Web3js**:

```js
import Web3 from 'web3';

const web3 = new Web3(Web3.providers.HttpProvider('http://localhost:9545'));
```

**Taquito**:

```js
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('http://localhost:8732');
```

The Web3js package exports a class that needs to be instantiated before being used. The difference between _Web3_ and _web3_ is a common source of Ethereum development errors.
Taquito also exports a class named `TezosToolkit` that needs to be instantiated before being used, similar to the Web3js code.

## Get account balance

**Web3js**:

```js
const balance = await web3.eth.getBalance('account_address');
```

**Taquito**

```js
const balance = await Tezos.tz.getBalance('account_address');
```

Both Web3js and Taquito use the `getBalance` method with the account address to fetch its balance from the network.

## Transfer tokens

**Web3js**:

```js
const op = await web3.eth.sendTransaction({
  from: 'sender_address',
  to: 'recipient_address',
  value: 'amount_in_wei',
});
```

**Taquito**:

```js
const op = await Tezos.wallet.transfer({
  to: 'recipient_address',
  amount: 'amount_in_tez',
});
await op.confirmation();
```

Web3js and Taquito allow the transfer of tokens from one address to another in a similar fashion. The transaction on Ethereum returns a promise with receipt/event emitter and resolves when the receipt is available. The transaction on Tezos returns a WalletOperation promise with a `confirmation` method that waits for the number of confirmations specified as a parameter (default 1) before resolving.

## Create a contract instance

**Web3js**

```js
const contract = new web3.eth.Contract(JSON_ABI);
```

**Taquito**:

```js
const contract = await Tezos.wallet.at('contract_address');
```

The two approaches are radically different here: Web3js constructs the contract interface from the "ABI" that's shipped with the dapp while Taquito fetches the contract structure directly from the blockchain to construct the interface.

## Get the "counter" value from the contract storage

**Web3js**:

```js
const counter = await contract.methodsObject.getCounter().call();
```

**Taquito**:

```js
const counter = await contract.storage();
```

This is another point that shows how different the Ethereum and the Tezos blockchains are.
On Ethereum, the contract has to implement getter functions to return values from its storage and make them available to dapps.
On Tezos, the whole storage is always available, and developers don't have to add view functions to their contracts to make the storage values available.

## Call the increment method on the contract instance

**Web3js**:

```js
const receipt = await contract.methodsObject.increment(1).send();
```

**Taquito**:

```js
const op = await contract.methodsObject.increment(1).send();
await op.confirmation();
```

Calling functions/entrypoints is very similar to Ethereum and Tezos. Just remember that the function doesn't return any value from the blockchain on Tezos.

## Deploy/originate a smart contract

**Web3js**:

```js
const newInstance = await myContract
  .deploy({
    data: 'contract_code',
    arguments: 'constructor_arguments',
  })
  .send();
const contractAddress = newInstance.options.address;
```

**Taquito**:

```js
const op = await Tezos.wallet
  .originate({
    code: 'parsed_michelson',
    storage: 'initial_storage',
  })
  .send();
const contract = await op.contract();
const contractAddress = contract.address;
```

Both functions return a new instance of the contract from which the newly deployed/originated contract address can be found.

## Check if the wallet injected an outdated version of the library in the browser

**Web3js**:

```js
if(typeof window.web3 !== undefined){
 // MetaMask injected web3
 ...
} else {
 ...
}
```

**Taquito**:

```js
Nope;
```

## Full code to connect to a local node and send a transaction to a smart contract

**Web3js**:

```js
import Web3 from 'web3';

let web3;
if (typeof window.web3 !== 'undefined') {
  web3 = new Web3(window.web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

const userBalance = await web3.eth.getBalance('0x_address');

const contract = new web3.eth.Contract('contract_ABI', 'contract_address');

const counter = await contract.methodsObject.counter().call();

const receipt = await contract.methodsObject.increment(counter + 1).send();
```

**Taquito**:

```js
import { TezosToolkit } from '@taquito/taquito';
const Tezos = new TezosToolkit('http://localhost:8732');
const wallet = Tezos.setProvider({ wallet: walletOfYourChoice }); // use the wallet of your choice

const userBalance = await Tezos.tz.getBalance('tz_address');

const contract = await Tezos.wallet.at('contract_address');

const counter = await contract.storage();

const op = await contract.methodsObject.increment(counter + 1).send();
await op.confirmation();
```
