import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import {
  AbortedBeaconError,
  arMessages,
  BeaconError,
  BeaconErrorType,
  BeaconMessageType,
  BroadcastBeaconError,
  builtInLocales,
  ColorMode,
  configureBeaconI18n,
  deMessages,
  detectBrowserLocale,
  enMessages,
  esMessages,
  ExtendedWalletConnectPairingRequest,
  frMessages,
  getBeaconDirection,
  getBeaconErrorCopy,
  getBeaconLocale,
  getBeaconMessages,
  getBeaconTranslations,
  getError,
  hasBuiltInLocale,
  interpolateBeaconMessage,
  isBeaconError,
  isErrorOrigin,
  isErrorResponse,
  isRequestErrorResponse,
  isTezosRpcError,
  jaMessages,
  NetworkNotSupportedBeaconError,
  NetworkType,
  NoAddressBeaconError,
  NoPrivateKeyBeaconError,
  normalizeLocaleTag,
  NotGrantedBeaconError,
  Origin,
  ParametersInvalidBeaconError,
  PeerUnreachableBeaconError,
  PermissionScope,
  Regions,
  resetBeaconI18n,
  resolveBeaconLang,
  resolveBuiltInLocaleCatalog,
  setBeaconDirection,
  setBeaconLocale,
  setBeaconTranslations,
  SignatureTypeNotSupportedBeaconError,
  SigningType,
  Storage,
  StorageKey,
  subscribeBeaconI18n,
  TooManyOperationsBeaconError,
  TransactionInvalidBeaconError,
  TransportStatus,
  TransportType,
  UnknownBeaconError,
  WalletConnectPairingRequest,
} from '../src/beacon-types';

import type {
  AccountIdentifier,
  AccountInfo,
  AcknowledgeResponse,
  AppMetadata,
  BeaconAriaMessages,
  BeaconDAppMessages,
  BeaconErrorCopy,
  BeaconErrorOptions,
  BeaconI18nConfig,
  BeaconLocaleMessages,
  BeaconLocaleMetadata,
  BeaconLocaleStatus,
  BeaconMessageWrapper,
  BeaconResolvedDirection,
  BeaconTextDirection,
  BeaconTranslationOverrides,
  BeaconUIMessages,
  BeaconWalletTypeMessages,
  BlockchainAccountInfo,
  BlockExplorerInterface,
  BroadcastResponseOutput,
  ConnectionContext,
  ConnectionInfo,
  DeepPartial,
  DisplayableWalletConnectFailureReason,
  ErrorOrigin,
  ErrorResponse,
  ExtendedP2PPairingResponse,
  ExtendedPeerInfo,
  ExtendedPostMessagePairingResponse,
  ExtendedWalletConnectPairingResponse,
  Network,
  NodeDistributions,
  OperationResponseOutput,
  PartialTezosOperation,
  PeerInfo,
  PeerInfoType,
  PendingRequestInfo,
  PermissionResponseOutput,
  PermissionResponseV3,
  ProofOfEventChallengeRequestInput,
  ProofOfEventChallengeResponseOutput,
  RequestBroadcastInput,
  RequestErrorResponse,
  RequestOperationInput,
  RequestPermissionInput,
  RequestSignPayloadInput,
  SignPayloadResponseOutput,
  SimulatedProofOfEventChallengeRequestInput,
  SimulatedProofOfEventChallengeResponseOutput,
  StorageChangeEvent,
  StorageChangeListener,
  StoredAccountInfo,
  TezosRpcError,
  TransportHealth,
  TransportStatusChangedInfo,
  TransportStatusChangeReason,
  WaitingForWalletAckInfo,
  WalletConnectErrorCopy,
  WalletConnectPairingFailureReason,
  WalletConnectPairingResult,
  WalletInfo,
} from '../src/beacon-types';

// BeaconEvent and DAppClientOptions live on the main entry point (not ./types)
// because they require @ecadlabs/beacon-dapp which has side effects.
import {
  AbortedBeaconError as MainAbortedBeaconError,
  arMessages as mainArMessages,
  BeaconError as MainBeaconError,
  BeaconEvent,
  builtInLocales as mainBuiltInLocales,
  ColorMode as MainColorMode,
  configureBeaconI18n as mainConfigureBeaconI18n,
  defaultEventCallbacks,
  deMessages as mainDeMessages,
  detectBrowserLocale as mainDetectBrowserLocale,
  enMessages as mainEnMessages,
  esMessages as mainEsMessages,
  ExtendedWalletConnectPairingRequest as MainExtendedWalletConnectPairingRequest,
  frMessages as mainFrMessages,
  getBeaconDirection as mainGetBeaconDirection,
  getBeaconErrorCopy as mainGetBeaconErrorCopy,
  getBeaconLocale as mainGetBeaconLocale,
  getBeaconMessages as mainGetBeaconMessages,
  getBeaconTranslations as mainGetBeaconTranslations,
  getColorMode as mainGetColorMode,
  getError as mainGetError,
  hasBuiltInLocale as mainHasBuiltInLocale,
  interpolateBeaconMessage as mainInterpolateBeaconMessage,
  isBeaconError as mainIsBeaconError,
  isErrorOrigin as mainIsErrorOrigin,
  isErrorResponse as mainIsErrorResponse,
  isRequestErrorResponse as mainIsRequestErrorResponse,
  isTezosRpcError as mainIsTezosRpcError,
  jaMessages as mainJaMessages,
  LocalStorage,
  normalizeLocaleTag as mainNormalizeLocaleTag,
  PeerUnreachableBeaconError as MainPeerUnreachableBeaconError,
  resetBeaconI18n as mainResetBeaconI18n,
  resolveBeaconLang as mainResolveBeaconLang,
  resolveBuiltInLocaleCatalog as mainResolveBuiltInLocaleCatalog,
  setBeaconDirection as mainSetBeaconDirection,
  setBeaconLocale as mainSetBeaconLocale,
  setBeaconTranslations as mainSetBeaconTranslations,
  setColorMode as mainSetColorMode,
  subscribeBeaconI18n as mainSubscribeBeaconI18n,
  toBeaconError,
  TransactionInvalidBeaconError as MainTransactionInvalidBeaconError,
  WalletConnectPairingRequest as MainWalletConnectPairingRequest,
} from '../src/taquito-beacon-wallet';
import type {
  AcknowledgeInfo,
  ActiveTransportInfo,
  BeaconAriaMessages as MainBeaconAriaMessages,
  BeaconDAppMessages as MainBeaconDAppMessages,
  BeaconErrorCopy as MainBeaconErrorCopy,
  BeaconErrorOptions as MainBeaconErrorOptions,
  BeaconEventHandler,
  BeaconEventHandlerFunction,
  BeaconEventType,
  BeaconI18nConfig as MainBeaconI18nConfig,
  BeaconLocaleMessages as MainBeaconLocaleMessages,
  BeaconLocaleMetadata as MainBeaconLocaleMetadata,
  BeaconLocaleStatus as MainBeaconLocaleStatus,
  BeaconMessageRecord,
  BeaconResolvedDirection as MainBeaconResolvedDirection,
  BeaconTextDirection as MainBeaconTextDirection,
  BeaconTranslationOverrides as MainBeaconTranslationOverrides,
  BeaconUIMessages as MainBeaconUIMessages,
  BeaconWalletTypeMessages as MainBeaconWalletTypeMessages,
  ConnectionInfo as MainConnectionInfo,
  DAppClient,
  DAppClientDisconnectOptions,
  DAppClientOptions,
  DAppClientRemoveAllPeersOptions,
  DAppUiOptions,
  DeepPartial as MainDeepPartial,
  DisplayableWalletConnectFailureReason as MainDisplayableWalletConnectFailureReason,
  ErrorOrigin as MainErrorOrigin,
  ExtraInfo,
  InvalidAccountDeactivatedEvent,
  InvalidAccountDeactivatedReason,
  LateErrorResponseInfo,
  LateResponseInfo,
  LateSuccessResponseInfo,
  PendingRequestInfo as MainPendingRequestInfo,
  PermissionResponseInfo,
  RequestErrorResponse as MainRequestErrorResponse,
  RequestResponseInfo,
  RequestSentInfo,
  ResponseMessage,
  ResponseOutput,
  TezosRpcError as MainTezosRpcError,
  TransportHealth as MainTransportHealth,
  TransportStatusChangedInfo as MainTransportStatusChangedInfo,
  TransportStatusChangeReason as MainTransportStatusChangeReason,
  V3ResponsePayload,
  WaitingForWalletAckInfo as MainWaitingForWalletAckInfo,
  WalletConnectErrorCopy as MainWalletConnectErrorCopy,
  WalletConnectPairingFailureReason as MainWalletConnectPairingFailureReason,
  WalletConnectPairingResult as MainWalletConnectPairingResult,
  WalletInfo as MainWalletInfo,
  WireErrorMessage,
  WireErrorPayload,
} from '../src/taquito-beacon-wallet';

describe('beacon-types re-exports (side-effect-free)', () => {
  it('should export NetworkType enum', () => {
    expect(NetworkType.SHADOWNET).toBeDefined();
    expect(NetworkType.MAINNET).toBeDefined();
  });

  it('should export PermissionScope enum', () => {
    expect(PermissionScope.OPERATION_REQUEST).toBeDefined();
  });

  it('should export SigningType enum', () => {
    expect(SigningType.OPERATION).toBeDefined();
    expect(SigningType.RAW).toBeDefined();
    expect(SigningType.MICHELINE).toBeDefined();
  });

  it('should export Regions enum', () => {
    expect(Regions.EUROPE_WEST).toBeDefined();
  });

  it('should export BeaconErrorType, BeaconMessageType, ColorMode, Origin, TransportStatus, and TransportType enums', () => {
    expect(BeaconErrorType.PEER_UNREACHABLE).toBe('PEER_UNREACHABLE');
    expect(BeaconErrorType.ABORTED_ERROR).toBe('ABORTED_ERROR');
    expect(BeaconMessageType.OperationResponse).toBe('operation_response');
    expect(ColorMode.DARK).toBe('dark');
    expect(Origin.P2P).toBe('p2p');
    expect(TransportStatus.CONNECTED).toBe('CONNECTED');
    expect(TransportType.WALLETCONNECT).toBe('walletconnect');
  });

  it('should export BeaconError subclasses, getError factory, and runtime error guards', () => {
    const errorClasses = [
      AbortedBeaconError,
      BroadcastBeaconError,
      NetworkNotSupportedBeaconError,
      NoAddressBeaconError,
      NoPrivateKeyBeaconError,
      NotGrantedBeaconError,
      ParametersInvalidBeaconError,
      PeerUnreachableBeaconError,
      SignatureTypeNotSupportedBeaconError,
      TooManyOperationsBeaconError,
      TransactionInvalidBeaconError,
      UnknownBeaconError,
    ];
    for (const ErrorClass of errorClasses) {
      expect(typeof ErrorClass).toBe('function');
    }

    const txErr = getError(BeaconErrorType.TRANSACTION_INVALID_ERROR, [
      { kind: 'permanent', id: 'proto.024.michelson_v1.script_rejected' },
    ]);
    expect(txErr).toBeInstanceOf(BeaconError);
    expect(txErr).toBeInstanceOf(TransactionInvalidBeaconError);
    expect(isBeaconError(txErr)).toBe(true);
    expect(isRequestErrorResponse(txErr)).toBe(true);
    expect(isErrorResponse(txErr)).toBe(true);
    expect(isErrorOrigin('wallet')).toBe(true);
    expect(isErrorOrigin('local')).toBe(true);
    expect(isErrorOrigin('invalid')).toBe(false);
    expect(
      isTezosRpcError({ kind: 'permanent', id: 'proto.024.michelson_v1.script_rejected' })
    ).toBe(true);
    expect(typeof Storage).toBe('function');
    expect(StorageKey.ACTIVE_ACCOUNT).toBe('beacon:active-account');
    expect(StorageKey.LAST_SELECTED_WALLET).toBe('beacon:last-selected-wallet');
  });

  it('should export i18n catalogs, helpers, and WalletConnect pairing request classes from ./types', () => {
    resetBeaconI18n();
    expect(builtInLocales.en).toBe(enMessages);
    expect(builtInLocales.fr).toBe(frMessages);
    expect(builtInLocales.es).toBe(esMessages);
    expect(builtInLocales.de).toBe(deMessages);
    expect(builtInLocales.ja).toBe(jaMessages);
    expect(builtInLocales.ar).toBe(arMessages);

    expect(normalizeLocaleTag(' fr_CA ')).toBe('fr-CA');
    expect(hasBuiltInLocale('fr-CA')).toBe(true);
    expect(hasBuiltInLocale('tlh-KL')).toBe(false);
    expect(resolveBuiltInLocaleCatalog('es-MX')).toBe(esMessages);
    expect(typeof detectBrowserLocale).toBe('function');

    const listener = () => {};
    const unsubscribe = subscribeBeaconI18n(listener);
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();

    configureBeaconI18n({
      locale: 'ar',
      direction: 'auto',
      translations: { dapp: { requestSent: 'طلب مخصص لـ {{wallet}}' } },
    });
    expect(getBeaconLocale()).toBe('ar');
    expect(resolveBeaconLang()).toBe('ar');
    expect(getBeaconDirection()).toBe('rtl');
    expect(getBeaconTranslations()?.dapp?.requestSent).toBe('طلب مخصص لـ {{wallet}}');
    expect(getBeaconMessages().meta.locale).toBe('ar');
    expect(getBeaconErrorCopy(BeaconErrorType.ABORTED_ERROR).title).toBe(
      arMessages.errors[BeaconErrorType.ABORTED_ERROR].title
    );
    expect(
      interpolateBeaconMessage(getBeaconMessages().dapp.requestSent, { wallet: 'Kukai' })
    ).toBe('طلب مخصص لـ Kukai');

    setBeaconLocale('de');
    setBeaconDirection('ltr');
    setBeaconTranslations(undefined);
    expect(getBeaconLocale()).toBe('de');
    expect(getBeaconDirection()).toBe('ltr');
    expect(getBeaconTranslations()).toBeUndefined();

    const wcReq = new WalletConnectPairingRequest(
      'id-1',
      'App',
      'pub-1',
      '2',
      'wc:test',
      undefined,
      undefined,
      'origin-not-allowed'
    );
    expect(wcReq.failureReason).toBe('origin-not-allowed');
    const extWcReq = new ExtendedWalletConnectPairingRequest(
      'id-2',
      'App',
      'pub-2',
      '2',
      'sender-2',
      'wc:test',
      undefined,
      undefined,
      'relay-unreachable'
    );
    expect(extWcReq.failureReason).toBe('relay-unreachable');
    resetBeaconI18n();
  });
});

describe('main entry re-exports (beacon-dapp types)', () => {
  it('should export all BeaconEvent lifecycle values including 4.9.0-ecad observability events', () => {
    // Request lifecycle
    expect(BeaconEvent.PERMISSION_REQUEST_SENT).toBe('PERMISSION_REQUEST_SENT');
    expect(BeaconEvent.PERMISSION_REQUEST_SUCCESS).toBe('PERMISSION_REQUEST_SUCCESS');
    expect(BeaconEvent.PERMISSION_REQUEST_ERROR).toBe('PERMISSION_REQUEST_ERROR');
    expect(BeaconEvent.OPERATION_REQUEST_SENT).toBe('OPERATION_REQUEST_SENT');
    expect(BeaconEvent.OPERATION_REQUEST_SUCCESS).toBe('OPERATION_REQUEST_SUCCESS');
    expect(BeaconEvent.OPERATION_REQUEST_ERROR).toBe('OPERATION_REQUEST_ERROR');
    expect(BeaconEvent.SIGN_REQUEST_SENT).toBe('SIGN_REQUEST_SENT');
    expect(BeaconEvent.SIGN_REQUEST_SUCCESS).toBe('SIGN_REQUEST_SUCCESS');
    expect(BeaconEvent.SIGN_REQUEST_ERROR).toBe('SIGN_REQUEST_ERROR');
    expect(BeaconEvent.BROADCAST_REQUEST_SENT).toBe('BROADCAST_REQUEST_SENT');
    expect(BeaconEvent.BROADCAST_REQUEST_SUCCESS).toBe('BROADCAST_REQUEST_SUCCESS');
    expect(BeaconEvent.BROADCAST_REQUEST_ERROR).toBe('BROADCAST_REQUEST_ERROR');
    expect(BeaconEvent.PROOF_OF_EVENT_CHALLENGE_REQUEST_SENT).toBe(
      'PROOF_OF_EVENT_CHALLENGE_REQUEST_SENT'
    );
    expect(BeaconEvent.PROOF_OF_EVENT_CHALLENGE_REQUEST_SUCCESS).toBe(
      'PROOF_OF_EVENT_CHALLENGE_REQUEST_SUCCESS'
    );
    expect(BeaconEvent.PROOF_OF_EVENT_CHALLENGE_REQUEST_ERROR).toBe(
      'PROOF_OF_EVENT_CHALLENGE_REQUEST_ERROR'
    );
    expect(BeaconEvent.SIMULATED_PROOF_OF_EVENT_CHALLENGE_REQUEST_SENT).toBe(
      'SIMULATED_PROOF_OF_EVENT_CHALLENGE_REQUEST_SENT'
    );
    expect(BeaconEvent.SIMULATED_PROOF_OF_EVENT_CHALLENGE_REQUEST_SUCCESS).toBe(
      'SIMULATED_PROOF_OF_EVENT_CHALLENGE_REQUEST_SUCCESS'
    );
    expect(BeaconEvent.SIMULATED_PROOF_OF_EVENT_CHALLENGE_REQUEST_ERROR).toBe(
      'SIMULATED_PROOF_OF_EVENT_CHALLENGE_REQUEST_ERROR'
    );
    expect(BeaconEvent.BLOCKCHAIN_REQUEST_SUCCESS).toBe('BLOCKCHAIN_REQUEST_SUCCESS');
    expect(BeaconEvent.ACKNOWLEDGE_RECEIVED).toBe('ACKNOWLEDGE_RECEIVED');
    expect(BeaconEvent.WAITING_FOR_WALLET_ACK).toBe('WAITING_FOR_WALLET_ACK');
    expect(BeaconEvent.LATE_RESPONSE_RECEIVED).toBe('LATE_RESPONSE_RECEIVED');

    // Account & session lifecycle
    expect(BeaconEvent.ACTIVE_ACCOUNT_SET).toBe('ACTIVE_ACCOUNT_SET');
    expect(BeaconEvent.INVALID_ACCOUNT_DEACTIVATED).toBe('INVALID_ACCOUNT_DEACTIVATED');
    expect(BeaconEvent.INVALID_ACTIVE_ACCOUNT_STATE).toBe('INVALID_ACTIVE_ACCOUNT_STATE');
    expect(BeaconEvent.NO_PERMISSIONS).toBe('NO_PERMISSIONS');
    expect(BeaconEvent.LOCAL_RATE_LIMIT_REACHED).toBe('LOCAL_RATE_LIMIT_REACHED');

    // Pairing, transport & channel lifecycle
    expect(BeaconEvent.PAIR_INIT).toBe('PAIR_INIT');
    expect(BeaconEvent.PAIR_SUCCESS).toBe('PAIR_SUCCESS');
    expect(BeaconEvent.ACTIVE_TRANSPORT_SET).toBe('ACTIVE_TRANSPORT_SET');
    expect(BeaconEvent.TRANSPORT_STATUS_CHANGED).toBe('TRANSPORT_STATUS_CHANGED');
    expect(BeaconEvent.CHANNEL_CLOSED).toBe('CHANNEL_CLOSED');
    expect(BeaconEvent.RELAYER_ERROR).toBe('RELAYER_ERROR');
    expect(BeaconEvent.GENERIC_ERROR).toBe('GENERIC_ERROR');
    expect(BeaconEvent.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    expect(BeaconEvent.UNKNOWN).toBe('UNKNOWN');

    // UI lifecycle
    expect(BeaconEvent.SHOW_PREPARE).toBe('SHOW_PREPARE');
    expect(BeaconEvent.HIDE_UI).toBe('HIDE_UI');

    expect('OPEN_BUG_REPORT' in BeaconEvent).toBe(false);
  });

  it('should re-export BeaconError classes, toBeaconError, error guards, LocalStorage, and defaultEventCallbacks from main entry', () => {
    expect(MainBeaconError).toBe(BeaconError);
    expect(MainAbortedBeaconError).toBe(AbortedBeaconError);
    expect(MainPeerUnreachableBeaconError).toBe(PeerUnreachableBeaconError);
    expect(MainTransactionInvalidBeaconError).toBe(TransactionInvalidBeaconError);
    expect(mainGetError).toBe(getError);
    expect(mainIsBeaconError).toBe(isBeaconError);
    expect(mainIsErrorOrigin).toBe(isErrorOrigin);
    expect(mainIsErrorResponse).toBe(isErrorResponse);
    expect(mainIsRequestErrorResponse).toBe(isRequestErrorResponse);
    expect(mainIsTezosRpcError).toBe(isTezosRpcError);
    expect(typeof LocalStorage).toBe('function');
    expect(typeof defaultEventCallbacks).toBe('object');

    const converted = toBeaconError({
      id: 'req-1',
      version: '2',
      senderId: 'sender-1',
      type: BeaconMessageType.Error,
      errorType: BeaconErrorType.ABORTED_ERROR,
    });
    expect(converted).toBeInstanceOf(AbortedBeaconError);
    expect(isBeaconError(converted)).toBe(true);
  });

  it('should re-export i18n catalogs, helpers, and WalletConnect pairing classes from main entry', () => {
    expect(mainBuiltInLocales).toBe(builtInLocales);
    expect(mainEnMessages).toBe(enMessages);
    expect(mainFrMessages).toBe(frMessages);
    expect(mainEsMessages).toBe(esMessages);
    expect(mainDeMessages).toBe(deMessages);
    expect(mainJaMessages).toBe(jaMessages);
    expect(mainArMessages).toBe(arMessages);
    expect(mainConfigureBeaconI18n).toBe(configureBeaconI18n);
    expect(mainResetBeaconI18n).toBe(resetBeaconI18n);
    expect(mainSubscribeBeaconI18n).toBe(subscribeBeaconI18n);
    expect(mainSetBeaconLocale).toBe(setBeaconLocale);
    expect(mainGetBeaconLocale).toBe(getBeaconLocale);
    expect(mainResolveBeaconLang).toBe(resolveBeaconLang);
    expect(mainSetBeaconDirection).toBe(setBeaconDirection);
    expect(mainGetBeaconDirection).toBe(getBeaconDirection);
    expect(mainSetBeaconTranslations).toBe(setBeaconTranslations);
    expect(mainGetBeaconTranslations).toBe(getBeaconTranslations);
    expect(mainGetBeaconMessages).toBe(getBeaconMessages);
    expect(mainGetBeaconErrorCopy).toBe(getBeaconErrorCopy);
    expect(mainInterpolateBeaconMessage).toBe(interpolateBeaconMessage);
    expect(mainNormalizeLocaleTag).toBe(normalizeLocaleTag);
    expect(mainHasBuiltInLocale).toBe(hasBuiltInLocale);
    expect(mainResolveBuiltInLocaleCatalog).toBe(resolveBuiltInLocaleCatalog);
    expect(mainDetectBrowserLocale).toBe(detectBrowserLocale);
    expect(MainColorMode).toBe(ColorMode);
    expect(typeof mainSetColorMode).toBe('function');
    expect(typeof mainGetColorMode).toBe('function');
    expect(MainWalletConnectPairingRequest).toBe(WalletConnectPairingRequest);
    expect(MainExtendedWalletConnectPairingRequest).toBe(ExtendedWalletConnectPairingRequest);
  });
});

describe('package.json exports map', () => {
  const pkgDir = resolve(__dirname, '..');
  const distDir = resolve(pkgDir, 'dist');
  const pkg = JSON.parse(readFileSync(resolve(pkgDir, 'package.json'), 'utf-8'));

  it('should declare a ./types export', () => {
    expect(pkg.exports['./types']).toBeDefined();
  });

  // This test validates that the exports map points at real files.
  // It requires a prior build (dist/ must exist). Skip gracefully on
  // clean `nx test` runs where build hasn't happened yet.
  const hasDist = existsSync(distDir);
  (hasDist ? it : it.skip)('should point ./types at files that exist after build', () => {
    const typesExport = pkg.exports['./types'];
    for (const [condition, relPath] of Object.entries(typesExport)) {
      const fullPath = resolve(pkgDir, relPath as string);
      expect({ condition, exists: existsSync(fullPath) }).toEqual({
        condition,
        exists: true,
      });
    }
  });
});

// Type-level assertions: these assignments verify the types exist and are structurally correct.
// They never execute; they only need to compile.
const _opts: DAppClientOptions = {} as DAppClientOptions;
const _client: DAppClient | undefined = undefined;
const _disconnectOpts: DAppClientDisconnectOptions = { notifyPeers: false };
const _removeAllPeersOpts: DAppClientRemoveAllPeersOptions = { ignoreDisconnectErrors: true };
const _eventHandler: BeaconEventHandler | undefined = undefined;
const _lateEventPayload: BeaconEventType[BeaconEvent.LATE_RESPONSE_RECEIVED] | undefined =
  undefined;
const _errorOrigin: ErrorOrigin = 'local';
const _reqErr: RequestErrorResponse | undefined = undefined;
const _lateInfo: LateResponseInfo | undefined = undefined;
const _lateSuccess: LateSuccessResponseInfo | undefined = undefined;
const _lateError: LateErrorResponseInfo | undefined = undefined;
const _invalidAccountEvent: InvalidAccountDeactivatedEvent | undefined = undefined;
const _invalidAccountReason: InvalidAccountDeactivatedReason = 'missing_active_account';
const _respMsg: ResponseMessage | undefined = undefined;
const _respOut: ResponseOutput | undefined = undefined;
const _v3Payload: V3ResponsePayload | undefined = undefined;
const _wireErrMsg: WireErrorMessage | undefined = undefined;
const _wireErrPayload: WireErrorPayload | undefined = undefined;

const _perm: RequestPermissionInput = {} as RequestPermissionInput;
const _sign: RequestSignPayloadInput = {} as RequestSignPayloadInput;
const _opInput: RequestOperationInput = {} as RequestOperationInput;
const _bcastInput: RequestBroadcastInput = {} as RequestBroadcastInput;
const _partialOp: PartialTezosOperation | undefined = undefined;
const _nodes: NodeDistributions = {} as NodeDistributions;
const _acct: AccountInfo | undefined = undefined;
const _meta: AppMetadata | undefined = undefined;
const _explorer: BlockExplorerInterface | undefined = undefined;
const _bcastOut: BroadcastResponseOutput | undefined = undefined;
const _connCtx: ConnectionContext | undefined = undefined;
const _errResp: ErrorResponse | undefined = undefined;
const _net: Network | undefined = undefined;
const _opOut: OperationResponseOutput | undefined = undefined;
const _permOut: PermissionResponseOutput | undefined = undefined;
const _signOut: SignPayloadResponseOutput | undefined = undefined;
const _walletInfo: WalletInfo | undefined = undefined;
const _mainWalletInfo: MainWalletInfo | undefined = undefined;
const _uiOpts: DAppUiOptions = { enableToasts: false };
const _eventHandlerFn: BeaconEventHandlerFunction<MainTransportStatusChangedInfo> | undefined =
  undefined;
const _msgRecord: BeaconMessageRecord | undefined = undefined;
const _reqSent: RequestSentInfo | undefined = undefined;
const _reqResp: RequestResponseInfo | undefined = undefined;
const _ackInfo: AcknowledgeInfo | undefined = undefined;
const _activeTransport: ActiveTransportInfo | undefined = undefined;
const _permRespInfo: PermissionResponseInfo | undefined = undefined;
const _connInfo: ConnectionInfo | undefined = undefined;
const _mainConnInfo: MainConnectionInfo | undefined = undefined;
const _pendingReq: PendingRequestInfo | undefined = undefined;
const _mainPendingReq: MainPendingRequestInfo | undefined = undefined;
const _transportHealth: TransportHealth = 'ok';
const _mainTransportHealth: MainTransportHealth = 'degraded';
const _transportReason: TransportStatusChangeReason = 'sync_failing';
const _mainTransportReason: MainTransportStatusChangeReason = 'relay_changed';
const _transportStatusChanged: TransportStatusChangedInfo | undefined = undefined;
const _mainTransportStatusChanged: MainTransportStatusChangedInfo | undefined = undefined;
const _waitingAck: WaitingForWalletAckInfo | undefined = undefined;
const _mainWaitingAck: MainWaitingForWalletAckInfo | undefined = undefined;
const _errOpts: BeaconErrorOptions | undefined = undefined;
const _mainErrOpts: MainBeaconErrorOptions | undefined = undefined;
const _rpcErr: TezosRpcError | undefined = undefined;
const _mainRpcErr: MainTezosRpcError | undefined = undefined;
const _mainErrorOrigin: MainErrorOrigin = 'wallet';
const _mainReqErr: MainRequestErrorResponse | undefined = undefined;
const _acctId: AccountIdentifier | undefined = undefined;
const _storedAcct: StoredAccountInfo | undefined = undefined;
const _bcAcct: BlockchainAccountInfo | undefined = undefined;
const _peerInfo: PeerInfo | undefined = undefined;
const _extPeerInfo: ExtendedPeerInfo | undefined = undefined;
const _peerInfoType: PeerInfoType | undefined = undefined;
const _extraInfo: ExtraInfo | undefined = undefined;
const _ackResponse: AcknowledgeResponse | undefined = undefined;
const _msgWrapper: BeaconMessageWrapper<PermissionResponseV3> | undefined = undefined;
const _poeReqInput: ProofOfEventChallengeRequestInput | undefined = undefined;
const _poeRespOutput: ProofOfEventChallengeResponseOutput | undefined = undefined;
const _simPoeReqInput: SimulatedProofOfEventChallengeRequestInput | undefined = undefined;
const _simPoeRespOutput: SimulatedProofOfEventChallengeResponseOutput | undefined = undefined;
const _extPostPeer: ExtendedPostMessagePairingResponse | undefined = undefined;
const _extP2pPeer: ExtendedP2PPairingResponse | undefined = undefined;
const _extWcPeer: ExtendedWalletConnectPairingResponse | undefined = undefined;
const _storageChangeEvent: StorageChangeEvent | undefined = undefined;
const _storageChangeListener: StorageChangeListener | undefined = undefined;
const _i18nCfg: BeaconI18nConfig = { locale: 'fr', direction: 'auto' };
const _mainI18nCfg: MainBeaconI18nConfig = _i18nCfg;
const _localeMsgs: BeaconLocaleMessages | undefined = undefined;
const _mainLocaleMsgs: MainBeaconLocaleMessages | undefined = _localeMsgs;
const _localeMeta: BeaconLocaleMetadata | undefined = undefined;
const _mainLocaleMeta: MainBeaconLocaleMetadata | undefined = _localeMeta;
const _localeStatus: BeaconLocaleStatus = 'human-reviewed';
const _mainLocaleStatus: MainBeaconLocaleStatus = _localeStatus;
const _resolvedDir: BeaconResolvedDirection = 'rtl';
const _mainResolvedDir: MainBeaconResolvedDirection = _resolvedDir;
const _textDir: BeaconTextDirection = 'auto';
const _mainTextDir: MainBeaconTextDirection = _textDir;
const _translationOverrides: BeaconTranslationOverrides = { ui: { close: 'Fermer' } };
const _mainTranslationOverrides: MainBeaconTranslationOverrides = _translationOverrides;
const _dappMsgs: BeaconDAppMessages | undefined = undefined;
const _mainDappMsgs: MainBeaconDAppMessages | undefined = _dappMsgs;
const _uiMsgs: BeaconUIMessages | undefined = undefined;
const _mainUiMsgs: MainBeaconUIMessages | undefined = _uiMsgs;
const _ariaMsgs: BeaconAriaMessages | undefined = undefined;
const _mainAriaMsgs: MainBeaconAriaMessages | undefined = _ariaMsgs;
const _walletTypeMsgs: BeaconWalletTypeMessages | undefined = undefined;
const _mainWalletTypeMsgs: MainBeaconWalletTypeMessages | undefined = _walletTypeMsgs;
const _errCopy: BeaconErrorCopy | undefined = undefined;
const _mainErrCopy: MainBeaconErrorCopy | undefined = _errCopy;
const _deepPartial: DeepPartial<{ a: { b: string } }> = { a: {} };
const _mainDeepPartial: MainDeepPartial<{ a: { b: string } }> = _deepPartial;
const _displayableWcReason: DisplayableWalletConnectFailureReason = 'origin-not-allowed';
const _mainDisplayableWcReason: MainDisplayableWalletConnectFailureReason = _displayableWcReason;
const _wcErrCopy: WalletConnectErrorCopy | undefined = undefined;
const _mainWcErrCopy: MainWalletConnectErrorCopy | undefined = _wcErrCopy;
const _wcFailureReason: WalletConnectPairingFailureReason = 'relay-unreachable';
const _mainWcFailureReason: MainWalletConnectPairingFailureReason = _wcFailureReason;
const _wcPairingResult: WalletConnectPairingResult = { ok: false, reason: 'timeout' };
const _mainWcPairingResult: MainWalletConnectPairingResult = _wcPairingResult;
const _pairInitWcPeerInfo: BeaconEventType[BeaconEvent.PAIR_INIT]['walletConnectPeerInfo'] =
  Promise.resolve(_wcPairingResult);

void [
  _opts,
  _client,
  _disconnectOpts,
  _removeAllPeersOpts,
  _eventHandler,
  _lateEventPayload,
  _errorOrigin,
  _reqErr,
  _lateInfo,
  _lateSuccess,
  _lateError,
  _invalidAccountEvent,
  _invalidAccountReason,
  _respMsg,
  _respOut,
  _v3Payload,
  _wireErrMsg,
  _wireErrPayload,
  _perm,
  _sign,
  _opInput,
  _bcastInput,
  _partialOp,
  _nodes,
  _acct,
  _meta,
  _explorer,
  _bcastOut,
  _connCtx,
  _errResp,
  _net,
  _opOut,
  _permOut,
  _signOut,
  _walletInfo,
  _mainWalletInfo,
  _uiOpts,
  _eventHandlerFn,
  _msgRecord,
  _reqSent,
  _reqResp,
  _ackInfo,
  _activeTransport,
  _permRespInfo,
  _connInfo,
  _mainConnInfo,
  _pendingReq,
  _mainPendingReq,
  _transportHealth,
  _mainTransportHealth,
  _transportReason,
  _mainTransportReason,
  _transportStatusChanged,
  _mainTransportStatusChanged,
  _waitingAck,
  _mainWaitingAck,
  _errOpts,
  _mainErrOpts,
  _rpcErr,
  _mainRpcErr,
  _mainErrorOrigin,
  _mainReqErr,
  _acctId,
  _storedAcct,
  _bcAcct,
  _peerInfo,
  _extPeerInfo,
  _peerInfoType,
  _extraInfo,
  _ackResponse,
  _msgWrapper,
  _poeReqInput,
  _poeRespOutput,
  _simPoeReqInput,
  _simPoeRespOutput,
  _extPostPeer,
  _extP2pPeer,
  _extWcPeer,
  _storageChangeEvent,
  _storageChangeListener,
  _i18nCfg,
  _mainI18nCfg,
  _localeMsgs,
  _mainLocaleMsgs,
  _localeMeta,
  _mainLocaleMeta,
  _localeStatus,
  _mainLocaleStatus,
  _resolvedDir,
  _mainResolvedDir,
  _textDir,
  _mainTextDir,
  _translationOverrides,
  _mainTranslationOverrides,
  _dappMsgs,
  _mainDappMsgs,
  _uiMsgs,
  _mainUiMsgs,
  _ariaMsgs,
  _mainAriaMsgs,
  _walletTypeMsgs,
  _mainWalletTypeMsgs,
  _errCopy,
  _mainErrCopy,
  _deepPartial,
  _mainDeepPartial,
  _displayableWcReason,
  _mainDisplayableWcReason,
  _wcErrCopy,
  _mainWcErrCopy,
  _wcFailureReason,
  _mainWcFailureReason,
  _wcPairingResult,
  _mainWcPairingResult,
  _pairInitWcPeerInfo,
];
