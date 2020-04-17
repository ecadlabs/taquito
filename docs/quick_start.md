---
title: Quick start
author: Simon Boissonneault-Robert
---

## Installing Taquito using npm

> For quick-start, you may also like to try out our template/boilerplate app [here][boilerplate]

The following instructions assume you have a project already created, and you have `npm` installed and operable.

```bash
npm install @taquito/taquito
```

## Import the library in your project

You can use Taquito as a singleton object, or you can "new up" a new instance.

### Import `Tezos` (a singleton object) from `@taquito/taquito`

```js
import { Tezos } from '@taquito/taquito';
```

### Import `TezosToolkit` from `@taquito/taquito` and instantiate it

Making a new instance of Taquito is useful if you require more than one instance. Perhaps if you wanted to communicate with two different RPC nodes, or offer to different Signing options. You can new up separate instances with different providers or configuration per instance.

```js
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit();
```

## Configuration

### Configuring which RPC server to use

```js
import { Tezos } from '@taquito/taquito';

Tezos.setProvider({ rpc: 'https://YOUR_PREFERRED_RPC_URL' });
```

### Changing the underlying signer

Taquito's Contract API supports different signers. There is no default signer configured. A signer is required if you intend to inject operations into the Tezos blockchain.

You can set which signer you wish to use as follows:

```js
import { Tezos } from '@taquito/taquito';
import { TezBridgeSigner } from '@taquito/tezbridge-signer';

Tezos.setProvider({ signer: new TezBridgeSigner() });
```

## Examples

### Get the current Tezos balance for an address

```js live noInline
Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/mainnet' });
Tezos.tz
  .getBalance('tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw')
  .then(balance => println(`${balance.toNumber() / 1000000} ꜩ`))
  .catch(error => println(JSON.stringify(error)));
```

### Using the inMemory Singer and Importing a key

The `InMemorySigner` package is useful for development and testing. It's an easy way to get started with Tezos when you don't need to interact with a users wallet. The `InMemorySigner` is suitable for testing and development. Should you be writing code for production that deals with tokens of real value, it's strongly recommended that you use a RemoteSigner that is backed by a HSM.

This will import your private key in memory and sign operations using this key.

#### Importing a Private key

If you have a private key, you can import it as follows:

```js
import { Tezos } from '@taquito/taquito';
import { InMemorySigner, importKey } from '@taquito/taquito-signer';

Tezos.setProvider({ signer: new InMemorySigner() });
importKey(Tezos, 'p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1');
```

#### Importing a Faucet Key

"Faucet Keys" allow you to get Tezos tokens on the various Tezos "testnets". You can download a faucet key from https://faucet.tzalpha.net/
The key is a JSON file, which you can use with Taquito as follows:

```js
import { Tezos } from '@taquito/taquito';
import { InMemorySigner, importKey } from '@taquito/taquito-signer';

Tezos.setProvider({ signer: new InMemorySigner() });

const FAUCET_KEY = {
  mnemonic: [
    'cart',
    'will',
    'page',
    'bench',
    'notice',
    'leisure',
    'penalty',
    'medal',
    'define',
    'odor',
    'ride',
    'devote',
    'cannon',
    'setup',
    'rescue',
  ],
  secret: '35f266fbf0fca752da1342fdfc745a9c608e7b20',
  amount: '4219352756',
  pkh: 'tz1YBMFg1nLAPxBE6djnCPbMRH5PLXQWt8Mg',
  password: 'Fa26j580dQ',
  email: 'jxmjvauo.guddusns@tezos.example.org',
};

importKey(
  Tezos,
  FAUCET_KEY.email,
  FAUCET_KEY.password,
  FAUCET_KEY.mnemonic.join(' '),
  FAUCET_KEY.secret
);
```

### Transfer

The transfer operation requires a configured signer. In this example we will use a private key that we fetch a key service, implemented for demonstration purposes. This key service should only be used for testing and development purposes.

```js live noInline
const amount = 2;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

println(`Transfering ${amount} ꜩ to ${address}...`);
Tezos.contract.transfer({ to: address, amount: amount })
  .then(op => {
    println(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
  })
  .then(hash => println(`Operation injected: https://carthagenet.tzstats.com/${hash}`))
  .catch(error => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

### Interact with a smart contract

Calling smart contract operations requires a configured signer, in this example we will use a faucet key. The Ligo source code for this smart contract [KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC][smart_contract_on_better_call_dev] used in this example can be found in a [Ligo Web IDE][smart_contract_source].

```js live noInline
Tezos.contract.at('KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC')
  .then(contract => {
    const i = 7;

    println(`Incrementing storage value by ${i}...`);
    return contract.methods.increment(i).send();
  })
  .then(op => {
    println(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
  })
  .then(hash => println(`Operation injected: https://carthagenet.tzstats.com/${hash}`))
  .catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

[boilerplate]: https://github.com/ecadlabs/taquito-boilerplate
[smart_contract_source]: https://ide.ligolang.org/p/CelcoaDRK5mLFDmr5rSWug
[smart_contract_on_better_call_dev]: https://better-call.dev/carthage/KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC/operations
