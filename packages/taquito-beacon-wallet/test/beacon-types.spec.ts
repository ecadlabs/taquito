import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import {
  AbortedBeaconError,
  BeaconError,
  BeaconErrorType,
  BeaconMessageType,
  BroadcastBeaconError,
  ColorMode,
  getError,
  isBeaconError,
  isErrorOrigin,
  isErrorResponse,
  isRequestErrorResponse,
  isTezosRpcError,
  NetworkNotSupportedBeaconError,
  NetworkType,
  NoAddressBeaconError,
  NoPrivateKeyBeaconError,
  NotGrantedBeaconError,
  Origin,
  ParametersInvalidBeaconError,
  PeerUnreachableBeaconError,
  PermissionScope,
  Regions,
  SignatureTypeNotSupportedBeaconError,
  SigningType,
  Storage,
  StorageKey,
  TooManyOperationsBeaconError,
  TransactionInvalidBeaconError,
  TransportStatus,
  TransportType,
  UnknownBeaconError,
} from '../src/beacon-types';

import type {
  AccountIdentifier,
  AccountInfo,
  AcknowledgeResponse,
  AppMetadata,
  BeaconErrorOptions,
  BeaconMessageWrapper,
  BlockchainAccountInfo,
  BlockExplorerInterface,
  BroadcastResponseOutput,
  ConnectionContext,
  ConnectionInfo,
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
  WalletInfo,
} from '../src/beacon-types';

// BeaconEvent and DAppClientOptions live on the main entry point (not ./types)
// because they require @ecadlabs/beacon-dapp which has side effects.
import {
  AbortedBeaconError as MainAbortedBeaconError,
  BeaconError as MainBeaconError,
  BeaconEvent,
  defaultEventCallbacks,
  getError as mainGetError,
  isBeaconError as mainIsBeaconError,
  isErrorOrigin as mainIsErrorOrigin,
  isErrorResponse as mainIsErrorResponse,
  isRequestErrorResponse as mainIsRequestErrorResponse,
  isTezosRpcError as mainIsTezosRpcError,
  LocalStorage,
  PeerUnreachableBeaconError as MainPeerUnreachableBeaconError,
  toBeaconError,
  TransactionInvalidBeaconError as MainTransactionInvalidBeaconError,
} from '../src/taquito-beacon-wallet';
import type {
  AcknowledgeInfo,
  ActiveTransportInfo,
  BeaconErrorOptions as MainBeaconErrorOptions,
  BeaconEventHandler,
  BeaconEventHandlerFunction,
  BeaconEventType,
  BeaconMessageRecord,
  ConnectionInfo as MainConnectionInfo,
  DAppClient,
  DAppClientDisconnectOptions,
  DAppClientOptions,
  DAppClientRemoveAllPeersOptions,
  DAppUiOptions,
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
const _lateEventPayload: BeaconEventType[BeaconEvent.LATE_RESPONSE_RECEIVED] | undefined = undefined;
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
];
