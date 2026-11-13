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
} from '@taquito/beacon-wallet/types';
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
const connectionInfo: ConnectionInfo | undefined = undefined;
const pendingRequest: PendingRequestInfo | undefined = undefined;
const transportHealth: TransportHealth = 'ok';
const transportReason: TransportStatusChangeReason = 'sync_failing';
const transportStatusChanged: TransportStatusChangedInfo | undefined = undefined;
const waitingAck: WaitingForWalletAckInfo | undefined = undefined;
const errorOrigin: ErrorOrigin = 'wallet';
const requestErrorResponse: RequestErrorResponse | undefined = undefined;
const beaconErrorOpts: BeaconErrorOptions | undefined = undefined;
const rpcErr: TezosRpcError | undefined = undefined;
const accountId: AccountIdentifier | undefined = undefined;
const storedAccount: StoredAccountInfo | undefined = undefined;
const blockchainAccount: BlockchainAccountInfo | undefined = undefined;
const peerInfo: PeerInfo | undefined = undefined;
const extendedPeerInfo: ExtendedPeerInfo | undefined = undefined;
const peerInfoType: PeerInfoType | undefined = undefined;
const ackResponse: AcknowledgeResponse | undefined = undefined;
const msgWrapper: BeaconMessageWrapper<PermissionResponseV3> | undefined = undefined;
const poeReqInput: ProofOfEventChallengeRequestInput | undefined = undefined;
const poeRespOutput: ProofOfEventChallengeResponseOutput | undefined = undefined;
const simPoeReqInput: SimulatedProofOfEventChallengeRequestInput | undefined = undefined;
const simPoeRespOutput: SimulatedProofOfEventChallengeResponseOutput | undefined = undefined;
const extPostPeer: ExtendedPostMessagePairingResponse | undefined = undefined;
const extP2pPeer: ExtendedP2PPairingResponse | undefined = undefined;
const extWcPeer: ExtendedWalletConnectPairingResponse | undefined = undefined;
const storageChangeEvent: StorageChangeEvent | undefined = undefined;
const storageChangeListener: StorageChangeListener | undefined = undefined;
// @ts-expect-error NetworkType remains an enum rather than accepting arbitrary strings.
const invalidNetwork: NetworkType = 'not-a-network';
void [
  AbortedBeaconError,
  BeaconError,
  BroadcastBeaconError,
  getError,
  isBeaconError,
  isErrorOrigin,
  isErrorResponse,
  isRequestErrorResponse,
  isTezosRpcError,
  NetworkNotSupportedBeaconError,
  NoAddressBeaconError,
  NoPrivateKeyBeaconError,
  NotGrantedBeaconError,
  ParametersInvalidBeaconError,
  PeerUnreachableBeaconError,
  SignatureTypeNotSupportedBeaconError,
  Storage,
  StorageKey,
  TooManyOperationsBeaconError,
  TransactionInvalidBeaconError,
  UnknownBeaconError,
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
  connectionInfo,
  pendingRequest,
  transportHealth,
  transportReason,
  transportStatusChanged,
  waitingAck,
  errorOrigin,
  requestErrorResponse,
  beaconErrorOpts,
  rpcErr,
  accountId,
  storedAccount,
  blockchainAccount,
  peerInfo,
  extendedPeerInfo,
  peerInfoType,
  ackResponse,
  msgWrapper,
  poeReqInput,
  poeRespOutput,
  simPoeReqInput,
  simPoeRespOutput,
  extPostPeer,
  extP2pPeer,
  extWcPeer,
  storageChangeEvent,
  storageChangeListener,
  invalidNetwork,
];
