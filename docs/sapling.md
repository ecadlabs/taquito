---
title: Sapling Toolkit
author: Roxane Letourneau
---

Sapling is a protocol allowing to perform private transactions in a decentralized environment. 
Sapling was introduced in Tezos in the Edo protocol. Refer to the Tezos documentation for more information on sapling: https://tezos.gitlab.io/active/sapling.html

## Keys

**Spending key**

The spending key is used to spend tokens. It must be handled securely to prevent funds from being lost or stolen.

Taquito offers support for encrypted/unencrypted spending keys and mnemonics. Refers to the following link for more information: [InMemorySpendingKey](./sapling_in_memory_spending_key.md)

**Viewing key**

The viewing key is derived from the spending key. This key can be used to view all incoming and outgoing transactions. It must be handled securely to prevent a loss of privacy, as anyone having access to it can see the transaction history and the balance.

Refers to the following link for more information: [InMemoryViewingKey](./sapling_in_memory_viewing_key.md)

**Address**

Addresses are used to receive tokens. They are derived from the viewing key.

Here is an example on how to retrieve addresses: [InMemoryViewingKey](./sapling_in_memory_viewing_key.md#how-to-retrieve-payment-addresses-from-the-viewing-key)


# Sapling toolkit

The `@taquito/sapling` package provides a `SaplingToolkit` class that surfaces all of the sapling capabilities allowing to read from a sapling state and prepare transactions. 

The constructor of the `SaplingToolkit` takes the following properties:
- an instance of `InMemorySpendingKey` as the spending key is needed to prepare and sign transactions that spend tokens
- the second parameter is an object containing:
  - the address of the sapling contract (string)
  - the size of the memo of the corresponding sapling contract (number)
  - an optional sapling id that must be specified if the contract contains more than one sapling state.
- an instance of a class implementing the `TzReadProvider` interface, which allows getting data from the blockchain
- it is possible to specify a different packer than the `MichelCodecPacker`, which is used by default

Here is an example of how to instantiate a `SaplingToolkit`:

```ts
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const saplingToolkit = new SaplingToolkit(
    inMemorySpendingKey, 
    { contractAddress: saplingContract.address, memoSize: 8 }, 
    tezos.getFactory(RpcReadAdapter)()
)
```

## How to retrieve my balance in the Sapling shielded pool?

When calling the `getSaplingTransactionViewer` method of the `SaplingToolkit` class, an instance of the `SaplingTransactionViewer` class is returned. The `SaplingTransactionViewer` class allows retrieving and decrypting sapling transactions for the specified viewing key and calculating the unspent balance. 

For each entry in the shielded pool, the `SaplingTransactionViewer` class will try to decrypt them using the viewing key as if it were the receiver. If a ciphertext is successfully decrypted, the configured account was the receiver of the output. The `SaplingTransactionViewer` will find which inputs were not spent by computing their nullifier. If an input is spent, its nullifier will be in the sapling state. If the nullifier is not present, thus the input has not been spent, and its value will be considered in the calculated balance.

The balance can be retrieved as follow:

```ts
const txViewer = await saplingToolkit.getSaplingTransactionViewer();
const initialBalance = await txViewer.getBalance();
```

Note that the balance is represented in mutez.

## How to retrieve my transaction history?

The `SaplingTransactionViewer` class exposes a method called `getIncomingAndOutgoingTransactions` which allows decrypting the transactions received and sent based on the viewing key. Information like the value in mutez, the memo, the payment address can be retrieved as well as if the input is spent for the incoming ones.

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

Send tokens from a Tezos account (tz1, tz2, tz3) to an address (zet).

```ts
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const saplingToolkit = new SaplingToolkit(
    inMemorySpendingKey, 
    { contractAddress: saplingContract.address, memoSize: 8 }, 
    tezos.getFactory(RpcReadAdapter)()
)

// Fetch a payment address (zet)
const inMemoryViewingKey = await inMemorySpendingKey.getInMemoryViewingKey();
const paymentAddress = (await inMemoryViewingKey.getAddress()).address;

const shieldedTx = await saplingToolkit.prepareShieldedTransaction([{
    to: paymentAddress,
    amount: 3,
    memo: 'test',
    mutez: false // set to false by default
}])

// Inject the sapling transaction using the ContractAbstraction
// The amount MUST be specified in the send method to transfer the 3 tez to the shielded pool
const op = await saplingContract.methods.default([shieldedTx]).send({ amount: 3 });
await op.confirmation();
```

## How to prepare a sapling transaction?

Send tokens from an address (zet) to an address (zet).

```ts
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const saplingToolkit = new SaplingToolkit(
    inMemorySpendingKey, 
    { contractAddress: saplingContract.address, memoSize: 8 }, 
    tezos.getFactory(RpcReadAdapter)()
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

Send tokens from an address (zet) to a Tezos account (tz1, tz2, tz3).

```ts
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const saplingToolkit = new SaplingToolkit(
    inMemorySpendingKey, 
    { contractAddress: saplingContract.address, memoSize: 8 }, 
    tezos.getFactory(RpcReadAdapter)()
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
  - the address of the sapling contract or a sapling id if the contract contains more than one sapling state.
- an instance of a class implementing the `TzReadProvider` interface which allows to get data from the blockchain

Here is an example of how to instantiate a `SaplingTransactionViewer`:

```ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemoryViewingKey } from '@taquito/sapling';

const tezos = new TezosToolkit('https://jakartanet.ecadinfra.com/');
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemoryViewingKey = new InMemoryViewingKey(
    '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a'
);

const saplingTransactionViewer = new SaplingTransactionViewer(
    inMemoryViewingKey, 
    { contractAddress: saplingContract.address }, 
    tezos.getFactory(RpcReadAdapter)()
)
```