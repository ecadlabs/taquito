---
title: Multisig contract interactions
author: Claude Barde
---

# Interacting with the multisig contract
The `tezos-client` provides a simple multisig contract that you can originate and interact with directly from the command line.  

However, you may want to build a dapp that interacts with the contract, and writing the JavaScript to do so turns out to be tricky.  

After understanding the structure of the contract, you will be able to use Taquito to write code that will send a `transfer` transaction and a `change_keys` transaction to your originated multisig contract.

## What is the multisig contract?
A multisig contract is a smart contract that allows a group of users to agree and control different actions executed through the contract.  

The multisig contract in the `tezos-client` allows three actions:
- the receiving of tez through the default entrypoint
- the transfer of tez stored in the contract to a given address
- the update of the participants to the multisig contract

> Note:
> Only the first action is not subject to the agreement of the participants, anybody can send tez to the contract

In order to transfer tez or to change the participants of the multisig contract, a transaction must be sent to the contract. The transaction must include a payload and a list of signatures generated from the payload, and the length of the list must match or exceed the current threshold stored in the contract storage.

The storage of the contract includes also a counter that is incremented at every successful transaction to prevent operations from being replayed.

## Using the `transfer` entrypoint
The multisig contract allows the participants to send a Michelson lambda along with a payload, for example, to authorize the transfer of a certain amount of tez to an implicit account. This operation requires multiple steps:
- Writing a lambda in Michelson that will forge an operation to transfer the tez to the provided address
- Writing the nested pair that will include the different values required by the contract
- Packing the Michelson value created in the previous step
- Having the participants of the contract sign the packed value
- Sending a transaction to the contract with the payload and the obtained signatures

> Note:
> A `lambda` is an inline function made of Michelson code within curly braces that will be run during the contract execution.

Let's see how that translates into JavaScript:

```typescript
const lambda = `{ 
    DROP ; 
    NIL operation ; 
    PUSH key_hash "${RECIPIENT_ADDRESS}" ; 
    IMPLICIT_ACCOUNT ; 
    PUSH mutez ${AMOUNT} ; 
    UNIT ; 
    TRANSFER_TOKENS ; 
    CONS 
}`;
```  

First, we write the Michelson lambda that will be executed to transfer the tez, where `RECIPIENT_ADDRESS` is the public key hash of the recipient of the tez and `AMOUNT` is the amount of mutez to be sent.

The lambda for this particular use case is already offered by Taquito, so you don't have to write it every time, you can just import it:
```typescript
import { MANAGER_LAMBDA } from "@taquito/taquito";

const lambda = MANAGER_LAMBDA.transferImplicit(RECIPIENT_ADDRESS, AMOUNT);
``` 

Next, we will use the lambda to create the required payload for this action:
```typescript
import { TezosToolkit } from "@taquito/taquito";
import { Parser, packDataBytes } from "@taquito/michel-codec";

const Tezos = new TezosToolkit(RPC_URL);
const chainId = await Tezos.rpc.getChainId();
const contract = await Tezos.contract.at(MULTISIG_ADDRESS);
const storage: any = await contract.storage();
const counter = storage.stored_counter.toNumber();

const p = new Parser();

const michelsonData = `(
    Pair "${chainId}" 
        (
            Pair "${MULTISIG_ADDRESS}" 
            (
                Pair ${counter} (Left ${lambda})
            )
        )
)`;
const dataToPack = p.parseMichelineExpression(michelsonData);
```

The payload expected by the multisig contract is a nested pair that contains the chain id, the address of the contract, the current counter (from the contract storage) and the option set to `Left` with the lambda as a value.  

The payload is then parsed using the parser from the `@taquito/michel-codec` package.

After that, we need to parse the payload type in a similar fashion:
```typescript
const michelsonType = `
(pair 
        chain_id 
        (pair 
            address 
            (pair 
                nat 
                (or 
                    (lambda unit (list operation)) 
                    (pair 
                        nat 
                        (list key)
                    )
                )
            )
        )
)
`;
const typeToPack = p.parseMichelineExpression(michelsonType);
```

Now that both the value and its type have been properly parsed, we can pack them:
```typescript
const { bytes: payload } = packDataBytes(
    dataToPack as any, 
    typeToPack as any
);
```

This action uses the `packDataBytes` method that you can find in the `@taquito/michel-codec` package to pack the data we created above locally. This will output the payload that will be signed.

>Note:
> `packDataBytes` allows local packing, which removes any risk of data corruption that may exist when using the packing feature of a remote RPC node.

```typescript
const sig = (
    await Tezos.signer.sign(
        payload, 
        new Uint8Array()
    )
).prefixSig;
``` 

The instance of the `TezosToolkit` holds a signer that you can use to sign arbitrary data as shown above. It returns different values and we will keep the one under the `prefixSig` property.

From there, the payload will be shared with the other participants. Each one of them will review it, and sign it and the initiator of the contract call will collect all the signatures to submit them with the transaction.

Now the transaction can be forged and sent to the contract:
```typescript
try {
    const contract = await Tezos.contract.at(MULTISIG_ADDRESS);
    const storage: any = await contract.storage();
    const op = await contract.methodsObject.main({
      payload: {
        counter: storage.stored_counter.toNumber(),
        action: { operation: lambda }
      },
      sigs: [sig, ...signatures]
    });
    await op.confirmation();
} catch (err) {
    console.error(err);
}
```

If everything works correctly, the counter of the multisig contract should be incremented by 1 and the given amount of tez should be transferred to the provided address.

## Using the `change_keys` entrypoint

Sending a `change_keys` operation is going to be very similar to sending a `transfer` operation, with a little difference in the arguments you provide.

The purpose of the `change_keys` operation is to update the threshold and the keys in the list of participants while asking all the current participants if they approve the update.

First, we want to parse an array of keys into a Michelson value:
```typescript
const listOfKeys = [KEY_1, KEY_2, KEY_3];
const michelineListOfKeys = `{ ${listOfKeys
    .map(key => `"${key}"`)
    .join(" ; ")} }`;
```

Next, we are going to pack the required nested pair in the same way we did earlier while changing some values in the pair:
```typescript
import { TezosToolkit } from "@taquito/taquito";
import { Parser } from "@taquito/michel-codec";

const Tezos = new TezosToolkit(RPC_URL);
const chainId = await Tezos.rpc.getChainId();
const contract = await Tezos.contract.at(MULTISIG_ADDRESS);
const storage: any = await contract.storage();
const counter = storage.stored_counter.toNumber();

const p = new Parser();
const newThreshold = 2;

const michelsonData = `(
    Pair "${chainId}" 
        (
            Pair "${MULTISIG_ADDRESS}" 
            (
                Pair ${counter} 
                    (Right (Pair ${newThreshold} ${michelineListOfKeys}))
            )
        )
)`;
const dataToPack = p.parseMichelineExpression(michelsonData);

const michelsonType = `(pair chain_id (pair address (pair nat (or (lambda unit (list operation)) (pair nat (list key))))))`;
  const typeToPack = p.parseMichelineExpression(michelsonType);

  const { bytes: payload } = packDataBytes(
    dataToPack as any,
    typeToPack as any
  );
```

This creates the Michelson value and its type that will be ultimately packed in order to generate the payload that the other participants must sign.  

Now, the signatures can be collected and a transaction can be sent:
```typescript
const signatures = [SIG_1, SIG_2, SIG_3];
const forgerSig = 
      (await Tezos.signer.sign(payload, new Uint8Array())).prefixSig;

try {
    const contract = await Tezos.contract.at(MULTISIG_ADDRESS);
    const storage: any = await contract.storage();
    const op = await contract.methodsObject.main({
      payload: {
        counter: storage.stored_counter.toNumber(),
        action: {
          change_keys: {
            threshold: newThreshold,
            keys: listOfKeys
          }
      },
      sigs: [forgerSig, ...signatures]
    });
    await op.confirmation();
} catch (err) {
    console.error(err);
}
```
After confirmation, the threshold and the list of keys in the contract will be updated accordingly.

## More about the `transfer` entrypoint
Although called `transfer`, this entrypoint actually has a more general purpose, i.e. the execution of a Michelson lambda approved by the required minimum number of participants in the multisig (the `threshold` value in the storage).

As an example, let's check how the exchange of 50 XTZ to tzBTC through the Liquidity Baking contract would work.

The first step is to write the Michelson lambda:
```typescript
const minTokensBought = 360000; // Should be calculated before every transaction
const lambda = `{ 
    /* checks that the contract has enough balance */
    PUSH mutez 50000000 ;
    BALANCE ;
    COMPARE ;
    GE ;
    IF
        {
            /* prepares payload for transaction */
            NOW ;
            PUSH int 600 ;
            ADD @timestamp ;
            PUSH @minTokensBought nat ${minTokensBought} ;
            PAIR ;
            SELF_ADDRESS @to ;
            PAIR @xtzToToken ;
            /* creates contract parameter */
            PUSH address "KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5" ;
            CONTRACT %xtzToToken (pair (address %to) (pair (nat %minTokensBought) (timestamp %deadline))) ;
            IF_NONE
                {
                    PUSH string "UNKNOWN_TARGET_CONTRACT" ;
                    FAILWITH ;
                }
                {
                    SWAP ;
                    PUSH mutez 50000000;
                    SWAP ;
                    TRANSFER_TOKENS ;
                    NIL operation ;
                    SWAP ;
                    CONS ;
                } ;
        }
        {
            /* insufficient contract balance */
            PUSH string "INSUFFICIENT_BALANCE" ;
            FAILWITH ;
        } ;
}`;
```
The lambda here is going to prepare an operation to the liquidity baking DEX (also called "SIRIUS DEX"), the only value that you have to calculate beforehand is the minimum amount of tzBTC expected to be received in exchange for 50 XTZ:

```typescript
const tokenOut_ = new BigNumber(tokenOut).times(new BigNumber(1000));
const allowedSlippage_ = new BigNumber(
Math.floor(allowedSlippage * 1000 * 100)
);
const result = tokenOut_
.minus(
  tokenOut_.times(allowedSlippage_).dividedBy(new BigNumber(100000))
)
.dividedBy(1000);
return BigNumber.maximum(result, new BigNumber(1));

const minTokensBought = (({
    xtzIn,
    xtzPool,
    tokenPool,
    feePercent,
    burnPercent
}: {
    xtzIn: number,
    xtzPool: number,
    tokenPool: number,
    feePercent?: number,
    burnPercent?: number
  }) => {
    xtzPool = xtzPool + 2_500_000;
    
    const fee = feePercent ? 1000 - Math.floor(feePercent * 10) : 1000;
    const burn = burnPercent ? 1000 - Math.floor(burnPercent * 10) : 1000;
    const feeMultiplier = fee * burn;
    
    if(xtzPool > 0 && tokenPool > 0 && xtzIn > 0) {
        const numerator = xtzIn * tokenPool * feeMultiplier;
        const denominator = (xtzPool * 1_000_000) + (xtzIn * feeMultiplier);
          return numerator / denominator;
    } else {
        return null;
    }
})()
```

From this point forwards, you can repeat the same steps as in the `Using the transfer entrypoint` above to pack the data, get the signatures and send it to the DEX.