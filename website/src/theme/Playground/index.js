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

fetch('https://api.tez.ie/keys/carthagenet/', {
    method: 'POST',
    headers: { Authorization: 'Bearer taquito-example' },
  })
  .then(response => response.text())
  .then(privateKey => {
    return Tezos.importKey(privateKey);
  })
  .then(() => {
    ${this.code}
  });

const genericMultisigJSONfile =
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
