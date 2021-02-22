---
title: Wallet API
author: Claude Barde
---

## What is the Wallet API?



The Tezos blockchain is a fantastic tool, but it is self-contained. Except for the transactions you send to it, it has no interaction with the outside world. However, it would be amazing to interact with it, such as making payments, reading the balance of an account, or recording data in a smart contract. This interaction is what the Wallet API (and Taquito in general) achieves. The Wallet API provides a new yet familiar way to interact with the blockchain and smart contracts by delegating several actions that Taquito previously handled to the wallets. This delegation offers more flexibility for both developers and users and gives the ecosystem more space to evolve.



## Installing the Wallet API



The first thing to do is to use the wallet API is to install it. You just need to install the Taquito package to use the wallet API:


```
npm install @taquito/taquito

```



or


```
yarn add @taquito/taquito

```



Make sure you have the latest version (`7.1.0` when this article was written, but the API became available from `6.3.2-beta.0`).



Once the package is downloaded, you can install the wallet of your choice. The wallet API supports different kinds of wallets. _Beacon_, _Thanos_ and _TezBridge_ wallets are available to use at the moment. You can install one or multiple wallets according to your needs:



```

npm install @taquito/tezbridge-wallet

npm install @taquito/beacon-wallet

npm install @thanos-wallet/dapp

```



Remember that some wallets may require an extra step in addition to the package installation. For example, TezBridge requires a plugin file, Thanos must be used with an extension installed in the browser. We will explain the requirements for the different wallets in detail in the sections below.



## Connecting the wallet



After installing the Taquito package in your dapp project and the package containing the Wallet API for the wallet of your choice, it's time to import the Wallet API into your project! Although the steps are very similar for each wallet, they all have their specificities that we will check in the paragraphs below.

To start, let's import the Tezos Toolkit from Taquito and create a new instance of the Tezos singleton:



```
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://mainnet-tezos.giganode.io');
```


This object exposes different methods we are going to use to set up our wallet. TZIP-10 has become the official standard of communication and interaction between wallets and dapps, so let's start with the `@taquito/beacon-wallet` package that implements this standard!



### - TZIP-10 wallet



The `BeaconWallet` is a package implementing the TZIP-10 standard that describes the communication between a dapp (decentralized application on Tezos) and a wallet (e.g., a browser extension). The Beacon wallet works with any wallet that supports the TZIP-10 standard (for example, the Beacon extension, Thanos, or Kukai). This package is the recommended way of connecting your dapp to a wallet. In addition to being future-proof, it gives your users the freedom to choose the wallet they want.



First, the `BeaconWallet` class must be imported:



```js

import { BeaconWallet } from '@taquito/beacon-wallet';

```



Then, you can start initializing the wallet:



```js

const options = {
  name: 'MyAwesomeDapp',
  iconUrl: 'https://tezostaquito.io/img/favicon.png',
  eventHandlers: {
    PERMISSION_REQUEST_SUCCESS: {
      handler: async (data) => {
        console.log('permission data:', data);
      },
    },
  },
};
const wallet = new BeaconWallet(options);

```



The necessary bare minimum to instantiate the wallet is an object with a `name` property that contains the name of your dapp. However, the Beacon wallet allows you to customize your dapp responses to different events. In the example above, instead of getting the default Beacon pop-up after the user connects the wallet, it will display the available data in the console. You can use whatever solution you prefer for feedback. You can find a list of all the default handlers [in the beacon-sdk Github repo](https://github.com/airgap-it/beacon-sdk/blob/master/src/events.ts).



The Beacon wallet requires an extra step to set up the network to connect to and the permissions:



```js

await wallet.requestPermissions({
  network: {
    type: 'mainnet' | 'carthagenet' | 'delphinet' | 'custom',
  },
});

```



You can choose among `mainnet`, `delphinet`, `carthagenet` and `custom` to set up the network. Once the permissions have been configured, you can get the user's address by calling the `getPKH` method on the wallet:



```

const userAddress = await wallet.getPKH();

```



To finish, you can set the wallet as your provider:



```

Tezos.setWalletProvider(wallet);

```



or



```js

Tezos.setProvider({ wallet });

```



#### Try the Beacon wallet!



Make sure you have the Beacon browser extension installed (the extension offers minimal features, the BeaconWallet works with any wallet implementing the TZIP-10 standard), the AirGap wallet on your phone, or any TZIP-10 ready wallet like Thanos or Kukai.



```js live noInline wallet

//import { BeaconWallet } from '@taquito/beacon-wallet';


const options = { name: 'MyAwesomeDapp' };
const wallet = new BeaconWallet(options);

wallet
  .requestPermissions({ network: { type: 'delphinet' } })
  .then((_) => wallet.getPKH())
  .then((address) => println(`Your address: ${address}`));

Tezos.setWalletProvider(wallet);

```



### - Development wallets



During the development of your dapp, you may prefer a less "user-friendly" option that gives you more information and details than a more user-friendly wallet. You may also want to install and set up a wallet quickly that requires less boilerplate than the Beacon SDK. In these cases, you can choose between the Tezbridge wallet (for more details in a lightweight format) and the ThanosWallet (for a quick setup using the Thanos wallet extension).



- Thanos wallet



Just like the other wallets, you have to import the Thanos wallet class first:



```

import { ThanosWallet } from '@thanos-wallet/dapp';

```



Then, Thanos requires an extra step to verify that the extension is installed and connected in the browser. The `ThanosWallet` class exposes a static property called `isAvailable` that just does that. You must use it before attempting to connect the wallet:



```

try {
  const available = await ThanosWallet.isAvailable();
  if (!available) {
    throw new Error('Thanos Wallet not installed');
  }
} catch (err) {
  console.log(err);
}

```



For this to work, you have to enable dapps in the Thanos wallet. Under `Settings`, you will find a `DApps` section where the checkbox must be checked to allow interactions between the wallet and the dapps.



Now that we are sure the extension is installed and running, we can continue connecting the wallet. We start by creating a new instance of the `ThanosWallet` class:



```

const wallet = new ThanosWallet('MyAwesomeDapp');

```



The class constructor takes one parameter, the name of your dapp (this will be used later in the transaction confirmation pop-up). After the instantiation, we can connect the wallet by calling the `connect` method:



```

await wallet.connect('mainnet' | 'delphinet' | 'carthagenet' | 'labnet' | 'sandbox');

```



Once the wallet is connected, there are a couple of things you can get out of it:



```js

const wallet = new ThanosWallet('MyAwesomeDapp');
// the ThanosWallet can return an instance of the Tezos singleton
const Tezos = await wallet.toTezos();
// the ThanosWallet can return the user's address
const userAddress = wallet.pkh || (await wallet.getPKH());

```



If you are using your own Tezos singleton instance, it is time to set the wallet as the provider (this is not necessary if you use the one provided by Thanos wallet, but remember you have to continue using it throughout your dapp):



```

Tezos.setWalletProvider(wallet);

```



or



```js

Tezos.setProvider({ wallet });

```



#### Try the Thanos wallet!



Make sure you have the Thanos browser extension installed first.



```js live noInline wallet

//import { ThanosWallet } from '@thanos-wallet/dapp';

ThanosWallet.isAvailable()
  .then(() => {
    const wallet = new ThanosWallet('MyAwesomeDapp');

    wallet.connect('delphinet').then(() => {
      Tezos.setWalletProvider(wallet);
      println(`Your address: ${wallet.pkh}`);
    });
  })
  .catch((err) => console.log(err));

```



- TezBridge wallet



> Note that the TezBridge wallet may not work correctly since the Delphi upgrade might be deprecated in the future.



First, we have to import the TezBridge wallet from the package:



```

import { TezBridgeWallet } from '@taquito/tezbridge-wallet';

```



Next, we can set up the wallet. In general, you will give your dapp users the choice of the wallet they prefer, so the wallet initialization wouldn't happen when the dapp is mounted but after user's interaction, for example, after pressing a button. It is important to remember that you have to import the TezBridge class in your HTML file before setting up your wallet, or this will throw an error:



```

<script src="https://www.tezbridge.com/plugin.js"></script>

```



To set up TezBridge as your wallet, you use the `setWalletProvider` method of the `Tezos` singleton instance and pass a new instance of the `TezBridgeWallet` class:



```js

Tezos.setWalletProvider(new TezBridgeWallet());

```



or



```

Tezos.setProvider({ wallet: new TezBridgeWallet() });

```



Please note that you don't need to interact directly with the `tezbridge` object that the plugin injects in the `window` object. Taquito will take care of it. You can even get the user's address using the TezBridgeWallet instance like so:



```

const wallet = new TezBridgeWallet();
Tezos.setWalletProvider(wallet);
const userAddress = await wallet.getPKH();

```



#### Try the TezBridge wallet!



```js live noInline wallet

//import { TezBridgeWallet } from '@taquito/tezbridge-wallet';
const wallet = new TezBridgeWallet();
Tezos.setWalletProvider(wallet);
wallet.getPKH().then((userAddress) => println(`Your address: ${userAddress}`));

```



## Making transfers



Although it is possible to transfer tokens directly from the wallets, Taquito offers to send tokens programmatically. This method could be a better solution if you want to do calculations before sending the tokens or if the amount of tokens to send is based on a variable value. This could also be preferable to avoid manual inputs that can often be a source of errors. Using Taquito to send tokens only requires to sign a transaction, sit back and relax :)



### - Transfer between implicit accounts



```js live noInline wallet

Tezos.wallet
  .transfer({ to: 'tz1NhNv9g7rtcjyNsH8Zqu79giY5aTqDDrzB', amount: 0.2 })
  .send()
  .then((op) => {
    println(`Hash: ${op.opHash}`);

    op.confirmation()
      .then((result) => {
        console.log(result);
        if (result.completed) {
          println('Transaction correctly processed!');
        } else {
          println('An error has occurred');
        }
      })
      .catch((err) => println(err));
  });

```



The `transfer` method takes an object with only two required properties: the `to` property that indicates the recipient of the transaction and the `amount` property for the number of tokens that should be sent. Unlike the Contract API, the transfer must be _sent_ by using the `.send` method, which returns a promise that will resolve with an instance of the [**TransactionWalletOperation class**](https://tezostaquito.io/typedoc/classes/_taquito_taquito.transactionwalletoperation.html). This instance holds, among others, the transaction hash under the `opHash` property. You can then call the `.confirmation()` method and pass as a parameter the number of confirmations you want to wait (one by default). Once confirmed, the returned promise is resolved to an object with a `complete` property set to true if the operation has been confirmed.



### - Transfer to smart contracts



```js live noInline wallet

Tezos.wallet
  .transfer({ to: 'KT1FEkrfq1KtUPXMCux8MRZGCrbmq6vGxUtE', amount: 0.2 })
  .send()
  .then((op) =>
    op
      .confirmation()
      .then((result) => println(result))
      .catch((err) => println(err))
  );

```



Transactions to smart contracts operate in the same fashion as transactions to an implicit account, the only difference being the `KT1...` address. You will also receive a transaction hash and have to wait for the transaction to be confirmed. Once confirmed, it can be the right time to update the user's/contract's balance, for example.



## Calling a smart contract



Sending a transaction to a smart contract to update its storage will be a different type of action as it implies targetting a specific entrypoint and formatting correctly the data to be sent.  

Fortunately, Taquito will make this operation go like a breeze! First, you need the contract abstraction created with the address of the smart contract you are targeting:



```
const contract = await 
Tezos.wallet.at('KT1FEkrfq1KtUPXMCux8MRZGCrbmq6vGxUtE');

```


This line creates a contract abstraction with multiple methods named after the contract entrypoints. For example, if you have a `transfer` entrypoint in your contract, you will also have a `.transfer()` method in the `contract` object. Each method accepts parameters required by the contract entrypoint.



In this example, we are working with a simple smart contract with two methods: `areYouThere` expects a value of type `boolean` to update the `areYouThere` value in the storage of the same type, and `addName` expects a value of type `string` to add it to the map in the contract.



### - Contract entrypoint arguments



Most of the entrypoint method's possible arguments are pretty straightforward and intuitive and do not require any explanation. However, a couple of them need more attention.

Most of the time, the process is simple: you take the contract abstraction you created for the contract you target, you call the `methods` property on it which exposes all the entrypoints of the contract as methods. You pass the argument you want to send to the contract as a function argument before calling the `send()` method to send the transaction:



```js live noInline wallet

Tezos.wallet
  .at('KT1EKZshRTnJQoA6ojbRisiiGwSB5kKNmZSt')
  .then((contract) => contract.methods.areYouThere(true).send())
  .then((op) => {
    println(`Hash: ${op.opHash}`);
    return op.confirmation();
  })
  .then((result) => {
    console.log(result);
    if (result.completed) {
      println(`Transaction correctly processed!
      Block: ${result.block.header.level}
      Chain ID: ${result.block.chain_id}`);
    } else {
      println('An error has occurred');
    }
  })
  .catch((err) => console.log(err));

```



In the case of multiple arguments (for example if the entrypoint expects a pair), you can just pass the arguments one by one. Be careful of the order of the arguments, they must be in the exact order expected by the contract entrypoint:



```js live noInline wallet

Tezos.wallet
  .at('KT1EKZshRTnJQoA6ojbRisiiGwSB5kKNmZSt')
  .then((contract) =>
    contract.methods.addName('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', 'Alice').send()
  )
  .then((op) => {
    println(`Hash: ${op.opHash}`);
    return op.confirmation();
  })
  .then((result) => {
    console.log(result);
    if (result.completed) {
      println(`Transaction correctly processed!
      Block: ${result.block.header.level}
      Chain ID: ${result.block.chain_id}`);
    } else {
      println('An error has occurred');
    }
  })
  .catch((err) => console.log(err));

```



If the entrypoint doesn't expect any value (or more precisely, if it expects a `unit` value), you also have to specify it when sending the transaction as follows:



```js

contract.methods.noArgumentEntrypoint([['unit']]).send();

```



This will tell Taquito that a value of type unit needs to be sent to the entrypoint.



### - `.send()` function arguments



In the previous examples, we called the `send()` method without passing any argument. However, it is also possible to change some options before sending a transaction by passing an object to the `send()` method.

The properties of the argument are described in the following interface:



```js

interface SendParams {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
  amount: number;
  source?: string;
  mutez?: boolean;

}

```



If you choose to use the parameters, only one property is mandatory: the `amount` property. It represents the amount of tokens you want to send to the contract. Let's check the other properties:



- `fee`: a custom fee for the current transaction

- `storageLimit`: sets the storage limit for the current transaction

- `gasLimit`: sets the gas limit for the current transaction

- `source`: a string indicating the source of the transaction

- `mutez`: if set to `true`, it indicates that the amount provided is in mutez



### - Operation hash and confirmation



The `.send()` method returns an instance of the [`TransactionWalletOperation`](https://tezostaquito.io/typedoc/classes/_taquito_taquito.transactionwalletoperation.html) class with different properties and methods you can use to gather information about the transaction. Among them, there are two properties and one method that you will use most of the time when using Taquito:



1. `.opHash`: this property holds the hash of the current transaction. It can be useful for debugging purposes or checking the status of the transaction in a block explorer.

2. `._included`: the `_included` property is set to `false` when the transaction is sent to the network and will be updated to `true` when it is included in a block. It can be useful to verify the transaction has been properly included in the blockchain.

3. `.confirmation()`: this method is a crucial promise to use in your code: it will wait until the transaction is confirmed before executing the rest of the code. You can pass a number as an argument if you want to wait for several block confirmations; otherwise it is set to `1` by default. Note that this method returns a promise with different valuable information:



   - `block`: holds details about the block in which the transaction was included, for example, the chain ID, the block level, etc.

   - `completed`: `true` if the transaction is over

   - `currentConfirmation`: the current number of confirmations, if more than 1 confirmation was requested (otherwise 1)



## Originating a contract



In the Tezos lingo, "origination" means "deployment of a contract to the blockchain". Before Taquito, this was painstaking work as it required to interact directly with a Tezos node and type commands to originate the contract. But not anymore! With Taquito, you only need the Michelson code and the initial storage to make it happen.



First, you need to get the code of the contract. If you deploy a contract you wrote, then you already have the code. If you want to deploy a copy of a contract, you can easily get its code with the following method:



```

const contract = await Tezos.contract.at(address);
const storage = await contract.storage();
const code = contract.script.code;

```



If you get the contract code through this method, it will already be properly formatted for origination. If you have a `.tz` file, you can use the `michel-codec` package to encode it properly:



```
import { Parser } from '@taquito/michel-codec';
const parser = new Parser();
const parsedMichelson = parser.parseScript(michelsonCode);

```



> Note: Since Taquito version 6.3.2, you can also pass plain Michelson to the parser without formatting it.



For example, this straightforward Michelson contract:



```

parameter int;
storage int;
code { DUP ; CDR ; SWAP ; CAR ; ADD ; NIL operation ; PAIR }

```



will be encoded and formatted this way:



```
[
  {
    "prim": "parameter",
    "args": [
      {
        "prim": "int"
      }
    ]
  },
  {
    "prim": "storage",
    "args": [
      {
        "prim": "int"
      }
    ]
  },
  {
    "prim": "code",
    "args": [
      [
        {
          "prim": "DUP"
        },
        {
          "prim": "CDR"
        },
        {
          "prim": "SWAP"
        },
        {
          "prim": "CAR"
        },
        {
          "prim": "ADD"
        },
        {
          "prim": "NIL",
          "args": [
            {
              "prim": "operation"
            }
          ]
        },
        {
          "prim": "PAIR"
        }
      ]
    ]
  }
]

```



> Note: make sure you have three objects in the main array with the following properties: one with "prim": "parameter", one with "prim": "storage", and one with "prim": "code".



Second, you need the initial storage. According to your smart contract's storage type, you must include a default storage to initialize the contract during the origination. The default (or initial) storage holds the values that will be saved into the smart contract when created and stored on the blockchain. For simple contracts like the one above, this will be very easy:



```

{
  code: parsedMichelson,
  storage: 2
}

```



If you use the Ligo programming language and the storage is a record, you can simply use a JavaScript object that Taquito will encode according to the storage type:



```js

{
  code: parsedMichelson,
  storage: {
    owner: "tz1...",
    counter: 2,
    paused: false
  }
}

```



In case of a map or a big map, you must import `MichelsonMap` from `@taquito/taquito` and use it to initialize the map:



```js

import { MichelsonMap } from "@taquito/taquito";

{
  code: parsedMichelson,
  storage: {
    ledger: new MichelsonMap(),
    owner: "tz1..."
  }
}

```



You can even initialize your map/big map with key/value pairs if you wish:



```js

import { MichelsonMap } from "@taquito/taquito";

{
  code: parsedMichelson,
  storage: {
    // ledger must be of type (map string int/nat/mutez) or (big_map string int/nat/mutez)
    ledger: MichelsonMap.fromLiteral({
      alice: 25,
      bob: 16
    }),
    owner: "tz1..."
  }
}

```



Now, we have everything we need to originate a new contract!



Before doing so, we have to choose the network we want to originate it to:



```

Tezos.setProvider({ rpc: 'https://mainnet-tezos.giganode.io}' });

```



Then, we can start the process. The Tezos singleton has a `wallet` property with an `originate` method. This is the one that must be called to originate the contract. This method takes an argument, an object with two properties: `code` that holds the parsed Michelson code to be originated and `storage` that has the initial storage. After passing this argument, you call the `send()` method to originate the contract.



```js

const op = await Tezos.wallet
  .originate({
    code: parsedMichelson,
    storage,
  })
  .send();
const opHash = op.opHash;
const contract = await op.contract();
console.log('Contract address:', contract.address);

```



The origination function returns an instance of the `OriginationWalletOperation` class containing the hash of the transaction under the `opHash` property. You can call the `contract()` method on this instance to wait for the contract to be confirmed. Once confirmed, the method returns a contract abstraction that you can use to get the contract address or interact with the contract.



## Working with the contract abstraction instance



Taquito makes interacting with smart contracts very easy! With only the smart contract address you want to interact with, you can create a `contract abstraction` and use it for subsequent interactions. You will not only be able to call entrypoints of the smart contract but also fetch its storage!



### - Instance creation



First, you need to import the Tezos singleton object or instantiate the Tezos toolkit and configure the RPC host you want to connect to:



```js

import { Tezos } from '@taquito/taquito';

Tezos.setProvider({ rpc: 'https://YOUR_PREFERRED_RPC_URL' });

```



_or_



```js

import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit();

Tezos.setProvider({ rpc: 'https://YOUR_PREFERRED_RPC_URL' });

```



Next, you can use the singleton object to create the smart contract instance with the contract address:



```

const contractInstance = await Tezos.wallet.at('contract address');

```



This returns the contract abstraction that you can now use to interact with the contract.



### - Contract properties and methods



Now, let's observe the contract abstraction that we obtained. It's an instance of the [ContractAbstraction class](https://tezostaquito.io/typedoc/classes/_taquito_taquito.contractabstraction.html) with different properties and methods:



_Properties:_



1. `address`: a string containing the address of the smart contract.

2. `methods`: an object whose methods are named after the contract entrypoints (if the entrypoints are not annotated, the methods will be numbers).

3. `parameterSchema`: an instance of the [Parameter class](https://github.com/ecadlabs/taquito/blob/d424fa178a95675920b21c8e8c228fbe0e7df36e/packages/taquito-michelson-encoder/src/schema/parameter.ts) with two useful methods: `hasAnnotation` tells you if the entrypoints are annotated and `isMultipleEntryPoint` tells you if the contract has multiple entrypoints (if _false_, you can interact with the contract with `.methods.default()`).

4. `schema`: an instance of the [Schema class](https://github.com/ecadlabs/taquito/blob/d424fa178a95675920b21c8e8c228fbe0e7df36e/packages/taquito-michelson-encoder/src/schema/storage.ts#L15) with various methods to get more information about the storage or the structure of the contract.

5. `script`: an object with two properties: `code` is an array with three objects, each representing the JSON formatted Michelson code for the parameter, storage and code (respectively), `storage` is the JSON formatted Michelson code for the storage of the contract.



_Methods:_



1. `bigMap`: a promise that takes a key from the big map in the storage as a parameter and returns the value associated with that key.

2. `storage`: a promise that returns a representation of the storage value(s). The storage is represented as an object whose keys are the name of the values. `map` and `big map` values are returned as an instance of the [BigMapAbstraction](https://tezostaquito.io/typedoc/classes/_taquito_taquito.bigmapabstraction-1.html) while numeric values are returned as BigNumber.



## The Wallet instance



The Tezos singleton object exposes a _wallet_ property in the same fashion it exposes the _contract_ property to which you may be used. This property is an instance of the [Wallet class](https://tezostaquito.io/typedoc/classes/_taquito_taquito.wallet.html) with a few useful methods you want to check out. It becomes available as soon as you set up a wallet by calling `Tezos.setProvider({wallet})` or `Tezos.setWalletProvider(wallet)`. Here is a list of the methods and a basic description of their function before seeing some examples:



1. `at`: creates a smart contract abstraction for the address specified

2. `batch`: creates a batch of operations

3. `originate`: originates a new contract

4. `pkh`: retrieves the private key hash of the account that is currently in use by the wallet

5. `registerDelegate`: registers the current address as a delegate

6. `setDelegate`: sets the delegate for a contract

7. `transfer`: transfers Tezos tokens from the current address to a specific address or call a smart contract



We have already seen the `at` method of the Wallet instance earlier in order to create the contract abstraction:



```js

const contract = await Tezos.wallet.at('KT1FEkrfq1KtUPXMCux8MRZGCrbmq6vGxUtE');

```



The method is a promise that expects the contract's address for which you want to create the abstraction.



This feature may be a lesser-known feature of Taquito, but it is possible to send operations batches at once! This operation is what the `batch` method does. There are two different ways of using it: you can either pass the operations to send as an array of objects in the parameter of the method or you can use the `withTransfer`, `withContractCall`, `withTransfer`, `withOrigination` or `withDelegation` methods it provides:



```js

const op = await Tezos.wallet
  .batch([
    {
      kind: 'transaction',
      to: 'tz1...',
      amount: 2,
    },
    {
      kind: 'origination',
      balance: '1',
      code: code,
      storage: 0,
    },
  ])
  .send();

await op.confirmation();

```



or



```js

const batch = Tezos.wallet
  .batch()
  .withTransfer({ to: 'tz1...', amount: 2 })
  .withOrigination({
    balance: '1',
    code: code,
    storage: 0,
  })
  .withContractCall(contractInstance.methods.entrypoint());

const batchOp = await batch.send();

await batchOp.confirmation();

```



> Note: you cannot make a contract call with the first method.



As with other operations, you must call the `confirmation` method on the returned operation to wait for the operation to be confirmed.



We already checked the `originate` method earlier, and it takes an object as a parameter with two properties: `code` with the Michelson code of the contract in a JSON format and storage with the initial storage.



```js

const op = await Tezos.wallet
  .originate({
    code: parsedMichelson,
    storage,
  })
  .send();
const opHash = op.opHash;
const contract = await op.contract();
console.log('Contract address:', contract.address);

```



Next, the `pkh` method allows you to retrieve the public key hash currently associated with the chosen wallet. Because the key is saved earlier in the process, you can pass an object as a parameter with a `forceRefetch` property set to **true** if you want Taquito to fetch the key and be sure you have the right one:



```js

// to fetch the current public key hash
const pkh = await Tezos.wallet.pkh();
// to force Taquito to retrieve the current public key hash
const refetchedPkh = await Tezos.wallet.pkh({ forceRefetch: true });

```



The Wallet instance also provides two methods to deal with delegate things on Tezos: the `registerDelegate` method takes the current address and registers it as a new delegate:



```

const op = await Tezos.wallet.registerDelegate().send();

await op.confirmation();

```



The `setDelegate` method takes an object as a parameter with a `delegate` property set to the address you want to set as a delegate:



```js

const op = await Tezos.wallet.setDelegate({ delegate: 'tz1...' }).send();

await op.confirmation();

```



Finally, the `transfer` method allows transfers between implicit accounts and calls to a smart contract. It takes an object as a parameter with four properties: `amount`, `mutez`, `parameter` and `to`. Here is how to use it to transfer tokens between two addresses:



```

const op = await Tezos.wallet.transfer({ to: 'tz1...', amount: 2 }).send();

await op.confirmation();

```



If you want to send a transaction to a contract, the process is very similar with the addition of the `parameter` property that must point to the entrypoint you are targetting and the value you want to pass:



```js

const op = await Tezos.wallet
  .transfer({ to: 'KT1...', parameter: { entrypoint: 'increment', value: 2 } })
  .send();

await op.confirmation();

```



## Choosing between the Contract API and the Wallet API



In most cases, you want to use the Wallet API when you give the users of your dapp the freedom to choose the wallet of their choice to interact with it. The Contract API is more suited for back-end applications and forging/signing offline (for example, using the `inMemorySigner`). You would also use the Contract API to build a wallet.



The Wallet API introduces a new method to process operation confirmations. Observables. When the dApp sends the operation to the wallet, the dApp will "listen" when the operation appears in a block. The Wallet API observable will "emit" a stream of events as they occur. Orphan/Uncle block detection is also surfaced when observing confirmations for an operation.



The duties of a Wallet are much broader than the very narrow duty of signing operation byte sequences. That's one reason why we built the Wallet API. It offers a better user experience by doing less. It allows Wallets to carry out all the duties expected of a Wallet.