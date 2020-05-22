---
title: Originating Contracts
author: Simon Boissonneault-Robert
---

Taquito can be used to _originate_ smart contracts on to the Tezos blockchain.

## Example demonstrating origination of a Multi sig contract

In this example we will originate the popular mutli-sig contract that is available here:

https://github.com/murbard/smart-contracts/blob/master/multisig/michelson/generic.tz

> Note! Due to a temporary limitation of Taquito we do not fully support raw michelson and need an external step to convert it to JSON. See https://github.com/ecadlabs/taquito/issues/100

### Convert the generic.tz contract to JSON

We can use the tezos-client to convert our michelson to the its JSON representation using the following command. This command relies on two files `generic.tz` and `init.tz` that must be present in your current working directory. Download the `generic.tz` from the above link, and see below for the contents of `init.tz`

```sh
tezos-client originate contract generic-multisig transferring 1 from \
   account1 running "$(cat ./generic.tz)" --init "$(cat ./init.tz)" \
   --dry-run --verbose-signing --burn-cap 2`
```

Example of init.tz

```michelson
 Pair 0 (Pair 1 {"edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t"})
```

The output of the command should look something like this;

```txt
Waiting for the node to be bootstrapped before injection...
Current head: BLbR9F8P1uPp (timestamp: 2019-12-05T13:35:04-00:00, validation: 2019-12-05T13:36:24-00:00)
Node is bootstrapped, ready for injecting operations.
Estimated gas: 32518 units (will add 100 for safety)
Estimated storage: 1213 bytes added (will add 20 for safety)
Pre-signature information (verbose signing):
    * Branch: BLbR9F8P1uPpUyoKHA79M15AzeEWnJWApmr61vRGPku3BY8bi4E
    * Watermark: `Generic-operation` (0x03)
    * Operation bytes: {...}
    * Blake 2B Hash (raw): DAWCcNTfcQQ3bn1HbWj3gLT6A3wmJFLTCGrBqKaYZxLt
    * Blake 2B Hash (ledger-style, with operation watermark):
    9GFhQdGYig9bof5CBBRJdgjKimSJKVrtAKeCg6ioFHxo
    * JSON encoding:
        { "branch": "BLbR9F8P1uPpUyoKHA79M15AzeEWnJWApmr61vRGPku3BY8bi4E",
          "contents":
            [ { "kind": "origination",
                "source": "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn", "fee": "4471",
                "counter": "25184", "gas_limit": "32618",
                "storage_limit": "1233", "balance": "1000000",
                "script":
                  { "code":
                      [ { "prim": "parameter",
                          "args":
                            [ { "prim": "or",
                                "args":
                                  [ { "prim": "unit", "annots": [ "%default" ] },
                                    { "prim": "pair",
                                      "args":
                                        [ { "prim": "pair",
                                            "args":
                                              [ { "prim": "nat",
                                                  "annots": [ "%counter" ] },
                                                { "prim": "or",
                                                  "args":
                                                    [ { "prim": "lambda",
                                                        "args":
                                                          [ { "prim": "unit" },
                                                            { "prim": "list",
                                                              "args":
                                                                [ { "prim":
                                                                      "operation" } ] } ],
                                                        "annots":
                                                          [ "%operation" ] },
                                                      { "prim": "pair",
                                                        "args":
                                                          [ { "prim": "nat",
                                                              "annots":
                                                                [ "%threshold" ] },
                                                            { "prim": "list",
                                                              "args":
                                                                [ { "prim": "key" } ],
                                                              "annots":
                                                                [ "%keys" ] } ],
                                                        "annots":
                                                          [ "%change_keys" ] } ],
                                                  "annots": [ ":action" ] } ],
                                            "annots": [ ":payload" ] },
                                          { "prim": "list",
                                            "args":
                                              [ { "prim": "option",
                                                  "args":
                                                    [ { "prim": "signature" } ] } ],
                                            "annots": [ "%sigs" ] } ],
                                      "annots": [ "%main" ] } ] } ] },
                        { "prim": "storage",
                          "args":
                            [ { "prim": "pair",
                                "args":
                                  [ { "prim": "nat",
                                      "annots": [ "%stored_counter" ] },
                                    { "prim": "pair",
                                      "args":
                                        [ { "prim": "nat",
                                            "annots": [ "%threshold" ] },
                                          { "prim": "list",
                                            "args": [ { "prim": "key" } ],
                                            "annots": [ "%keys" ] } ] } ] } ] },
                        { "prim": "code",
                          "args":
                            [ [ [ [ { "prim": "DUP" }, { "prim": "CAR" },
                                    { "prim": "DIP",
                                      "args": [ [ { "prim": "CDR" } ] ] } ] ],
                                { "prim": "IF_LEFT",
                                  "args":
                                    [ [ { "prim": "DROP" },
                                        { "prim": "NIL",
                                          "args": [ { "prim": "operation" } ] },
                                        { "prim": "PAIR" } ],
                                      [ { "prim": "PUSH",
                                          "args":
                                            [ { "prim": "mutez" },
                                              { "int": "0" } ] },
                                        { "prim": "AMOUNT" },
                                        [ [ { "prim": "COMPARE" },
                                            { "prim": "EQ" } ],
                                          { "prim": "IF",
                                            "args":
                                              [ [],
                                                [ [ { "prim": "UNIT" },
                                                    { "prim": "FAILWITH" } ] ] ] } ],
                                        { "prim": "SWAP" }, { "prim": "DUP" },
                                        { "prim": "DIP",
                                          "args": [ [ { "prim": "SWAP" } ] ] },
                                        { "prim": "DIP",
                                          "args":
                                            [ [ [ [ { "prim": "DUP" },
                                                    { "prim": "CAR" },
                                                    { "prim": "DIP",
                                                      "args":
                                                        [ [ { "prim": "CDR" } ] ] } ] ],
                                                { "prim": "DUP" },
                                                { "prim": "SELF" },
                                                { "prim": "ADDRESS" },
                                                { "prim": "PAIR" },
                                                { "prim": "PACK" },
                                                { "prim": "DIP",
                                                  "args":
                                                    [ [ [ [ { "prim": "DUP" },
                                                            { "prim": "CAR",
                                                              "annots":
                                                                [ "@counter" ] },
                                                            { "prim": "DIP",
                                                              "args":
                                                                [ [ { "prim":
                                                                        "CDR" } ] ] } ] ],
                                                        { "prim": "DIP",
                                                          "args":
                                                            [ [ { "prim": "SWAP" } ] ] } ] ] },
                                                { "prim": "SWAP" } ] ] },
                                        [ [ { "prim": "DUP" },
                                            { "prim": "CAR",
                                              "annots": [ "@stored_counter" ] },
                                            { "prim": "DIP",
                                              "args": [ [ { "prim": "CDR" } ] ] } ] ],
                                        { "prim": "DIP",
                                          "args": [ [ { "prim": "SWAP" } ] ] },
                                        [ [ { "prim": "COMPARE" },
                                            { "prim": "EQ" } ],
                                          { "prim": "IF",
                                            "args":
                                              [ [],
                                                [ [ { "prim": "UNIT" },
                                                    { "prim": "FAILWITH" } ] ] ] } ],
                                        { "prim": "DIP",
                                          "args": [ [ { "prim": "SWAP" } ] ] },
                                        [ [ { "prim": "DUP" },
                                            { "prim": "CAR",
                                              "annots": [ "@threshold" ] },
                                            { "prim": "DIP",
                                              "args":
                                                [ [ { "prim": "CDR",
                                                      "annots": [ "@keys" ] } ] ] } ] ],
                                        { "prim": "DIP",
                                          "args":
                                            [ [ { "prim": "PUSH",
                                                  "args":
                                                    [ { "prim": "nat" },
                                                      { "int": "0" } ],
                                                  "annots": [ "@valid" ] },
                                                { "prim": "SWAP" },
                                                { "prim": "ITER",
                                                  "args":
                                                    [ [ { "prim": "DIP",
                                                          "args":
                                                            [ [ { "prim": "SWAP" } ] ] },
                                                        { "prim": "SWAP" },
                                                        { "prim": "IF_CONS",
                                                          "args":
                                                            [ [ [ { "prim":
                                                                      "IF_NONE",
                                                                    "args":
                                                                      [ [ { "prim":
                                                                        "SWAP" },
                                                                        { "prim":
                                                                        "DROP" } ],
                                                                        [ { "prim":
                                                                        "SWAP" },
                                                                        { "prim":
                                                                        "DIP",
                                                                        "args":
                                                                        [ [ { "prim":
                                                                        "SWAP" },
                                                                        { "prim":
                                                                        "DIP",
                                                                        "args":
                                                                        [ { "int":
                                                                        "2" },
                                                                        [ [ { "prim":
                                                                        "DIP",
                                                                        "args":
                                                                        [ [ { "prim":
                                                                        "DUP" } ] ] },
                                                                        { "prim":
                                                                        "SWAP" } ] ] ] },
                                                                        [ [ { "prim":
                                                                        "DIP",
                                                                        "args":
                                                                        [ { "int":
                                                                        "2" },
                                                                        [ { "prim":
                                                                        "DUP" } ] ] },
                                                                        { "prim":
                                                                        "DIG",
                                                                        "args":
                                                                        [ { "int":
                                                                        "3" } ] } ],
                                                                        { "prim":
                                                                        "DIP",
                                                                        "args":
                                                                        [ [ { "prim":
                                                                        "CHECK_SIGNATURE" } ] ] },
                                                                        { "prim":
                                                                        "SWAP" },
                                                                        { "prim":
                                                                        "IF",
                                                                        "args":
                                                                        [ [ { "prim":
                                                                        "DROP" } ],
                                                                        [ { "prim":
                                                                        "FAILWITH" } ] ] } ],
                                                                        { "prim":
                                                                        "PUSH",
                                                                        "args":
                                                                        [ { "prim":
                                                                        "nat" },
                                                                        { "int":
                                                                        "1" } ] },
                                                                        { "prim":
                                                                        "ADD",
                                                                        "annots":
                                                                        [ "@valid" ] } ] ] } ] ] } ] ],
                                                              [ [ { "prim":
                                                                      "UNIT" },
                                                                  { "prim":
                                                                      "FAILWITH" } ] ] ] },
                                                        { "prim": "SWAP" } ] ] } ] ] },
                                        [ [ { "prim": "COMPARE" },
                                            { "prim": "LE" } ],
                                          { "prim": "IF",
                                            "args":
                                              [ [],
                                                [ [ { "prim": "UNIT" },
                                                    { "prim": "FAILWITH" } ] ] ] } ],
                                        { "prim": "IF_CONS",
                                          "args":
                                            [ [ [ { "prim": "UNIT" },
                                                  { "prim": "FAILWITH" } ] ],
                                              [] ] }, { "prim": "DROP" },
                                        { "prim": "DIP",
                                          "args":
                                            [ [ [ [ { "prim": "DUP" },
                                                    { "prim": "CAR" },
                                                    { "prim": "DIP",
                                                      "args":
                                                        [ [ { "prim": "CDR" } ] ] } ] ],
                                                { "prim": "PUSH",
                                                  "args":
                                                    [ { "prim": "nat" },
                                                      { "int": "1" } ] },
                                                { "prim": "ADD",
                                                  "annots": [ "@new_counter" ] },
                                                { "prim": "PAIR" } ] ] },
                                        { "prim": "IF_LEFT",
                                          "args":
                                            [ [ { "prim": "UNIT" },
                                                { "prim": "EXEC" } ],
                                              [ { "prim": "DIP",
                                                  "args":
                                                    [ [ { "prim": "CAR" } ] ] },
                                                { "prim": "SWAP" },
                                                { "prim": "PAIR" },
                                                { "prim": "NIL",
                                                  "args":
                                                    [ { "prim": "operation" } ] } ] ] },
                                        { "prim": "PAIR" } ] ] } ] ] } ],
                    "storage":
                      { "prim": "Pair",
                        "args":
                          [ { "int": "0" },
                            { "prim": "Pair",
                              "args":
                                [ { "int": "1" },
                                  [ { "string":
                                        "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t" } ] ] } ] } } } ] }
  Operation: ...
  Operation hash is 'onxq1z9wN753NSwanK2D41kifFUbU54vWu4aiQLH2gvTSRBEdrJ'
  Simulation result:
  Manager signed operations:
    From: tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn
    Fee to the baker: ꜩ0.004471
    Expected counter: 25184
    Gas limit: 32618
    Storage limit: 1233 bytes
    Balance updates:
      tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn ............ -ꜩ0.004471
      fees(tz1Ke2h7sDdakHJQh8WX4Z372du1KChsksyU,58) ... +ꜩ0.004471
    Origination:
      From: tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn
      Credit: ꜩ1
      Script:
        { parameter
            (or (unit %default)
                (pair %main
                   (pair :payload
                      (nat %counter)
                      (or :action
                         (lambda %operation unit (list operation))
                         (pair %change_keys (nat %threshold) (list %keys key))))
                   (list %sigs (option signature)))) ;
          storage (pair (nat %stored_counter) (pair (nat %threshold) (list %keys key))) ;
          code { UNPAIR ;
                 IF_LEFT
                   { DROP ; NIL operation ; PAIR }
                   { PUSH mutez 0 ;
                     AMOUNT ;
                     ASSERT_CMPEQ ;
                     SWAP ;
                     DUP ;
                     DIP { SWAP } ;
                     DIP { UNPAIR ;
                           DUP ;
                           SELF ;
                           ADDRESS ;
                           PAIR ;
                           PACK ;
                           DIP { { { DUP ; CAR @counter ; DIP { CDR } } } ; DIP { SWAP } } ;
                           SWAP } ;
                     { { DUP ; CAR @stored_counter ; DIP { CDR } } } ;
                     DIP { SWAP } ;
                     ASSERT_CMPEQ ;
                     DIP { SWAP } ;
                     { { DUP ; CAR @threshold ; DIP { CDR @keys } } } ;
                     DIP { PUSH @valid nat 0 ;
                           SWAP ;
                           ITER { DIP { SWAP } ;
                                  SWAP ;
                                  IF_CONS
                                    { IF_SOME
                                        { SWAP ;
                                          DIP { SWAP ;
                                                DIP 2 { DUP 2 } ;
                                                { DUP 3 ;
                                                  DIP { CHECK_SIGNATURE } ;
                                                  SWAP ;
                                                  IF { DROP } { FAILWITH } } ;
                                                PUSH nat 1 ;
                                                ADD @valid } }
                                        { SWAP ; DROP } }
                                    { FAIL } ;
                                  SWAP } } ;
                     ASSERT_CMPLE ;
                     IF_CONS { FAIL } {} ;
                     DROP ;
                     DIP { UNPAIR ; PUSH nat 1 ; ADD @new_counter ; PAIR } ;
                     IF_LEFT { UNIT ; EXEC } { DIP { CAR } ; SWAP ; PAIR ; NIL operation } ;
                     PAIR } } }
        Initial storage:
          (Pair 0 (Pair 1 { "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t" }))
        No delegate for this contract
        This origination was successfully applied
        Originated contracts:
          KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D
        Storage size: 956 bytes
        Paid storage size diff: 956 bytes
        Consumed gas: 32518
        Balance updates:
          tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn ... -ꜩ0.956
          tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn ... -ꜩ0.257
          tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn ... -ꜩ1
          KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D ... +ꜩ1
```

From the output generated by `tezos-client` command, you need to copy the michelson (represented in JSON form) that appears under the `code:` json property.

You need to take this JSON and put it in a file named `generic.json`. We will then read the `generic.json` file in the following Taquito example.

Here's the same json from above, but copied to stand on its own.

```json

[ { "prim": "parameter",
    "args":
      [ { "prim": "or",
          "args":
            [ { "prim": "unit", "annots": [ "%default" ] },
              { "prim": "pair",
                "args":
                  [ { "prim": "pair",
                      "args":
                        [ { "prim": "nat",
                            "annots": [ "%counter" ] },
                          { "prim": "or",
                            "args":
                              [ { "prim": "lambda",
                                  "args":
                                    [ { "prim": "unit" },
                                      { "prim": "list",
                                        "args":
                                          [ { "prim":
                                                "operation" } ] } ],
                                  "annots":
                                    [ "%operation" ] },
                                { "prim": "pair",
                                  "args":
                                    [ { "prim": "nat",
                                        "annots":
                                          [ "%threshold" ] },
                                      { "prim": "list",
                                        "args":
                                          [ { "prim": "key" } ],
                                        "annots":
                                          [ "%keys" ] } ],
                                  "annots":
                                    [ "%change_keys" ] } ],
                            "annots": [ ":action" ] } ],
                      "annots": [ ":payload" ] },
                    { "prim": "list",
                      "args":
                        [ { "prim": "option",
                            "args":
                              [ { "prim": "signature" } ] } ],
                      "annots": [ "%sigs" ] } ],
                "annots": [ "%main" ] } ] } ] },
  { "prim": "storage",
    "args":
      [ { "prim": "pair",
          "args":
            [ { "prim": "nat",
                "annots": [ "%stored_counter" ] },
              { "prim": "pair",
                "args":
                  [ { "prim": "nat",
                      "annots": [ "%threshold" ] },
                    { "prim": "list",
                      "args": [ { "prim": "key" } ],
                      "annots": [ "%keys" ] } ] } ] } ] },
  { "prim": "code",
    "args":
      [ [ [ [ { "prim": "DUP" }, { "prim": "CAR" },
              { "prim": "DIP",
                "args": [ [ { "prim": "CDR" } ] ] } ] ],
          { "prim": "IF_LEFT",
            "args":
              [ [ { "prim": "DROP" },
                  { "prim": "NIL",
                    "args": [ { "prim": "operation" } ] },
                  { "prim": "PAIR" } ],
                [ { "prim": "PUSH",
                    "args":
                      [ { "prim": "mutez" },
                        { "int": "0" } ] },
                  { "prim": "AMOUNT" },
                  [ [ { "prim": "COMPARE" },
                      { "prim": "EQ" } ],
                    { "prim": "IF",
                      "args":
                        [ [],
                          [ [ { "prim": "UNIT" },
                              { "prim": "FAILWITH" } ] ] ] } ],
                  { "prim": "SWAP" }, { "prim": "DUP" },
                  { "prim": "DIP",
                    "args": [ [ { "prim": "SWAP" } ] ] },
                  { "prim": "DIP",
                    "args":
                      [ [ [ [ { "prim": "DUP" },
                              { "prim": "CAR" },
                              { "prim": "DIP",
                                "args":
                                  [ [ { "prim": "CDR" } ] ] } ] ],
                          { "prim": "DUP" },
                          { "prim": "SELF" },
                          { "prim": "ADDRESS" },
                          { "prim": "PAIR" },
                          { "prim": "PACK" },
                          { "prim": "DIP",
                            "args":
                              [ [ [ [ { "prim": "DUP" },
                                      { "prim": "CAR",
                                        "annots":
                                          [ "@counter" ] },
                                      { "prim": "DIP",
                                        "args":
                                          [ [ { "prim":
                                                  "CDR" } ] ] } ] ],
                                  { "prim": "DIP",
                                    "args":
                                      [ [ { "prim": "SWAP" } ] ] } ] ] },
                          { "prim": "SWAP" } ] ] },
                  [ [ { "prim": "DUP" },
                      { "prim": "CAR",
                        "annots": [ "@stored_counter" ] },
                      { "prim": "DIP",
                        "args": [ [ { "prim": "CDR" } ] ] } ] ],
                  { "prim": "DIP",
                    "args": [ [ { "prim": "SWAP" } ] ] },
                  [ [ { "prim": "COMPARE" },
                      { "prim": "EQ" } ],
                    { "prim": "IF",
                      "args":
                        [ [],
                          [ [ { "prim": "UNIT" },
                              { "prim": "FAILWITH" } ] ] ] } ],
                  { "prim": "DIP",
                    "args": [ [ { "prim": "SWAP" } ] ] },
                  [ [ { "prim": "DUP" },
                      { "prim": "CAR",
                        "annots": [ "@threshold" ] },
                      { "prim": "DIP",
                        "args":
                          [ [ { "prim": "CDR",
                                "annots": [ "@keys" ] } ] ] } ] ],
                  { "prim": "DIP",
                    "args":
                      [ [ { "prim": "PUSH",
                            "args":
                              [ { "prim": "nat" },
                                { "int": "0" } ],
                            "annots": [ "@valid" ] },
                          { "prim": "SWAP" },
                          { "prim": "ITER",
                            "args":
                              [ [ { "prim": "DIP",
                                    "args":
                                      [ [ { "prim": "SWAP" } ] ] },
                                  { "prim": "SWAP" },
                                  { "prim": "IF_CONS",
                                    "args":
                                      [ [ [ { "prim":
                                                "IF_NONE",
                                              "args":
                                                [ [ { "prim":
                                                  "SWAP" },
                                                  { "prim":
                                                  "DROP" } ],
                                                  [ { "prim":
                                                  "SWAP" },
                                                  { "prim":
                                                  "DIP",
                                                  "args":
                                                  [ [ { "prim":
                                                  "SWAP" },
                                                  { "prim":
                                                  "DIP",
                                                  "args":
                                                  [ { "int":
                                                  "2" },
                                                  [ [ { "prim":
                                                  "DIP",
                                                  "args":
                                                  [ [ { "prim":
                                                  "DUP" } ] ] },
                                                  { "prim":
                                                  "SWAP" } ] ] ] },
                                                  [ [ { "prim":
                                                  "DIP",
                                                  "args":
                                                  [ { "int":
                                                  "2" },
                                                  [ { "prim":
                                                  "DUP" } ] ] },
                                                  { "prim":
                                                  "DIG",
                                                  "args":
                                                  [ { "int":
                                                  "3" } ] } ],
                                                  { "prim":
                                                  "DIP",
                                                  "args":
                                                  [ [ { "prim":
                                                  "CHECK_SIGNATURE" } ] ] },
                                                  { "prim":
                                                  "SWAP" },
                                                  { "prim":
                                                  "IF",
                                                  "args":
                                                  [ [ { "prim":
                                                  "DROP" } ],
                                                  [ { "prim":
                                                  "FAILWITH" } ] ] } ],
                                                  { "prim":
                                                  "PUSH",
                                                  "args":
                                                  [ { "prim":
                                                  "nat" },
                                                  { "int":
                                                  "1" } ] },
                                                  { "prim":
                                                  "ADD",
                                                  "annots":
                                                  [ "@valid" ] } ] ] } ] ] } ] ],
                                        [ [ { "prim":
                                                "UNIT" },
                                            { "prim":
                                                "FAILWITH" } ] ] ] },
                                  { "prim": "SWAP" } ] ] } ] ] },
                  [ [ { "prim": "COMPARE" },
                      { "prim": "LE" } ],
                    { "prim": "IF",
                      "args":
                        [ [],
                          [ [ { "prim": "UNIT" },
                              { "prim": "FAILWITH" } ] ] ] } ],
                  { "prim": "IF_CONS",
                    "args":
                      [ [ [ { "prim": "UNIT" },
                            { "prim": "FAILWITH" } ] ],
                        [] ] }, { "prim": "DROP" },
                  { "prim": "DIP",
                    "args":
                      [ [ [ [ { "prim": "DUP" },
                              { "prim": "CAR" },
                              { "prim": "DIP",
                                "args":
                                  [ [ { "prim": "CDR" } ] ] } ] ],
                          { "prim": "PUSH",
                            "args":
                              [ { "prim": "nat" },
                                { "int": "1" } ] },
                          { "prim": "ADD",
                            "annots": [ "@new_counter" ] },
                          { "prim": "PAIR" } ] ] },
                  { "prim": "IF_LEFT",
                    "args":
                      [ [ { "prim": "UNIT" },
                          { "prim": "EXEC" } ],
                        [ { "prim": "DIP",
                            "args":
                              [ [ { "prim": "CAR" } ] ] },
                          { "prim": "SWAP" },
                          { "prim": "PAIR" },
                          { "prim": "NIL",
                            "args":
                              [ { "prim": "operation" } ] } ] ] },
                  { "prim": "PAIR" } ] ] } ] ] } ]
```

## Originate the contract using Taquito

> Note: This requires a signer to be configured, ie: `Tezos.importKey("p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1")`

Here are two examples of the origination of the contract from Taquito. The first example initializes the contracts storage using a familiar looking javascript object. The second demonstrates the use of michelson in JSON representation. The first method is preferred, but if you have a reason to circumvent the convenient storage API you can do so (please report bugs with examples!)

### a. Using the storage encoder feature

```js
// generic.json is referring to the JSON array that we extracted from the `tezos-cli` output earlier
// The same type output may have been generated by a compiler such as ligo (see ligos output
// options).
const genericMultisigJSON = require('./generic.json')

const originationOp = await Tezos.contract.originate({
  code: genericMultisigJSON,
  storage: {
    stored_counter: 0,
    threshold: 1,
    keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
  }
})

const contract = await originationOp.contract()
console.log(contract.address)
```

### b. Using the JSON storage

```js
// generic.json is referring to the JSON array that we extracted from the `tezos-cli` output earlier
// The same type output may have been generated by a compiler such as ligo (see ligos output
// options).
const genericMultisigJSON = require('./generic.json')

const originationOp = await Tezos.contract.originate({
  code: genericMultisigJSON,
  init: { "prim": "Pair",
                        "args":
                          [ { "int": "0" },
                            { "prim": "Pair",
                              "args":
                                [ { "int": "1" },
                                  [ { "string":
                                        "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t" } ] ] } ] }
})

const contract = await originationOp.contract()
console.log(contract.address)
```
