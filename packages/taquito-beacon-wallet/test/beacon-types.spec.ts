import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import {
  BeaconErrorType,
  BeaconMessageType,
  ColorMode,
  NetworkType,
  Origin,
  PermissionScope,
  Regions,
  SigningType,
  TransportStatus,
  TransportType,
} from '../src/beacon-types';

import type {
  AccountInfo,
  AppMetadata,
  BlockExplorerInterface,
  BroadcastResponseOutput,
  ConnectionContext,
  ErrorResponse,
  Network,
  NodeDistributions,
  OperationResponseOutput,
  PartialTezosOperation,
  PermissionResponseOutput,
  RequestBroadcastInput,
  RequestOperationInput,
  RequestPermissionInput,
  RequestSignPayloadInput,
  SignPayloadResponseOutput,
  WalletInfo,
} from '../src/beacon-types';

// BeaconEvent and DAppClientOptions live on the main entry point (not ./types)
// because they require @ecadlabs/beacon-dapp which has side effects.
import { BeaconEvent } from '../src/taquito-beacon-wallet';
import type {
  BeaconEventHandler,
  BeaconEventType,
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
});

describe('main entry re-exports (beacon-dapp types)', () => {
  it('should export BeaconEvent enum including 4.9.0-ecad-beta.0 changes', () => {
    expect(BeaconEvent.ACTIVE_ACCOUNT_SET).toBeDefined();
    expect(BeaconEvent.LATE_RESPONSE_RECEIVED).toBe('LATE_RESPONSE_RECEIVED');
    expect('OPEN_BUG_REPORT' in BeaconEvent).toBe(false);
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
];
