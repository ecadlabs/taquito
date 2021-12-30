---
title: Tickets
id: tickets
author: Claude Barde
---

## Using tickets with Taquito

### What is a ticket?

Tickets are a new feature introduced to the Tezos blockchain with the Edo upgrade. Tickets are fungible tokens represented by 3 values:
- The address of the contract that created the ticket
- A value of a comparable type
- An amount of type `nat`

Tickets open a wide range of permission use cases where they can be used to allow access to certain functionalities of a smart contract to one or multiple users. The goal of tickets explains 2 of their main characteristics: they can only be created on-chain and they cannot be duplicated. 

In this regard, the only interaction available to Taquito with tickets is reading them. This can be particularly useful to inform users if they have access to the functionality of a contract before they send a transaction to a forbidden entrypoint.

### How to read a ticket with Taquito?

Although tickets can be stored in any part of the storage of a contract, it is more common to see them in complex types like a pair or a map/big map. Taquito treats tickets like any other value fetched from a contract and they are available in JavaScript/TypeScript as an object with 3 properties:  
`{ ticketer: string; value: any; amount: BigNumber }`

- The `ticketer` property is a string representing the address of the contract that issued the ticket. As tickets can only be joined if they have the same ticketer and value, this is the guarantee that the ticket hasn't been tampered with.

- The `value` property holds a value of a comparable type. It is of type `any` in Taquito as the value can be of different TypeScript types according to its Michelson type.

- The `amount` property is a non-negative `BigNumber` in Taquito and it's the only property of a ticket likely to change after the ticket creation.

### Examples of values returned when reading a ticket with Taquito

|| Ticket in Michelson | Ticket with Taquito |
|----------------|---------------------|---------------------|
| Value type:<br />int | (pair address (pair int nat))<br />(Pair **"KT1ABC..."** (Pair **123** **5**))| { ticketer: **"KT1ABC..."**,<br /> value: **BigNumber(123)**,<br /> amount: **BigNumber(5)** }|
| Value type:<br />string | (pair address (pair string nat))<br />(Pair **"KT1ABC..."** (Pair **"Taquito"** **5**))| { ticketer: **"KT1ABC..."**,<br /> value: **"Taquito"**,<br /> amount: **BigNumber(5)** }|
| Value type:<br />bool | (pair address (pair bool nat))<br />(Pair **"KT1ABC..."** (Pair **True** **5**))| { ticketer: **"KT1ABC..."**,<br /> value: **true**,<br /> amount: **BigNumber(5)** }|
| Value type:<br />bytes | (pair address (pair bytes nat))<br />(Pair **"KT1ABC..."** (Pair **"0xCAFE"** **5**))| { ticketer: **"KT1ABC..."**,<br /> value: **"CAFE"**,<br /> amount: **BigNumber(5)** }|
| Value type:<br /> option | (pair address (pair (option string) nat))<br />(Pair **"KT1ABC..."** (Pair **(Some "Tezos")** **5**))| { ticketer: **"KT1ABC..."**,<br /> value: **"Tezos"**,<br /> amount: **BigNumber(5)** }|
| Value type:<br /> option | (pair address (pair (option string) nat))<br />(Pair **"KT1ABC..."** (Pair **None** **5**))| { ticketer: **"KT1ABC..."**,<br /> value: **null**,<br /> amount: **BigNumber(5)** }|
| Value type: <br />pair int string | (pair address (pair (pair int string) nat))<br />(Pair **"KT1ABC..."** (Pair **(Pair 7 "Tacos")** **5**))| { ticketer: **"KT1ABC..."**,<br /> value: **{ 0: BigNumber(7), 1: "Tacos" }**,<br /> amount: **BigNumber(5)** }|
