/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the Apache 2.0 License found in the
 * LICENSE file in the root directory of this source tree.
 */
import classnames from 'classnames';
import Clipboard from 'clipboard';
import React, { useEffect, useRef, useState } from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

import styles from './styles.module.css';

class SemiLiveProvider extends LiveProvider {
  constructor() {
    super();

    this.onChange = code => {
      // Override to prevent LiveProvider transpiling code on every change but
      // keep the code. We will need it later.
      this.code = code;
    }
  }

  UNSAFE_componentWillMount() {
    // Override to prevent LiveProvider transpiling code on mount but
    // keep the code. We will need it later.
    this.code = this.props.code;
  }

  componentDidUpdate() {
    // Override to prevent LiveProvider transpiling code on update but
    // keep the code. We will need it later.
  }

  run() {
    const { scope, transformCode, noInline } = this.props;

    const template = () => {
      if (this.props.wallet) {
        return `
        wallet.requestPermissions()
        .then(permission => {
          return Tezos.setWalletProvider(wallet);
        })
        .then(() => {
          ${this.code}
        });`
      } else if (this.props.noConfig) {
        return this.code
      } else {
        return `fetch('https://keygen.ecadinfra.com/ghostnet', {
          method: 'POST',
          headers: { Authorization: 'Bearer taquito-example' },
        })
        .then(response => response.text())
        .then(privateKey => {
          return importKey(Tezos, privateKey);
         })
        .then(() => {
          ${this.code}
         });`
      }
    }

    // The following piece of code provides additional functionality to the user code such as console.log and key import
    const code = `

let console = {log: value => render("" + value  + "\\n")};

// Needed for the wallet connect 2 live code example
// https://cloud.walletconnect.com/sign-in
const MY_PROJECT_ID = 'ba97fd7d1e89eae02f7c330e14ce1f36'

${template()}

//contract used in example "estimate a contract origination"
const genericMultisigJSONfile =
[ { "prim": "parameter","args":[ { "prim": "or","args":[ { "prim": "unit", "annots": [ "%default" ] },{ "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "nat","annots": [ "%counter" ] },{ "prim": "or","args":[ { "prim": "lambda","args":[ { "prim": "unit" },{ "prim": "list","args":[ { "prim":"operation" } ] } ],"annots":[ "%operation" ] },{ "prim": "pair", "args":[ { "prim": "nat","annots":[ "%threshold" ] },{ "prim": "list",
"args":[ { "prim": "key" } ],"annots":[ "%keys" ] } ],"annots":[ "%change_keys" ] } ],"annots": [ ":action" ] } ],"annots": [ ":payload" ] },{ "prim": "list","args":[ { "prim": "option","args":[ { "prim": "signature" } ] } ],"annots": [ "%sigs" ] } ],"annots": [ "%main" ] } ] } ] },
{ "prim": "storage","args":[ { "prim": "pair","args":[ { "prim": "nat","annots": [ "%stored_counter" ] },{ "prim": "pair","args":[ { "prim": "nat", "annots": [ "%threshold" ] },{ "prim": "list","args": [ { "prim": "key" } ],"annots": [ "%keys" ] } ] } ] } ] },
{ "prim": "code","args":[ [ [ [ { "prim": "DUP" }, { "prim": "CAR" },{ "prim": "DIP","args": [ [ { "prim": "CDR" } ] ] } ] ],{ "prim": "IF_LEFT","args":[ [ { "prim": "DROP" },{ "prim": "NIL","args": [ { "prim": "operation" } ] },{ "prim": "PAIR" } ],[ { "prim": "PUSH","args":[ { "prim": "mutez" },{ "int": "0" } ] },{ "prim": "AMOUNT" },[ [ { "prim": "COMPARE" },{ "prim": "EQ" } ], { "prim": "IF","args":[ [],[ [ { "prim": "UNIT" },{ "prim": "FAILWITH" } ] ] ] } ],{ "prim": "SWAP" },
{ "prim": "DUP" },{ "prim": "DIP","args": [ [ { "prim": "SWAP" } ] ] },{ "prim": "DIP","args":[ [ [ [ { "prim": "DUP" },{ "prim": "CAR" },{ "prim": "DIP","args":[ [ { "prim": "CDR" } ] ] } ] ],{ "prim": "DUP" },{ "prim": "SELF" },{ "prim": "ADDRESS" },{ "prim": "PAIR" },{ "prim": "PACK" },{ "prim": "DIP","args":[ [ [ [ { "prim": "DUP" },{ "prim": "CAR","annots":[ "@counter" ] },{ "prim": "DIP","args":[ [ { "prim":"CDR" } ] ] } ] ],{ "prim": "DIP","args":[ [ { "prim": "SWAP" } ] ] } ] ] },{ "prim": "SWAP" } ] ] },
[ [ { "prim": "DUP" },{ "prim": "CAR","annots": [ "@stored_counter" ] },{ "prim": "DIP","args": [ [ { "prim": "CDR" } ] ] } ] ],{ "prim": "DIP","args": [ [ { "prim": "SWAP" } ] ] },[ [ { "prim": "COMPARE" },{ "prim": "EQ" } ],{ "prim": "IF","args":[ [],[ [ { "prim": "UNIT" },{ "prim": "FAILWITH" } ] ] ] } ],{ "prim": "DIP","args": [ [ { "prim": "SWAP" } ] ] },[ [ { "prim": "DUP" },{ "prim": "CAR","annots": [ "@threshold" ] },{ "prim": "DIP","args":[ [ { "prim": "CDR","annots": [ "@keys" ] } ] ] } ] ],
{ "prim": "DIP","args":[ [ { "prim": "PUSH","args":[ { "prim": "nat" },{ "int": "0" } ],"annots": [ "@valid" ] },{ "prim": "SWAP" },{ "prim": "ITER","args":[ [ { "prim": "DIP","args":[ [ { "prim": "SWAP" } ] ] },{ "prim": "SWAP" },{ "prim": "IF_CONS","args":[ [ [ { "prim":"IF_NONE","args":[ [ { "prim":"SWAP" },{ "prim":"DROP" } ],[ { "prim":"SWAP" },{ "prim":"DIP","args":[ [ { "prim":"SWAP" },{ "prim":"DIP","args":[ { "int":"2" },[ [ { "prim":"DIP","args":[ [ { "prim":"DUP" } ] ] },{ "prim":"SWAP" } ] ] ] },
[ [ { "prim":"DIP","args":[ { "int":"2" },[ { "prim":"DUP" } ] ] },{ "prim":"DIG","args":[ { "int":"3" } ] } ],{ "prim":"DIP","args":[ [ { "prim":"CHECK_SIGNATURE" } ] ] },{ "prim":"SWAP" },{ "prim":"IF","args":[ [ { "prim":"DROP" } ],[ { "prim":"FAILWITH" } ] ] } ],{ "prim":"PUSH","args":[ { "prim":"nat" },{ "int":"1" } ] },{ "prim":"ADD","annots":[ "@valid" ] } ] ] } ] ] } ] ],[ [ { "prim":"UNIT" },{ "prim":"FAILWITH" } ] ] ] },{ "prim": "SWAP" } ] ] } ] ] },[ [ { "prim": "COMPARE" },{ "prim": "LE" } ],{ "prim": "IF","args":[ [],
[ [ { "prim": "UNIT" },{ "prim": "FAILWITH" } ] ] ] } ],{ "prim": "IF_CONS","args":[ [ [ { "prim": "UNIT" },{ "prim": "FAILWITH" } ] ],[] ] }, { "prim": "DROP" },{ "prim": "DIP","args":[ [ [ [ { "prim": "DUP" },{ "prim": "CAR" },{ "prim": "DIP","args":[ [ { "prim": "CDR" } ] ] } ] ],{ "prim": "PUSH","args":[ { "prim": "nat" },{ "int": "1" } ] },{ "prim": "ADD","annots": [ "@new_counter" ] },{ "prim": "PAIR" } ] ] },{ "prim": "IF_LEFT","args":[ [ { "prim": "UNIT" },{ "prim": "EXEC" } ],[ { "prim": "DIP","args":[ [ { "prim": "CAR" } ] ] },
{ "prim": "SWAP" },{ "prim": "PAIR" },{ "prim": "NIL","args":[ { "prim": "operation" } ] } ] ] },{ "prim": "PAIR" } ] ] } ] ] } ]

//contract for the example "Contract origination with map in storage having initial values"
const contractMapTacoShop =
[ { "prim": "parameter", "args": [ { "prim": "nat" } ] },
{ "prim": "storage","args":[ { "prim": "map","args":[ { "prim": "nat" },{ "prim": "pair","args":[ { "prim": "nat", "annots": [ "%current_stock" ] },{ "prim": "mutez", "annots": [ "%max_price" ] } ] } ] } ] },
{ "prim": "code","args":[ [ { "prim": "DUP" }, { "prim": "CAR" },{ "prim": "DIG", "args": [ { "int": "1" } ] }, { "prim": "DUP" },{ "prim": "DUG", "args": [ { "int": "2" } ] }, { "prim": "CDR" },{ "prim": "DUP" }, { "prim": "DIG", "args": [ { "int": "2" } ] },{ "prim": "DUP" }, { "prim": "DUG", "args": [ { "int": "3" } ] },{ "prim": "GET" },{ "prim": "IF_NONE","args":[ [ { "prim": "PUSH","args":[ { "prim": "string" },{ "string": "Unknown kind of taco." } ] },{ "prim": "FAILWITH" } ],[ { "prim": "DUP" },{ "prim": "DIP", "args": [ [ { "prim": "DROP" } ] ] } ] ] },
{ "prim": "DUP" }, { "prim": "CAR" },{ "prim": "DIG", "args": [ { "int": "1" } ] }, { "prim": "DUP" },{ "prim": "DUG", "args": [ { "int": "2" } ] }, { "prim": "CDR" },{ "prim": "EDIV" },{ "prim": "IF_NONE","args":[ [ { "prim": "PUSH","args":[ { "prim": "string" }, { "string": "DIV by 0" } ] },{ "prim": "FAILWITH" } ], [] ] }, { "prim": "CAR" },{ "prim": "DUP" }, { "prim": "AMOUNT" }, { "prim": "COMPARE" },{ "prim": "NEQ" },{ "prim": "IF","args":[ [ { "prim": "PUSH","args":[ { "prim": "string" },{ "string":"Sorry, the taco you are trying to purchase has a different price" } ] },
{ "prim": "FAILWITH" } ],[ { "prim": "PUSH","args": [ { "prim": "unit" }, { "prim": "Unit" } ] } ] ] },{ "prim": "DIG", "args": [ { "int": "2" } ] }, { "prim": "DUP" },{ "prim": "DUG", "args": [ { "int": "3" } ] },{ "prim": "PUSH", "args": [ { "prim": "nat" }, { "int": "1" } ] },{ "prim": "DIG", "args": [ { "int": "4" } ] }, { "prim": "DUP" },{ "prim": "DUG", "args": [ { "int": "5" } ] }, { "prim": "CAR" },{ "prim": "SUB" }, { "prim": "ABS" }, { "prim": "SWAP" },{ "prim": "CDR" }, { "prim": "SWAP" }, { "prim": "PAIR" },{ "prim": "DIG", "args": [ { "int": "4" } ] }, { "prim": "DUP" },
{ "prim": "DUG", "args": [ { "int": "5" } ] },{ "prim": "DIG", "args": [ { "int": "1" } ] }, { "prim": "DUP" },{ "prim": "DUG", "args": [ { "int": "2" } ] },{ "prim": "DIG", "args": [ { "int": "7" } ] }, { "prim": "DUP" },{ "prim": "DUG", "args": [ { "int": "8" } ] }, { "prim": "SWAP" },{ "prim": "SOME" }, { "prim": "SWAP" }, { "prim": "UPDATE" },{ "prim": "NIL", "args": [ { "prim": "operation" } ] },{ "prim": "PAIR" },{ "prim": "DIP","args": [ [ { "prim": "DROP", "args": [ { "int": "7" } ] } ] ] } ] ] } ]


//contract for the example of map wih pair key
const contractMapPairKey =
[ { "prim": "parameter", "args": [ { "prim": "unit" } ] },
{ "prim": "storage","args":[ { "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "address", "annots": [ "%theAddress" ] },
{ "prim": "map","args":[ { "prim": "pair","args":[ { "prim": "nat" }, { "prim": "address" } ] },{ "prim": "pair","args":[ { "prim": "mutez", "annots": [ "%amount" ] },{ "prim": "int", "annots": [ "%quantity" ] } ] } ],"annots": [ "%theMap" ] } ] },{ "prim": "int", "annots": [ "%theNumber" ] } ] } ] },
{ "prim": "code","args":[ [ { "prim": "DUP" }, { "prim": "CDR" },{ "prim": "NIL", "args": [ { "prim": "operation" } ] },{ "prim": "PAIR" },{ "prim": "DIP", "args": [ [ { "prim": "DROP" } ] ] } ] ] } ]

//contract for the example of map in storage with 8 nested pairs
const contractMap8pairs =
[{ "prim": "parameter", "args": [{ "prim": "unit" }] },{"prim": "storage","args":[{prim: 'map',args: [{prim: "pair", args: [{ prim: "int" },{prim: "pair", args: [{ prim: "nat" },{prim: "pair", args: [{ prim: "string" },{prim: "pair", args: [{ prim: "bytes" },{prim: "pair", args: [{ prim: "mutez" },{prim: "pair", args: [{ prim: "bool" },{prim: "pair", args: [{ prim: "key_hash" },{prim: "pair", args: [{ prim: "timestamp" },{ prim: "address" }]}]}]}]}]}]}]}]}, { prim: "int" }]},]},{"prim": "code","args":[[{ "prim": "DUP" }, { "prim": "CDR" },{ "prim": "NIL", "args": [{ "prim": "operation" }] },
{ "prim": "PAIR" },{ "prim": "DIP", "args": [[{ "prim": "DROP" }]] }]]}]

//contract for map and bigmap combined example
const contractMapBigMap =
[ { "prim": "parameter", "args": [ { "prim": "unit" } ] },{ "prim": "storage","args":[ { "prim": "pair","args":[ { "prim": "big_map","args":[ { "prim": "pair","args": [ { "prim": "nat" }, { "prim": "address" } ] },{ "prim": "int" } ], "annots": [ "%thebigmap" ] },{ "prim": "map","args":[ { "prim": "pair","args": [ { "prim": "nat" }, { "prim": "address" } ] },{ "prim": "int" } ], "annots": [ "%themap" ] } ] } ] },{ "prim": "code","args":[ [ { "prim": "DUP" }, { "prim": "CDR" },{ "prim": "NIL", "args": [ { "prim": "operation" } ] },{ "prim": "PAIR" },{ "prim": "DIP", "args": [ [ { "prim": "DROP" } ] ] } ] ] } ]

//signer required for examples in complex_parameter.md
const secretKey = "edskS56s5PHASc9Cxpjt5wXhEZPpgmmommNLVgc22pzmSeNmfNQXR89mPtmeHZzHVjsBVCThmSXR4JtZ9PfiLDcPdf7rjhmFib"

// This is the code of the contract use in complex_parameter.md
const contractJson = [{"prim":"parameter","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"lambda","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"address","annots":["%owner"]},{"prim":"big_map","args":[{"prim":"bytes"},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"option","args":[{"prim":"address"}],"annots":["%address"]},{"prim":"map","args":[{"prim":"string"},{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"address","annots":["%address"]},{"prim":"bool","annots":["%bool"]}]},
{"prim":"or","args":[{"prim":"bytes","annots":["%bytes"]},{"prim":"int","annots":["%int"]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"key","annots":["%key"]},{"prim":"key_hash","annots":["%key_hash"]}]},{"prim":"or","args":[{"prim":"nat","annots":["%nat"]},{"prim":"signature","annots":["%signature"]}]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"string","annots":["%string"]},{"prim":"mutez","annots":["%tez"]}]},{"prim":"timestamp","annots":["%timestamp"]}]}]}],"annots":["%data"]}]},{"prim":"pair","args":[{"prim":"address","annots":["%owner"]},{"prim":"option","args":[{"prim":"nat"}],"annots":["%ttl"]}]}]},
{"prim":"option","args":[{"prim":"nat"}],"annots":["%validator"]}]}],"annots":["%records"]}]},{"prim":"map","args":[{"prim":"nat"},{"prim":"address"}],"annots":["%validators"]}]},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"address","annots":["%owner"]},{"prim":"big_map","args":[{"prim":"bytes"},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"option","args":[{"prim":"address"}],"annots":["%address"]},{"prim":"map","args":[{"prim":"string"},{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"address","annots":["%address"]},
{"prim":"bool","annots":["%bool"]}]},{"prim":"or","args":[{"prim":"bytes","annots":["%bytes"]},{"prim":"int","annots":["%int"]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"key","annots":["%key"]},{"prim":"key_hash","annots":["%key_hash"]}]},{"prim":"or","args":[{"prim":"nat","annots":["%nat"]},{"prim":"signature","annots":["%signature"]}]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"string","annots":["%string"]},{"prim":"mutez","annots":["%tez"]}]},{"prim":"timestamp","annots":["%timestamp"]}]}]}],"annots":["%data"]}]},{"prim":"pair","args":[{"prim":"address","annots":["%owner"]},
{"prim":"option","args":[{"prim":"nat"}],"annots":["%ttl"]}]}]},{"prim":"option","args":[{"prim":"nat"}],"annots":["%validator"]}]}],"annots":["%records"]}]},{"prim":"map","args":[{"prim":"nat"},{"prim":"address"}],"annots":["%validators"]}]}],"annots":["%admin_update"]},{"prim":"pair","args":[{"prim":"contract","args":[{"prim":"option","args":[{"prim":"address"}]}],"annots":["%callback"]},{"prim":"bytes","annots":["%name"]}],"annots":["%resolve"]}]},{"prim":"or","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"option","args":[{"prim":"address"}],"annots":["%address"]},
{"prim":"map","args":[{"prim":"string"},{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"address","annots":["%address"]},{"prim":"bool","annots":["%bool"]}]},{"prim":"or","args":[{"prim":"bytes","annots":["%bytes"]},{"prim":"int","annots":["%int"]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"key","annots":["%key"]},{"prim":"key_hash","annots":["%key_hash"]}]},{"prim":"or","args":[{"prim":"nat","annots":["%nat"]},{"prim":"signature","annots":["%signature"]}]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"string","annots":["%string"]},{"prim":"mutez","annots":["%tez"]}]},
{"prim":"timestamp","annots":["%timestamp"]}]}]}],"annots":["%data"]}]},{"prim":"pair","args":[{"prim":"bytes","annots":["%label"]},{"prim":"address","annots":["%owner"]}]}]},{"prim":"pair","args":[{"prim":"bytes","annots":["%parent"]},{"prim":"option","args":[{"prim":"nat"}],"annots":["%ttl"]}]}],"annots":["%set_child_record"]},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"option","args":[{"prim":"address"}],"annots":["%address"]},{"prim":"map","args":[{"prim":"string"},{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"address","annots":["%address"]},
{"prim":"bool","annots":["%bool"]}]},{"prim":"or","args":[{"prim":"bytes","annots":["%bytes"]},{"prim":"int","annots":["%int"]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"key","annots":["%key"]},{"prim":"key_hash","annots":["%key_hash"]}]},{"prim":"or","args":[{"prim":"nat","annots":["%nat"]},{"prim":"signature","annots":["%signature"]}]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"string","annots":["%string"]},{"prim":"mutez","annots":["%tez"]}]},{"prim":"timestamp","annots":["%timestamp"]}]}]}],"annots":["%data"]}]},{"prim":"pair","args":[{"prim":"bytes","annots":["%name"]},{"prim":"address","annots":["%owner"]}]}]},
{"prim":"option","args":[{"prim":"nat"}],"annots":["%ttl"]}],"annots":["%update_record"]}]}]}]},{"prim":"storage","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"address","annots":["%owner"]},{"prim":"big_map","args":[{"prim":"bytes"},{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"option","args":[{"prim":"address"}],"annots":["%address"]},{"prim":"map","args":[{"prim":"string"},{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"address","annots":["%address"]},{"prim":"bool","annots":["%bool"]}]},{"prim":"or","args":[{"prim":"bytes","annots":["%bytes"]},
{"prim":"int","annots":["%int"]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"key","annots":["%key"]},{"prim":"key_hash","annots":["%key_hash"]}]},{"prim":"or","args":[{"prim":"nat","annots":["%nat"]},{"prim":"signature","annots":["%signature"]}]}]}]},{"prim":"or","args":[{"prim":"or","args":[{"prim":"string","annots":["%string"]},{"prim":"mutez","annots":["%tez"]}]},{"prim":"timestamp","annots":["%timestamp"]}]}]}],"annots":["%data"]}]},{"prim":"pair","args":[{"prim":"address","annots":["%owner"]},{"prim":"option","args":[{"prim":"nat"}],"annots":["%ttl"]}]}]},{"prim":"option","args":[{"prim":"nat"}],"annots":["%validator"]}]}],"annots":["%records"]}]},
{"prim":"map","args":[{"prim":"nat"},{"prim":"address"}],"annots":["%validators"]}]}]},{"prim":"code","args":[[{"prim":"DUP"},{"prim":"CDR"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"0"}]},{"prim":"AMOUNT"},{"prim":"COMPARE"},{"prim":"GT"},{"prim":"IF","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"AMOUNT_NOT_ZERO"}]},{"prim":"FAILWITH"}],[{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CAR"},{"prim":"IF_LEFT","args":[[{"prim":"DUP"},{"prim":"IF_LEFT","args":[[{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},
{"prim":"DUG","args":[{"int":"2"}]},{"prim":"SWAP"},{"prim":"EXEC"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"},{"prim":"DIP","args":[[{"prim":"DROP"}]]}],[{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"4"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"PAIR"},{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CDR"},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},
{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CDR"},{"prim":"GET"},{"prim":"IF_NONE","args":[[{"prim":"NONE","args":[{"prim":"address"}]}],[{"prim":"DUP"},{"prim":"CAR"},{"prim":"CAR"},{"prim":"CAR"},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"CAR"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"0"}]},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"4"}]},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"},{"prim":"DIP","args":[[{"prim":"DROP","args":[{"int":"3"}]}]]},{"prim":"PAIR"},
{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]},{"prim":"DIP","args":[[{"prim":"DROP"}]]}],[{"prim":"DUP"},{"prim":"IF_LEFT","args":[[{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"PAIR"},{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CDR"},{"prim":"DUP"},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"CDR"},{"prim":"CAR"},{"prim":"GET"},
{"prim":"IF_NONE","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"PARENT_NOT_FOUND"}]},{"prim":"FAILWITH"}],[{"prim":"SENDER"},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CAR"},{"prim":"COMPARE"},{"prim":"NEQ"},{"prim":"IF","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"NOT_AUTHORIZED"}]},{"prim":"FAILWITH"}],[{"prim":"PUSH","args":[{"prim":"bytes"},{"bytes":""}]},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"4"}]},{"prim":"CDR"},{"prim":"CAR"},{"prim":"COMPARE"},{"prim":"EQ"},
{"prim":"IF","args":[[{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CAR"}],[{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"CDR"},{"prim":"CAR"},{"prim":"PUSH","args":[{"prim":"bytes"},{"bytes":"2e"}]},{"prim":"CONCAT"},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"4"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CAR"},{"prim":"CONCAT"}]]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"4"}]},
{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"4"}]},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"6"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"7"}]},{"prim":"CDR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"7"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"8"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CDR"},{"prim":"PAIR"},{"prim":"DIG","args":[{"int":"7"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"8"}]},{"prim":"CAR"},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"8"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"9"}]},{"prim":"CAR"},{"prim":"CAR"},
{"prim":"CAR"},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"SOME"},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"4"}]},{"prim":"UPDATE"},{"prim":"DIP","args":[[{"prim":"DUP"},{"prim":"CDR"},{"prim":"SWAP"},{"prim":"CAR"},{"prim":"CAR"}]]},{"prim":"SWAP"},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"4"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"GET"},{"prim":"IF_NONE","args":[[{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},
{"prim":"DUG","args":[{"int":"3"}]},{"prim":"CDR"},{"prim":"IF_NONE","args":[[{"prim":"NIL","args":[{"prim":"operation"}]}],[{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"DIG","args":[{"int":"7"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"8"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CAR"},{"prim":"DIG","args":[{"int":"7"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"8"}]},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"DUP"},{"prim":"CAR"},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CDR"},
{"prim":"GET"},{"prim":"IF_NONE","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"INVALID_VALIDATOR_INDEX"}]},{"prim":"FAILWITH"}],[{"prim":"DUP"},{"prim":"CONTRACT","args":[{"prim":"bytes"}],"annots":["%validate"]},{"prim":"IF_NONE","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"INVALID_VALIDATOR_CONTRACT"}]},{"prim":"FAILWITH"}],[{"prim":"DUP"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"0"}]},{"prim":"DIG","args":[{"int":"4"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"5"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"TRANSFER_TOKENS"},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]},
{"prim":"DIP","args":[[{"prim":"DROP"}]]},{"prim":"CONS"},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]}],[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]}]]},{"prim":"PAIR"},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]},{"prim":"DIP","args":[[{"prim":"DROP","args":[{"int":"4"}]}]]}],[{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"PAIR"},{"prim":"DUP"},{"prim":"CAR"},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CDR"},
{"prim":"DUP"},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CAR"},{"prim":"GET"},{"prim":"IF_NONE","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"RECORD_NOT_FOUND"}]},{"prim":"FAILWITH"}],[{"prim":"SENDER"},{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CAR"},{"prim":"COMPARE"},{"prim":"NEQ"},{"prim":"IF","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"NOT_AUTHORIZED"}]},{"prim":"FAILWITH"}],[{"prim":"DIG","args":[{"int":"1"}]},{"prim":"DUP"},
{"prim":"DUG","args":[{"int":"2"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"5"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"6"}]},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"6"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"7"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CDR"},{"prim":"PAIR"},{"prim":"DIG","args":[{"int":"6"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"7"}]},{"prim":"CAR"},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"7"}]},
{"prim":"DUP"},{"prim":"DUG","args":[{"int":"8"}]},{"prim":"CAR"},{"prim":"CAR"},{"prim":"CAR"},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"SOME"},{"prim":"DIG","args":[{"int":"5"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"6"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"CAR"},{"prim":"UPDATE"},{"prim":"DIP","args":[[{"prim":"DUP"},{"prim":"CDR"},{"prim":"SWAP"},{"prim":"CAR"},{"prim":"CAR"}]]},{"prim":"SWAP"},{"prim":"PAIR"},{"prim":"PAIR"}]]},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]},{"prim":"DIP","args":[[{"prim":"DROP","args":[{"int":"3"}]}]]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"},{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]},
{"prim":"DIP","args":[[{"prim":"DROP"}]]}]]}]]},{"prim":"DIP","args":[[{"prim":"DROP","args":[{"int":"2"}]}]]}]]}]

//contracts for examples of storage with and without annotations
const contractStorageAnnot =
[ { "prim": "parameter", "args": [ { "prim": "unit" } ] },{ "prim": "storage","args":[ { "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "address", "annots": [ "%theAddress" ] },{ "prim": "bool", "annots": [ "%theBool" ] } ] },{ "prim": "pair","args":[ { "prim": "nat", "annots": [ "%theNat" ] },{ "prim": "int", "annots": [ "%theNumber" ] } ] } ] },{ "prim": "mutez", "annots": [ "%theTez" ] } ] } ] },{ "prim": "code","args":[ [ { "prim": "DUP" }, { "prim": "CDR" },{ "prim": "NIL", "args": [ { "prim": "operation" } ] },{ "prim": "PAIR" },{ "prim": "DIP", "args": [ [ { "prim": "DROP" } ] ] } ] ] } ]

const contractStorageWithAndWithoutAnnot =
[ { "prim": "parameter", "args": [ { "prim": "unit" } ] },{ "prim": "storage","args":[ { "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "address"},{ "prim": "bool"} ] },{ "prim": "pair","args":[ { "prim": "nat", "annots": [ "%theNat" ] },{ "prim": "int", "annots": [ "%theNumber" ] } ] } ] },{ "prim": "mutez" } ] } ] },{ "prim": "code","args":[ [ { "prim": "DUP" }, { "prim": "CDR" },{ "prim": "NIL", "args": [ { "prim": "operation" } ] },{ "prim": "PAIR" },{ "prim": "DIP", "args": [ [ { "prim": "DROP" } ] ] } ] ] } ]

const contractStorageWithoutAnnot =
[ { "prim": "parameter", "args": [ { "prim": "unit" } ] },{ "prim": "storage","args":[ { "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "pair","args":[ { "prim": "address"},{ "prim": "bool"} ] },{ "prim": "pair","args":[ { "prim": "nat" },{ "prim": "int" } ] } ] },{ "prim": "mutez" } ] } ] },{ "prim": "code","args":[ [ { "prim": "DUP" }, { "prim": "CDR" },{ "prim": "NIL", "args": [ { "prim": "operation" } ] },{ "prim": "PAIR" },{ "prim": "DIP", "args": [ [ { "prim": "DROP" } ] ] } ] ] } ]

const managerCode = [{"prim": "parameter","args":[{"prim": "or","args":[{"prim": "lambda","args":[{ "prim": "unit" },{"prim": "list","args": [{ "prim": "operation" }]}],"annots": ["%do"]},{ "prim": "unit", "annots": ["%default"] }]}]},{ "prim": "storage", "args": [{ "prim": "key_hash" }] },{"prim": "code","args":[[[[{ "prim": "DUP" }, { "prim": "CAR" },{"prim": "DIP","args": [[{ "prim": "CDR" }]]}]],{"prim": "IF_LEFT","args":[[{"prim": "PUSH","args":[{ "prim": "mutez" },{ "int": "0" }]},{ "prim": "AMOUNT" },[[{ "prim": "COMPARE" },{ "prim": "EQ" }],{"prim": "IF","args":[[],[[{ "prim": "UNIT" },{ "prim": "FAILWITH" }]]]}],
[{"prim": "DIP","args": [[{ "prim": "DUP" }]]},{ "prim": "SWAP" }],{ "prim": "IMPLICIT_ACCOUNT" },{ "prim": "ADDRESS" },{ "prim": "SENDER" },[[{ "prim": "COMPARE" },{ "prim": "EQ" }],{"prim": "IF","args":[[],[[{ "prim": "UNIT" },{ "prim": "FAILWITH" }]]]}],{ "prim": "UNIT" }, { "prim": "EXEC" },{ "prim": "PAIR" }],[{ "prim": "DROP" },{"prim": "NIL","args": [{ "prim": "operation" }]},{ "prim": "PAIR" }]]}]]}]

`;

    this.transpile({ code, scope, transformCode, noInline });
  }
}

function Playground({ children, theme, transformCode, ...props }) {
  const [showCopied, setShowCopied] = useState(false);
  const live = useRef(null);
  const copy = useRef(null);

  useEffect(() => {
    let clipboard;

    if (copy.current) {
      clipboard = new Clipboard(copy.current, {
        text: () => live.current.code
      });
    }

    return () => {
      if (clipboard) {
        clipboard.destroy();
      }
    };
  }, [copy.current, live.current]);

  const handleRunCode = () => {
    live.current && live.current.run();
  };

  const handleCopyCode = () => {
    window.getSelection().empty();
    setShowCopied(true);

    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <SemiLiveProvider
      ref={live}
      code={children}
      transformCode={transformCode || (code => `${code};`)}
      theme={theme}
      {...props}>
      <div
        className={styles.playgroundEditorWrapper}>
        <div
          className={classnames(
            styles.playgroundHeader,
            styles.playgroundEditorHeader,
          )}>
          Live Editor
        </div>
        <LiveEditor className={styles.liveEditorBg}/>
        <button
          ref={copy}
          type="button"
          aria-label="Copy code to clipboard"
          className={classnames(
            styles.button,
            styles.copyButton,
          )}
          onClick={handleCopyCode}>
          {showCopied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div
        className={classnames(
          styles.playgroundHeader,
          styles.playgroundPreviewHeader,
        )}>
        Result
        <button
          type="button"
          aria-label="Execute example"
          className={classnames(
            styles.button,
            styles.runButton,
          )}
          onClick={handleRunCode}>
          Run code
          </button>
      </div>
      <div className={styles.playgroundPreview}>
        <LivePreview />
        <LiveError />
      </div>
    </SemiLiveProvider>
  );
}

export default Playground;
