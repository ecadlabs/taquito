/// <reference types="chrome" preserve="true" />
// Side-effect-free re-exports from @ecadlabs/beacon-types.
// Importing this module does NOT pull in the Beacon DAppClient or trigger
// any beacon-dapp initialization. Safe for type-only or enum-only usage.
//
// For BeaconEvent and DAppClientOptions, import from '@taquito/beacon-wallet'
// (the main entry point) instead, since those live in @ecadlabs/beacon-dapp
// which has unavoidable side effects.
import {
  hasBuiltInLocale,
  normalizeLocaleTag,
  type BeaconTranslationOverrides,
} from '@ecadlabs/beacon-types';

export {
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
} from '@ecadlabs/beacon-types';
export type {
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
} from '@ecadlabs/beacon-types';

/**
 * Detects the preferred browser or document locale tag for Beacon i18n.
 *
 * Inspects `navigator.languages` (falling back to `navigator.language`) in
 * priority order and returns the first BCP-47 tag supported by Beacon's
 * built-in locale catalog (or the primary browser language when custom
 * `translations` overrides are supplied).
 *
 * When the browser's primary preference is default English (`en*`) and the host
 * document explicitly declares a non-English supported `<html lang="...">`
 * attribute, the document language is preferred so localized host pages are
 * respected.
 */
export function detectBrowserLocale(translations?: BeaconTranslationOverrides): string | undefined {
  const nav =
    typeof globalThis !== 'undefined'
      ? (
          globalThis as {
            navigator?: { languages?: readonly string[]; language?: string };
          }
        ).navigator
      : undefined;
  const doc =
    typeof globalThis !== 'undefined'
      ? (
          globalThis as {
            document?: { documentElement?: { lang?: string } };
          }
        ).document
      : undefined;

  const rawCandidates: string[] = [];
  if (Array.isArray(nav?.languages) && nav.languages.length > 0) {
    for (const entry of nav.languages) {
      if (typeof entry === 'string' && entry.trim()) {
        rawCandidates.push(entry);
      }
    }
  } else if (typeof nav?.language === 'string' && nav.language.trim()) {
    rawCandidates.push(nav.language);
  }

  const docLang = normalizeLocaleTag(doc?.documentElement?.lang);
  const docPrimary = docLang?.split('-')[0]?.toLowerCase();
  const hasSupportedNonEnglishDocLang =
    Boolean(docLang) && docPrimary !== 'en' && (hasBuiltInLocale(docLang) || Boolean(translations));

  for (const candidate of rawCandidates) {
    const normalized = normalizeLocaleTag(candidate);
    if (!normalized) {
      continue;
    }
    if (hasBuiltInLocale(normalized)) {
      const candidatePrimary = normalized.split('-')[0]?.toLowerCase();
      if (candidatePrimary === 'en' && hasSupportedNonEnglishDocLang && docLang) {
        return docLang;
      }
      return normalized;
    }
  }

  if (translations && rawCandidates.length > 0) {
    const firstNormalized = normalizeLocaleTag(rawCandidates[0]);
    if (firstNormalized) {
      return firstNormalized;
    }
  }

  if (docLang && (hasBuiltInLocale(docLang) || Boolean(translations))) {
    return docLang;
  }

  return undefined;
}
