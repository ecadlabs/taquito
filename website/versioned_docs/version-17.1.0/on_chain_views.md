---
title: On-chain views
author: Roxane Letourneau
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## On-chain views description

- The `On-chain views` feature was introduced in the Hangzhou protocol. 
- Views are meant to be called by a contract. It can be the contract where the view is defined or another contract.
- Views help to avoid the need to use callbacks in contracts.
- Views take arguments as input and may depend on the contract's storage declaring the view.
- Views are read-only and won't modify the contract's storage where the view is defined.
- Views return a result as output which is immediately available on the stack of the caller contract.
- The types `ticket`, `operation`, `big_map`, and `sapling_state` are not allowed in the argument or return types of views.

## Declaring an on-chain view

A contract can define none, one, or multiple on-chain views. The views are declared at the top level of the contract script and are formed by a name, an argument type, a result type, and a sequence of instructions.

**Example of a contract script that declares multiple views:**

```
parameter nat ;
storage nat ;
code { CAR ; NIL operation ; PAIR } ;
view "add" nat nat { UNPAIR ; ADD } ;
view "id" nat (pair nat nat) { } ;
view "test_failwith" nat (pair nat nat) { FAILWITH } ;
view "step_constants" unit (pair (pair mutez mutez) (pair (pair address address) address ))
     { DROP ;
       SOURCE;
       SENDER;
       SELF_ADDRESS;
       PAIR;
       PAIR;
       BALANCE;
       AMOUNT;
       PAIR;
       PAIR;
     } ;

view "succ" (pair nat address) nat
     { CAR;
       UNPAIR;
       PUSH nat 1; ADD;
       PAIR;
       DUP; CDR; SWAP;
       VIEW "is_twenty" nat; ASSERT_SOME;
     } ;
view "is_twenty" (pair nat address) nat
     {
       CAR;
       DUP;
       CAR;
       PUSH nat 20 ;
       COMPARE;
       EQ ;
       IF { CAR; }
          { DUP; CDR; SWAP; VIEW "succ" nat; ASSERT_SOME }
     } ;
view "fib" nat nat
     {
       CAR;
       DUP;
       PUSH nat 0 ;
       COMPARE ;
       EQ ;
       IF { }
          { DUP;
            PUSH nat 1;
            COMPARE;
            EQ;
            IF { }
               { DUP;
                 PUSH nat 1; SWAP; SUB; ABS;
                 SELF_ADDRESS;
                 SWAP;
                 VIEW "fib" nat;
                 IF_SOME { SWAP;
                           PUSH nat 2; SWAP; SUB; ABS;
                           SELF_ADDRESS;
                           SWAP;
                           VIEW "fib" nat;
                           IF_SOME { ADD; } { FAIL }
                         }
                         { FAIL };
               }
          }
     }
```  
  
## Calling an on-chain view

Views are meant to be called by a contract using the Michelson Instruction `View` followed by the view name and its result type.

**Example of a contract script having a call to a view named `fib`:**

```
parameter (pair nat address) ;
storage nat;
code {
       CAR;
       UNPAIR;
       VIEW "fib" nat;
       IF_SOME {NIL operation ; PAIR;} { FAIL }
     }
```

**Example of calling a contract entrypoint that makes a call to a view using Taquito:**

The following live code example shows a contract (`contractCallFib`) calling the view `fib` of another contract (`contractTopLevelViews`). 

The example first shows the initial storage of the contract `contractCallFib`. It calls the default entry point of `contractCallFib` with the value of its storage + 1 and the address of the contract `contractTopLevelViews`. A call is made to the `fib` view of `contractTopLevelViews` with the `storage + 1` as argument. The view returns the value of the Fibonacci sequence at the position represented by `storage + 1`. The storage of `contractCallFib` is updated to the result of the view.

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
const contractTopLevelViews = 'KT1Anag1s3N7erRXrRAtPpRC2PRXrqcCJ43m';
const contractCallFib = 'KT1KPDBat3prp2G81aDDLyJ38Vbq6YLYFQo8';

Tezos.contract.at(contractCallFib)
  .then((contract) => {
    contract.storage()
      .then((storage) => {
        println(`The initial storage of ${contractCallFib} is ${storage}.`);
        const fibPosition = storage.toNumber() + 1;
        println(`Calling the default method of ${contractCallFib} will call the view fib of ${contractTopLevelViews} with ${fibPosition}.`);
        return contract.methodsObject.default({ 0: fibPosition, 1: contractTopLevelViews }).send()
          .then((op) => {
            println(`Waiting for ${op.hash} to be confirmed...`);
            return op.confirmation().then(() => op.hash)
              .then(() => {
                return contract.storage()
                  .then((finalStorage) => {
                    println(`The storage is now ${finalStorage} which corresponds to the value of the Fibonacci sequence at position ${fibPosition}.`);
                  })
              })
          })
      })
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
const contractTopLevelViews = 'KT1Anag1s3N7erRXrRAtPpRC2PRXrqcCJ43m';
const contractCallFib = 'KT1KPDBat3prp2G81aDDLyJ38Vbq6YLYFQo8';

Tezos.wallet.at(contractCallFib)
  .then((contract) => {
    contract.storage()
      .then((storage) => {
        println(`The initial storage of ${contractCallFib} is ${storage}.`);
        const fibPosition = storage.toNumber() + 1;
        println(`Calling the default method of ${contractCallFib} will call the view fib of ${contractTopLevelViews} with ${fibPosition}.`);
        return contract.methodsObject.default({ 0: fibPosition, 1: contractTopLevelViews }).send()
          .then((op) => {
            println(`Waiting for ${op.opHash} to be confirmed...`);
            return op.confirmation().then(() => op.opHash)
              .then(() => {
                return contract.storage()
                  .then((finalStorage) => {
                    println(`The storage is now ${finalStorage} which corresponds to the value of the Fibonacci sequence at position ${fibPosition}.`);
                  })
              })
          })
      })
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```  
  </TabItem>
</Tabs>

## How to simulate a view execution using Taquito

Taquito offers the ability to simulate the result of on-chain views. 

The user can create an instance of `ContractAbstraction` using the `at` method of the Contract or Wallet API with the contract's address that defines the views. The `contractViews` member of the `ContractAbstraction` instance is dynamically populated with methods that match the on-chain view names. 

*`contractViews` is an object where the key is the view name, and the value is a function that takes the view arguments as a parameter and returns an instance of `OnChainView` class.*

If the view takes multiple arguments, the view parameter is expected in an object format and not flattened arguments.

*Note for reference, the flattened arguments are the expected format when calling a contract entry point using the `methods` member, but we plan to move away from this format in favor the object one, which is also used for the storage when deploying a contract [see the difference between `methodsObject` and `methods` members of the `ContractAbstraction`](smartcontracts.md#choosing-between-the-methods-or-methodsobject-members-to-interact-with-smart-contracts).*

A method named `getSignature` on the `OnChainView` class allows inspecting the parameter and the returned type of the view. 

The `executeView` method of the `OnChainView` class allows simulating the view. It takes a `viewCaller` as a parameter representing the contract address which is the caller of the view, and an optional `source` which is the public key hash of the account that initialized this view execution.

Here is an example:

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
const contractTopLevelViews = 'KT1Anag1s3N7erRXrRAtPpRC2PRXrqcCJ43m';
const contractCallFib = 'KT1KPDBat3prp2G81aDDLyJ38Vbq6YLYFQo8';
const fibPosition = 7;

Tezos.contract.at(contractTopLevelViews)
  .then((contract) => {
    return contract.contractViews.fib(fibPosition).executeView({ viewCaller: contractCallFib })
      .then((viewResult) => {
        println(`The result of the view simulation is ${viewResult}.`);
      })
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
const contractTopLevelViews = 'KT1Anag1s3N7erRXrRAtPpRC2PRXrqcCJ43m';
const contractCallFib = 'KT1KPDBat3prp2G81aDDLyJ38Vbq6YLYFQo8';
const fibPosition = 7;

Tezos.wallet.at(contractTopLevelViews)
  .then((contract) => {
    return contract.contractViews.fib(fibPosition).executeView({ viewCaller: contractCallFib })
      .then((viewResult) => {
        println(`The result of the view simulation is ${viewResult}.`);
      })
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```  
  </TabItem>
</Tabs>

:::caution
On-chain views should not be confused with lambda views which are also available on the ContractAbstraction class. See the documentation for [lambda_view](lambda_view.md).
:::

Follow this link for more information about on-chain views: https://tezos.gitlab.io/active/michelson.html#operations-on-views
