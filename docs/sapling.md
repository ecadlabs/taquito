---
title: Sapling Toolkit
author: Roxane Letourneau
---

Sapling is a protocol allowing private transactions in a decentralized environment. 
Sapling was introduced in Tezos in the Edo protocol. Refer to the Tezos documentation for more information on Sapling: https://tezos.gitlab.io/active/sapling.html

## Keys

**Spending key**

The spending key is used to spend tokens. It must be handled securely to prevent funds from being lost or stolen.

Taquito offers support for encrypted/unencrypted spending keys and mnemonics. Refer to the following link for more information: [InMemorySpendingKey](./sapling_in_memory_spending_key.md)

**Viewing key**

The viewing key is derived from the spending key. This key can be used to view all incoming and outgoing transactions. It must be handled securely to prevent a loss of privacy, as anyone accessing it can see the transaction history and the balance.

Refer to the following link for more information: [InMemoryViewingKey](./sapling_in_memory_viewing_key.md)

**Sapling address**

Sapling addresses are used to receive tokens. They are derived from the viewing key.

Here is an example on how to retrieve addresses: [InMemoryViewingKey](./sapling_in_memory_viewing_key.md#how-to-retrieve-payment-addresses-from-the-viewing-key)


# Sapling toolkit

The `@taquito/sapling` package provides a `SaplingToolkit` class that surfaces all of the Sapling capabilities, allowing it to read from a Sapling state and prepare transactions. 

The constructor of the `SaplingToolkit` takes the following properties:
- an instance of `InMemorySpendingKey` as the spending key is needed to prepare and sign transactions that spend tokens
- the second parameter is an object containing:
  - the address of the Sapling contract (string)
  - the size of the memo of the corresponding Sapling contract (number)
  - an optional Sapling id that must be specified if the contract contains more than one Sapling state.
- an instance of a class implementing the `TzReadProvider` interface, which allows getting data from the blockchain
- it is possible to specify a different packer than the `MichelCodecPacker`, which is used by default

Here is an example of how to instantiate a `SaplingToolkit`:

```ts
import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
import { SaplingToolkit } from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';

const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
const readProvider = new RpcReadAdapter(new RpcClient('https://YOUR_PREFERRED_RPC_URL'));
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const saplingToolkit = new SaplingToolkit(
    inMemorySpendingKey, 
    { contractAddress: saplingContract.address, memoSize: 8 }, 
    readProvider
)
```

## How to retrieve my balance in the Sapling shielded pool?

When calling the `getSaplingTransactionViewer` method of the `SaplingToolkit` class, an instance of the `SaplingTransactionViewer` class is returned. The `SaplingTransactionViewer` class allows retrieving and decrypting Sapling transactions for the specified viewing key and calculating the unspent balance. 

For each entry in the shielded pool, the `SaplingTransactionViewer` class will try to decrypt them using the viewing key as if it were the receiver. If a ciphertext is successfully decrypted, the configured account was the receiver of the output. The `SaplingTransactionViewer` will find which inputs were not spent by computing their nullifier. If an input is spent, its nullifier will be in the Sapling state. If the nullifier is not present, the input has not been spent, and its value will be considered in the calculated balance.

The balance can be retrieved as follows:

```ts
const txViewer = await saplingToolkit.getSaplingTransactionViewer();
const initialBalance = await txViewer.getBalance();
```

Note that the balance is represented in mutez.

## How to retrieve my transaction history?

The `SaplingTransactionViewer` class exposes a method called `getIncomingAndOutgoingTransactions` which allows decrypting the transactions received and sent based on the viewing key. Information like the value in mutez, the memo or the payment address can be retrieved as well as if the input is spent for the incoming ones.

Example:

```ts
const txViewer = await saplingToolkit.getSaplingTransactionViewer();
const initialBalance = await txViewer.getIncomingAndOutgoingTransactions();

/* initialBalance :
{
    incoming: [
    {
        value: new BigNumber(3000000),
        memo: 'First Tx',
        paymentAddress: alicePaymentAddress,
        isSpent: true
    },
    {
        value: new BigNumber(1000000),
        memo: '',
        paymentAddress: alicePaymentAddress,
        isSpent: false
    }
    ],
    outgoing: [
    {
        value: new BigNumber(2000000),
        memo: 'A gift',
        paymentAddress: bobPaymentAddress
    },
    {
        value: new BigNumber(1000000),
        memo: '',
        paymentAddress: alicePaymentAddress
    }
    ]
} */
```

## How to prepare a shielded transaction?

A shielded transaction allows sending tokens from a Tezos account (tz1, tz2, tz3) to a Sapling address (zet). The `prepareShieldedTransaction` method of the `SaplingToolkit` takes an array of `ParametersSaplingTransaction`, making it possible to send tez to multiple addresses at once if needed. 

The `ParametersSaplingTransaction` is an object made of:
- a `to` property, which is the destination address (zet)
- an `amount` property, which is the amount to shield in tez by default
- an optional `memo` that cannot be longer than the specified memo size
- an optional `mutez` property that must be set to true if the specified amount is in mutez rather than tez

The `prepareShieldedTransaction` method returns the crafted Sapling transaction parameter but does not perform any change on the shielded pool. A subsequent step where the Sapling transaction parameter is submitted to the smart contract must be done. Note that in a case of a shielded transaction, the shielded amount must be sent along when calling the smart contract to transfer the tez to the shielded pool, or it will result in an error.

Here is an example of how to prepare and inject a shielded transaction using Taquito:

```ts
import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
import { SaplingToolkit } from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';

const readProvider = new RpcReadAdapter(new RpcClient('https://YOUR_PREFERRED_RPC_URL'));
const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
// Note: you need to set up your signer on the TezosToolkit as usual
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const saplingToolkit = new SaplingToolkit(
    inMemorySpendingKey, 
    { contractAddress: saplingContract.address, memoSize: 8 }, 
    readProvider
)

// Fetch a payment address (zet)
const inMemoryViewingKey = await inMemorySpendingKey.getInMemoryViewingKey();
const paymentAddress = (await inMemoryViewingKey.getAddress()).address;

// prepare the shielded transaction
const shieldedTx = await saplingToolkit.prepareShieldedTransaction([{
    to: paymentAddress,
    amount: 3,
    memo: 'test',
    mutez: false // set to false by default
}])

// Inject the Sapling transaction using the ContractAbstraction
// The amount MUST be specified in the send method to transfer the 3 tez to the shielded pool
const op = await saplingContract.methods.default([shieldedTx]).send({ amount: 3 });
await op.confirmation();
```

## How to prepare a Sapling transaction?

A Sapling transaction allows sending tokens from an address (zet) to an address (zet). The `prepareSaplingTransaction` method of the `SaplingToolkit` takes an array of `ParametersSaplingTransaction`, making it possible to send tez to multiple addresses at once if needed. 

The `ParametersSaplingTransaction` is an object made of:
- a `to` property, which is the destination address (zet)
- an `amount` property, which is the amount to shield in tez by default
- an optional `memo` that cannot be longer than the specified memo size
- an optional `mutez` property that must be set to true if the specified amount is in mutez rather than tez

The `prepareSaplingTransaction` method returns the crafted Sapling transaction parameter but does not perform any change on the shielded pool. A subsequent step where the Sapling transaction parameter is submitted to the smart contract must be done. 

:::note
A user should not use their own implicit account (tz1, tz2, tz3) to submit a Sapling transaction but rather have a third party inject it.
:::

Here is an example of how to prepare and inject a Sapling transaction using Taquito:

```ts
import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
import { SaplingToolkit } from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';

const readProvider = new RpcReadAdapter(new RpcClient('https://YOUR_PREFERRED_RPC_URL'));
const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
// Note: you need to set up your signer on the TezosToolkit as usual
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const saplingToolkit = new SaplingToolkit(
    inMemorySpendingKey, 
    { contractAddress: saplingContract.address, memoSize: 8 }, 
    readProvider
)

const shieldedTx = await saplingToolkit.prepareSaplingTransaction([{
    to: 'zet14CMN2T4x1f8sgXeAGWQwczSf6SJ8bm8nyP2Tg7HJn2VmtPtB2nE2q7MMgdmMEwpGQ',
    amount: 3,
    memo: 'test',
    mutez: false // set to false by default
}])

const op = await saplingContract.methods.default([shieldedTx]).send();
await op.confirmation();
```

## How to prepare an unshielded transaction?

An unshielded transaction allows sending tokens from an address (zet) to a Tezos address (tz1, tz2, tz3). The `prepareUnshieldedTransaction` method of the `SaplingToolkit` takes a single `ParametersUnshieldedTransaction`.

The `ParametersUnshieldedTransaction` is an object made of:
- a `to` property, which is the destination  account (tz1, tz2, tz3)
- an `amount` property, which is the amount to shield in tez by default
- an optional `mutez` property that must be set to true if the specified amount is in mutez rather than tez

The `prepareUnshieldedTransaction` method returns the crafted Sapling transaction parameter but does not perform any change on the shielded pool. A subsequent step where the Sapling transaction parameter is submitted to the smart contract must be done to retrieve the tokens from the pool. 

Here is an example of how to prepare and inject an unshielded transaction using Taquito:

```ts
import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
import { SaplingToolkit } from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';

const readProvider = new RpcReadAdapter(new RpcClient('https://YOUR_PREFERRED_RPC_URL'));
const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
// Note: you need to set up your signer on the TezosToolkit as usual
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const saplingToolkit = new SaplingToolkit(
    inMemorySpendingKey, 
    { contractAddress: saplingContract.address, memoSize: 8 }, 
    readProvider
)

const shieldedTx = await saplingToolkit.prepareUnshieldedTransaction({
    to: 'tz1hDFKpVkT7jzYncaLma4vxh4Gg6JNqvdtB',
    amount: 3,
    mutez: false // set to false by default
})

const op = await saplingContract.methods.default([shieldedTx]).send();
await op.confirmation();
```

# SaplingTransactionViewer

We don't require the spending key to retrieve the balance and transaction history. It can be done using the viewing key and the SaplingTransactionViewer class.

The constructor of the `SaplingTransactionViewer` takes the following properties:
- an instance of `InMemoryViewingKey` 
- the second parameter is an object containing:
  - the address of the Sapling contract or a Sapling id if the contract contains more than one Sapling state.
- an instance of a class implementing the `TzReadProvider` interface, which allows getting data from the blockchain

Here is an example of how to instantiate a `SaplingTransactionViewer`:

```ts
import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
import { InMemoryViewingKey } from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';

const readProvider = new RpcReadAdapter(new RpcClient('https://YOUR_PREFERRED_RPC_URL'));
const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
// Note: you need to set up your signer on the TezosToolkit as usual
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemoryViewingKey = new InMemoryViewingKey(
    '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a'
);

const saplingTransactionViewer = new SaplingTransactionViewer(
    inMemoryViewingKey, 
    { contractAddress: saplingContract.address }, 
    readProvider
)
```

Refer to these sections to [retrieve the balance](sapling#how-to-retrieve-my-balance-in-the-sapling-shielded-pool) and [view the transaction history](sapling#how-to-retrieve-my-transaction-history).