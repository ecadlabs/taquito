import { BeaconEvent } from '@taquito/beacon-wallet';
import type {
  BeaconEventHandler,
  BeaconEventType,
  BeaconWallet,
  DAppClient,
  DAppClientDisconnectOptions,
  DAppClientOptions,
  DAppClientRemoveAllPeersOptions,
  ErrorOrigin,
  InvalidAccountDeactivatedEvent,
  InvalidAccountDeactivatedReason,
  LateErrorResponseInfo,
  LateResponseInfo,
  LateSuccessResponseInfo,
  RequestErrorResponse,
  ResponseMessage,
  ResponseOutput,
  V3ResponsePayload,
  WireErrorMessage,
  WireErrorPayload,
} from '@taquito/beacon-wallet';

const wallet: BeaconWallet | undefined = undefined;
const client: DAppClient | undefined = undefined;
const options: DAppClientOptions | undefined = undefined;
const disconnectOptions: DAppClientDisconnectOptions = { notifyPeers: false };
const removeAllPeersOptions: DAppClientRemoveAllPeersOptions = { ignoreDisconnectErrors: true };
const eventHandler: BeaconEventHandler | undefined = undefined;
const lateEvent: BeaconEvent = BeaconEvent.LATE_RESPONSE_RECEIVED;
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
// @ts-expect-error ErrorOrigin only accepts 'local' | 'wallet'.
const invalidOrigin: ErrorOrigin = 'remote';

void [
  wallet,
  client,
  options,
  disconnectOptions,
  removeAllPeersOptions,
  eventHandler,
  lateEvent,
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
  invalidOrigin,
];
