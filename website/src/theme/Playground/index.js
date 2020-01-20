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
    this.code = this.props.code;
  }

  run() {
    const { scope, transformCode, noInline } = this.props;
    this.transpile({ code: this.code, scope, transformCode, noInline });
  }
}

function Playground({children, theme, transformCode, ...props}) {
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
