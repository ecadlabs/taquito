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
} from '@taquito/beacon-wallet/types';
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
} from '@taquito/beacon-wallet/types';

const network: NetworkType = NetworkType.MAINNET;
const signingType: SigningType = SigningType.RAW;
const scope: PermissionScope = PermissionScope.OPERATION_REQUEST;
const region: Regions = Regions.EUROPE_WEST;
const errorType: BeaconErrorType = BeaconErrorType.PEER_UNREACHABLE;
const messageType: BeaconMessageType = BeaconMessageType.OperationResponse;
const colorMode: ColorMode = ColorMode.DARK;
const origin: Origin = Origin.P2P;
const transportStatus: TransportStatus = TransportStatus.CONNECTED;
const transportType: TransportType = TransportType.WALLETCONNECT;
const accountInfo: AccountInfo | undefined = undefined;
const appMetadata: AppMetadata | undefined = undefined;
const blockExplorer: BlockExplorerInterface | undefined = undefined;
const broadcastOutput: BroadcastResponseOutput | undefined = undefined;
const connectionContext: ConnectionContext | undefined = undefined;
const errorResponse: ErrorResponse | undefined = undefined;
const net: Network | undefined = undefined;
const nodes: NodeDistributions | undefined = undefined;
const opOutput: OperationResponseOutput | undefined = undefined;
const partialOp: PartialTezosOperation | undefined = undefined;
const permOutput: PermissionResponseOutput | undefined = undefined;
const reqBroadcast: RequestBroadcastInput | undefined = undefined;
const reqOp: RequestOperationInput | undefined = undefined;
const reqPerm: RequestPermissionInput | undefined = undefined;
const reqSign: RequestSignPayloadInput | undefined = undefined;
const signOutput: SignPayloadResponseOutput | undefined = undefined;
const walletInfo: WalletInfo | undefined = undefined;
// @ts-expect-error NetworkType remains an enum rather than accepting arbitrary strings.
const invalidNetwork: NetworkType = 'not-a-network';
void [
  network,
  signingType,
  scope,
  region,
  errorType,
  messageType,
  colorMode,
  origin,
  transportStatus,
  transportType,
  accountInfo,
  appMetadata,
  blockExplorer,
  broadcastOutput,
  connectionContext,
  errorResponse,
  net,
  nodes,
  opOutput,
  partialOp,
  permOutput,
  reqBroadcast,
  reqOp,
  reqPerm,
  reqSign,
  signOutput,
  walletInfo,
  invalidNetwork,
];
