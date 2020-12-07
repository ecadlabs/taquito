/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
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

    // The following piece of code provides additional functionality to the user code such as prinln function and key import
    const code = `
let _printlnBuffer = "";

function println(value) {
  _printlnBuffer += value + "\\n";

  render(_printlnBuffer);
}

Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/carthagenet' });

${this.props.wallet ? 
  `const network = {type:"carthagenet"};
  wallet.requestPermissions({network})
  .then(permission => {
    return Tezos.setWalletProvider(wallet);
  })
  .then(() => {
    ${this.code}
  });`:
  `fetch('https://api.tez.ie/keys/carthagenet/', {
    method: 'POST',
    headers: { Authorization: 'Bearer taquito-example' },
  })
  .then(response => response.text())
  .then(privateKey => {
    return importKey(Tezos, privateKey);
   })
  .then(() => {
    ${this.code}
   });`}

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

//signer for example with complex storage/parameters
const emailExample = "zsjpcmui.oysiavbv@tezos.example.org"
const passwordExample = "4rW0D22yXt"
const mnemonicExample = "arrange ceiling whisper churn congress double step carpet empty rice prevent swallow silk casual champion"
const secretExample = "af552679c4943509bd77643b8ef3f8dcf42e61b3"

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
        <LiveEditor />
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
