import {
  AbortedBeaconError,
  BeaconError,
  BeaconEvent,
  defaultEventCallbacks,
  getError,
  isBeaconError,
  isErrorOrigin,
  isErrorResponse,
  isRequestErrorResponse,
  isTezosRpcError,
  LocalStorage,
  PeerUnreachableBeaconError,
  toBeaconError,
  TransactionInvalidBeaconError,
} from '@taquito/beacon-wallet';
import type {
  AcknowledgeInfo,
  ActiveTransportInfo,
  BeaconErrorOptions,
  BeaconEventHandler,
  BeaconEventHandlerFunction,
  BeaconEventType,
  BeaconMessageRecord,
  BeaconWallet,
  ConnectionInfo,
  DAppClient,
  DAppClientDisconnectOptions,
  DAppClientOptions,
  DAppClientRemoveAllPeersOptions,
  DAppUiOptions,
  ErrorOrigin,
  ExtraInfo,
  InvalidAccountDeactivatedEvent,
  InvalidAccountDeactivatedReason,
  LateErrorResponseInfo,
  LateResponseInfo,
  LateSuccessResponseInfo,
  PendingRequestInfo,
  PermissionResponseInfo,
  RequestErrorResponse,
  RequestResponseInfo,
  RequestSentInfo,
  ResponseMessage,
  ResponseOutput,
  TezosRpcError,
  TransportHealth,
  TransportStatusChangedInfo,
  TransportStatusChangeReason,
  V3ResponsePayload,
  WaitingForWalletAckInfo,
  WalletInfo,
  WireErrorMessage,
  WireErrorPayload,
} from '@taquito/beacon-wallet';

const wallet: BeaconWallet | undefined = undefined;
const client: DAppClient | undefined = undefined;
const options: DAppClientOptions | undefined = undefined;
const uiOptions: DAppUiOptions = { enableToasts: false };
const disconnectOptions: DAppClientDisconnectOptions = { notifyPeers: false };
const removeAllPeersOptions: DAppClientRemoveAllPeersOptions = { ignoreDisconnectErrors: true };
const eventHandler: BeaconEventHandler | undefined = undefined;
const eventHandlerFn: BeaconEventHandlerFunction<TransportStatusChangedInfo> | undefined =
  undefined;
const lateEvent: BeaconEvent = BeaconEvent.LATE_RESPONSE_RECEIVED;
const transportStatusEvent: BeaconEvent = BeaconEvent.TRANSPORT_STATUS_CHANGED;
const waitingAckEvent: BeaconEvent = BeaconEvent.WAITING_FOR_WALLET_ACK;
const lateEventPayload: BeaconEventType[BeaconEvent.LATE_RESPONSE_RECEIVED] | undefined = undefined;
const errorOrigin: ErrorOrigin = 'local';
const requestError: RequestErrorResponse | undefined = undefined;
const lateInfo: LateResponseInfo | undefined = undefined;
const lateSuccess: LateSuccessResponseInfo | undefined = undefined;
const lateError: LateErrorResponseInfo | undefined = undefined;
const invalidAccountEvent: InvalidAccountDeactivatedEvent | undefined = undefined;
const invalidAccountReason: InvalidAccountDeactivatedReason = 'missing_active_account';
const responseMsg: ResponseMessage | undefined = undefined;
const responseOut: ResponseOutput | undefined = undefined;
const v3Payload: V3ResponsePayload | undefined = undefined;
const wireErrorMsg: WireErrorMessage | undefined = undefined;
const wireErrorPayload: WireErrorPayload | undefined = undefined;
const walletInfo: WalletInfo | undefined = undefined;
const connectionInfo: ConnectionInfo | undefined = undefined;
const pendingRequest: PendingRequestInfo | undefined = undefined;
const transportHealth: TransportHealth = 'ok';
const transportReason: TransportStatusChangeReason = 'sync_failing';
const transportStatusChanged: TransportStatusChangedInfo | undefined = undefined;
const waitingAck: WaitingForWalletAckInfo | undefined = undefined;
const msgRecord: BeaconMessageRecord | undefined = undefined;
const reqSent: RequestSentInfo | undefined = undefined;
const reqResp: RequestResponseInfo | undefined = undefined;
const ackInfo: AcknowledgeInfo | undefined = undefined;
const activeTransport: ActiveTransportInfo | undefined = undefined;
const permRespInfo: PermissionResponseInfo | undefined = undefined;
const extraInfo: ExtraInfo | undefined = undefined;
const beaconErrorOpts: BeaconErrorOptions | undefined = undefined;
const rpcErr: TezosRpcError | undefined = undefined;
// @ts-expect-error ErrorOrigin only accepts 'local' | 'wallet'.
const invalidOrigin: ErrorOrigin = 'remote';

void [
  AbortedBeaconError,
  BeaconError,
  defaultEventCallbacks,
  getError,
  isBeaconError,
  isErrorOrigin,
  isErrorResponse,
  isRequestErrorResponse,
  isTezosRpcError,
  LocalStorage,
  PeerUnreachableBeaconError,
  toBeaconError,
  TransactionInvalidBeaconError,
  wallet,
  client,
  options,
  uiOptions,
  disconnectOptions,
  removeAllPeersOptions,
  eventHandler,
  eventHandlerFn,
  lateEvent,
  transportStatusEvent,
  waitingAckEvent,
  lateEventPayload,
  errorOrigin,
  requestError,
  lateInfo,
  lateSuccess,
  lateError,
  invalidAccountEvent,
  invalidAccountReason,
  responseMsg,
  responseOut,
  v3Payload,
  wireErrorMsg,
  wireErrorPayload,
  walletInfo,
  connectionInfo,
  pendingRequest,
  transportHealth,
  transportReason,
  transportStatusChanged,
  waitingAck,
  msgRecord,
  reqSent,
  reqResp,
  ackInfo,
  activeTransport,
  permRespInfo,
  extraInfo,
  beaconErrorOpts,
  rpcErr,
  invalidOrigin,
];
