/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the Apache 2.0 License found in the
 * LICENSE file in the root directory of this source tree.
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Playground from '@theme/Playground';
import classnames from 'classnames';
import Clipboard from 'clipboard';
import rangeParser from 'parse-numeric-range';
import Highlight, { defaultProps } from 'prism-react-renderer';
import defaultTheme from 'prism-react-renderer/themes/palenight';
import React, { useEffect, useRef, useState } from 'react';

import styles from './styles.module.css';

const highlightLinesRangeRegex = /{([\d,-]+)}/;

export default ({
  children,
  className: languageClassName,
  live,
  metastring,
  ...props
}) => {
  const {
    siteConfig: {
      themeConfig: { prism = {} },
    },
  } = useDocusaurusContext();
  const [showCopied, setShowCopied] = useState(false);
  const [dependencies, setDependencies] = useState(null);
  const target = useRef(null);
  const button = useRef(null);
  let highlightLines = [];

  if (metastring && highlightLinesRangeRegex.test(metastring)) {
    const highlightLinesRange = metastring.match(highlightLinesRangeRegex)[1];
    highlightLines = rangeParser.parse(highlightLinesRange).filter(n => n > 0);
  }

  useEffect(() => {
    let clipboard;

    if (button.current) {
      clipboard = new Clipboard(button.current, {
        target: () => target.current,
      });
    }

    return () => {
      if (clipboard) {
        clipboard.destroy();
      }
    };
  }, [button.current, target.current]);

  useEffect(() => {
    async function getDependencies() {
      const { TezosToolkit, MichelsonMap, compose, getRevealFee, RpcReadAdapter, UnitValue } = await import('@taquito/taquito');
      const { verifySignature } = await import('@taquito/utils');
      const {
        validateAddress,
        validateChain,
        validateKeyHash,
        validateContractAddress,
        validatePublicKey,
        validateSignature,
        validateBlock,
        validateProtocol,
        validateOperation,
        b58cencode,
        bytes2Char,
        char2Bytes,
        bytesToString,
        stringToBytes,
        num2PaddedHex,
        prefix,
        Prefix
      } = await import('@taquito/utils');
      const { BeaconWallet } = await import('@taquito/beacon-wallet');
      const { SigningType, BeaconEvent } = await import('@airgap/beacon-sdk');
      const { InMemorySigner, importKey, Path, ECDSA, Ed25519, generateSecretKey } = await import('@taquito/signer');
      const { LedgerSigner, DerivationType } = await import('@taquito/ledger-signer');
      const { Tzip16Module, tzip16, MichelsonStorageView } = await import('@taquito/tzip16')
      const { Tzip12Module, tzip12 } = await import("@taquito/tzip12");
      const { Schema, ParameterSchema, Token } = await import("@taquito/michelson-encoder");
      const { Parser, packDataBytes, emitMicheline } = await import('@taquito/michel-codec');
      const { RpcClient } = await import('@taquito/rpc');
      const { WalletConnect2, PermissionScopeMethods, NetworkType } = await import('@taquito/wallet-connect-2');
      const TransportWebHID = (await import("@ledgerhq/hw-transport-webhid")).default;

      let wallet;
      if (typeof window !== 'undefined') {
        // solve localStorage is not defined Error when building server
        // can use localStorage on the browser, not on the server
        wallet = new BeaconWallet({ name:"exampleWallet", network: { type: 'ghostnet'}, enableMetrics: true, });
        wallet.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, account => console.log(`${BeaconEvent.ACTIVE_ACCOUNT_SET} triggered: `, account));
      }
      const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com/');
      setDependencies({
        Tezos,
        wallet,
        importKey,
        validateAddress,
        validateChain,
        validateKeyHash,
        validateContractAddress,
        validatePublicKey,
        validateSignature,
        validateBlock,
        validateOperation,
        validateProtocol,
        b58cencode,
        prefix,
        Prefix,
        MichelsonMap,
        InMemorySigner,
        LedgerSigner,
        Tzip16Module,
        tzip16,
        bytes2Char,
        char2Bytes,
        bytesToString,
        stringToBytes,
        num2PaddedHex,
        SigningType,
        BeaconEvent,
        MichelsonStorageView,
        Tzip12Module,
        tzip12,
        DerivationType,
        TransportWebHID,
        compose,
        Schema,
        ParameterSchema,
        Token,
        getRevealFee,
        verifySignature,
        Parser,
        packDataBytes,
        emitMicheline,
        RpcReadAdapter,
        RpcClient,
        WalletConnect2,
        PermissionScopeMethods,
        NetworkType,
        Ed25519,
        ECDSA,
        Path,
        generateSecretKey,
        UnitValue
      });
    }
    if (!dependencies) {
      getDependencies();
    }
  }, []);

  if (live) {

    return (
      <Playground
        scope={{
          ...React,
          Tezos: dependencies?.Tezos,
          wallet: dependencies?.wallet,
          importKey: dependencies?.importKey,
          validateAddress: dependencies?.validateAddress,
          validateChain: dependencies?.validateChain,
          validateKeyHash: dependencies?.validateKeyHash,
          validateContractAddress: dependencies?.validateContractAddress,
          validatePublicKey: dependencies?.validatePublicKey,
          validateSignature: dependencies?.validateSignature,
          validateBlock: dependencies?.validateBlock,
          validateOperation: dependencies?.validateOperation,
          validateProtocol: dependencies?.validateProtocol,
          b58cencode: dependencies?.b58cencode,
          prefix: dependencies?.prefix,
          Prefix: dependencies?.Prefix,
          MichelsonMap: dependencies?.MichelsonMap,
          InMemorySigner: dependencies?.InMemorySigner,
          LedgerSigner: dependencies?.LedgerSigner,
          Tzip16Module: dependencies?.Tzip16Module,
          tzip16: dependencies?.tzip16,
          bytes2Char: dependencies?.bytes2Char,
          char2Bytes: dependencies?.char2Bytes,
          bytesToString: dependencies?.bytesToString,
          stringToBytes: dependencies?.stringToBytes,
          num2PaddedHex: dependencies?.num2PaddedHex,
          SigningType: dependencies?.SigningType,
          BeaconEvent: dependencies?.BeaconEvent,
          MichelsonStorageView: dependencies?.MichelsonStorageView,
          Tzip12Module: dependencies?.Tzip12Module,
          tzip12: dependencies?.tzip12,
          DerivationType: dependencies?.DerivationType,
          TransportWebHID: dependencies?.TransportWebHID,
          compose: dependencies?.compose,
          Schema: dependencies?.Schema,
          ParameterSchema: dependencies?.ParameterSchema,
          Token: dependencies?.Token,
          getRevealFee: dependencies?.getRevealFee,
          verifySignature: dependencies?.verifySignature,
          Parser: dependencies?.Parser,
          packDataBytes: dependencies?.packDataBytes,
          emitMicheline: dependencies?.emitMicheline,
          RpcReadAdapter: dependencies?.RpcReadAdapter,
          RpcClient: dependencies?.RpcClient,
          InMemorySpendingKey: dependencies?.InMemorySpendingKey,
          InMemoryViewingKey: dependencies?.InMemoryViewingKey,
          WalletConnect2: dependencies?.WalletConnect2,
          PermissionScopeMethods: dependencies?.PermissionScopeMethods,
          NetworkType: dependencies?.NetworkType,
          Ed25519: dependencies?.Ed25519,
          ECDSA: dependencies?.ECDSA,
          Path: dependencies?.Path,
          generateSecretKey: dependencies?.generateSecretKey,
          UnitValue: dependencies?.UnitValue,
         }}
        code={children.trim()}
        theme={prism.theme || defaultTheme}
        transformCode={code => code.replace(/import .*/g, '')}
        {...props}
      />
    );
  }

  let language =
    languageClassName && languageClassName.replace(/language-/, '');

  if (!language && prism.defaultLanguage) {
    language = prism.defaultLanguage;
  }

  const handleCopyCode = () => {
    window.getSelection().empty();
    setShowCopied(true);

    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <Highlight
      {...defaultProps}
      theme={prism.theme || defaultTheme}
      code={children.trim()}
      language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={styles.codeBlockWrapper}>
          <pre
            ref={target}
            className={classnames(className, styles.codeBlock)}
            style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i });

              if (highlightLines.includes(i + 1)) {
                lineProps.className = `${lineProps.className} docusaurus-highlight-code-line`;
              }

              return (
                <div key={i} {...lineProps}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              );
            })}
          </pre>
          <button
            ref={button}
            type="button"
            aria-label="Copy code to clipboard"
            className={styles.copyButton}
            onClick={handleCopyCode}>
            {showCopied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
    </Highlight>
  );
};
